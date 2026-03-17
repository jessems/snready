#!/usr/bin/env node
/**
 * Scrape ServiceNow release notes from khub API for all major versions.
 * Outputs structured JSON files per version to data/release-notes/
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const MAP_IDS = {
  xanadu: '3ongaT2PAVB3Cqoicgnoxg',
  yokohama: 'PbLI49fkISDFEQlMw_00Gg',
  'washington-dc': 'Iru_OmfY8svQHlgM89Nuiw',
  zurich: 'u1slaAtcFiiXFQcd9RcR_A',
};

const BASE = 'https://www.servicenow.com/docs/api/khub/maps';
const DELAY = 200; // ms between requests

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchJSON(url) {
  const res = await fetch(url, {
    headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36' }
  });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function fetchTopicContent(mapId, contentId) {
  try {
    const url = `${BASE}/${mapId}/topics/${contentId}/content`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36' }
    });
    if (!res.ok) throw new Error(`${res.status}`);
    // This endpoint returns HTML directly, not JSON
    return await res.text();
  } catch (e) {
    console.error(`  Failed to fetch content ${contentId}: ${e.message}`);
    return null;
  }
}

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(p|div|h[1-6]|li|tr)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Recursively collect all topics from TOC tree
function collectTopics(node, path = []) {
  const topics = [];
  const currentPath = node.title ? [...path, node.title] : path;
  
  if (node.contentId) {
    topics.push({
      title: node.title,
      contentId: node.contentId,
      path: currentPath,
      prettyUrl: node.prettyUrl || null,
    });
  }
  
  if (node.children) {
    for (const child of node.children) {
      topics.push(...collectTopics(child, currentPath));
    }
  }
  
  return topics;
}

// Find the "Features and changes by product" section
function findFeaturesSection(toc) {
  const root = toc.paginatedToc?.[0];
  if (!root) return null;
  
  // Recursively search for "Features and changes by product" or similar
  function search(node) {
    if (node.title && /features and changes by product/i.test(node.title)) return node;
    if (node.title && /release notes for upgrading from/i.test(node.title)) {
      // Check children
      for (const child of (node.children || [])) {
        if (/features and changes/i.test(child.title)) return child;
      }
    }
    for (const child of (node.children || [])) {
      const found = search(child);
      if (found) return found;
    }
    return null;
  }
  
  return search(root);
}

// Find N-1 release notes (most common upgrade path)
function findN1Section(toc) {
  const root = toc.paginatedToc?.[0];
  if (!root) return null;
  
  function search(node) {
    if (node.title && /release notes for upgrading from/i.test(node.title)) return node;
    for (const child of (node.children || [])) {
      const found = search(child);
      if (found) return found;
    }
    return null;
  }
  
  // Find "Learn about the X release" section first
  for (const child of (root.children || [])) {
    if (/learn about/i.test(child.title)) {
      // Get the first "Release notes for upgrading from" (N-1)
      for (const grandchild of (child.children || [])) {
        if (/release notes for upgrading from/i.test(grandchild.title)) {
          return grandchild;
        }
      }
    }
  }
  
  return search(root);
}

async function scrapeVersion(version, mapId) {
  console.log(`\n=== Scraping ${version} (${mapId}) ===`);
  
  // Get TOC
  const toc = await fetchJSON(`${BASE}/${mapId}/pages`);
  
  // Find the features section (inside N-1 release notes)
  const n1Section = findN1Section(toc);
  if (!n1Section) {
    console.log(`  No N-1 section found, collecting all topics...`);
  } else {
    console.log(`  Found: ${n1Section.title}`);
  }
  
  const featuresSection = n1Section ? 
    (n1Section.children || []).find(c => /features and changes/i.test(c.title)) : 
    findFeaturesSection(toc);
  
  if (!featuresSection) {
    console.log(`  No "Features and changes" section found. Collecting top-level topics.`);
  }
  
  // Collect product areas
  const productAreas = [];
  const sourceNode = featuresSection || n1Section || toc.paginatedToc?.[0];
  
  if (!sourceNode) {
    console.log(`  ERROR: No usable TOC structure found`);
    return null;
  }
  
  // For each product area, collect its topics
  for (const productNode of (sourceNode.children || [])) {
    const productName = productNode.title.replace(/ release notes$/i, '').trim();
    const topics = collectTopics(productNode);
    
    console.log(`  ${productName}: ${topics.length} topics`);
    
    // Fetch content for each topic (with rate limiting)
    const entries = [];
    for (const topic of topics) {
      await sleep(DELAY);
      const html = await fetchTopicContent(mapId, topic.contentId);
      if (html) {
        const text = stripHtml(html);
        if (text.length > 50) { // Skip near-empty pages
          entries.push({
            title: topic.title,
            product: productName,
            text: text.substring(0, 5000), // Cap at 5K chars per topic
            url: topic.prettyUrl ? `https://www.servicenow.com/docs/bundle/${version}-release-notes/page/${topic.prettyUrl}` : null,
          });
        }
      }
    }
    
    if (entries.length > 0) {
      productAreas.push({
        product: productName,
        entries,
      });
    }
  }
  
  // Also get the highlights/summary page
  const root = toc.paginatedToc?.[0];
  let highlights = null;
  for (const child of (root?.children || [])) {
    if (/highlight|general availability/i.test(child.title) && child.contentId) {
      await sleep(DELAY);
      const html = await fetchTopicContent(mapId, child.contentId);
      if (html) highlights = stripHtml(html);
      break;
    }
  }
  
  // Determine "from" version
  let fromVersion = null;
  if (n1Section?.title) {
    const match = n1Section.title.match(/from\s+(.+?)(?:\s+to|\s*$)/i);
    if (match) fromVersion = match[1].trim();
  }
  
  return {
    version,
    fromVersion,
    highlights,
    productAreas,
    totalTopics: productAreas.reduce((sum, pa) => sum + pa.entries.length, 0),
    scrapedAt: new Date().toISOString(),
  };
}

async function main() {
  const outDir = join(process.cwd(), 'data', 'release-notes');
  mkdirSync(outDir, { recursive: true });
  
  const versions = process.argv[2] ? [process.argv[2]] : Object.keys(MAP_IDS);
  
  for (const version of versions) {
    const mapId = MAP_IDS[version];
    if (!mapId) {
      console.error(`Unknown version: ${version}`);
      continue;
    }
    
    try {
      const data = await scrapeVersion(version, mapId);
      if (data) {
        const outFile = join(outDir, `${version}.json`);
        writeFileSync(outFile, JSON.stringify(data, null, 2));
        console.log(`\n  ✅ Saved ${outFile} (${data.totalTopics} topics, ${data.productAreas.length} products)`);
      }
    } catch (e) {
      console.error(`  ERROR scraping ${version}: ${e.message}`);
    }
  }
  
  console.log('\nDone!');
}

main();
