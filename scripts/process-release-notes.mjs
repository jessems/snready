#!/usr/bin/env node
/**
 * Process raw release notes into a lighter summary format for the UI.
 * Creates data/release-notes/summary.json with structured entries.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const dataDir = join(process.cwd(), 'data', 'release-notes');
const versions = ['washington-dc', 'xanadu', 'yokohama', 'zurich'];

// Map product areas to cert relevance
const CERT_RELEVANCE = {
  'IT Service Management': ['CIS-ITSM', 'CSA'],
  'Customer Service Management': ['CIS-CSM'],
  'IT Asset Management': ['CIS-HAM', 'CIS-SAM'],
  'IT Operations Management': ['CIS-Discovery'],
  'Security Operations': ['CIS-SIR'],
  'Field Service Management': ['CIS-FSM'],
  'Employee Service Management': ['CIS-HR'],
  'Governance, Risk, and Compliance': ['CIS-RC'],
  'Platform Analytics': ['CIS-PA'],
  'Strategic Portfolio Management': ['CIS-SPM'],
  'ServiceNow AI Platform administration': ['CSA'],
  'ServiceNow AI Platform capabilities': ['CSA', 'CAD'],
  'ServiceNow AI Platform user interface': ['CSA', 'CAD'],
  'ServiceNow AI Platform security': ['CSA'],
  'Hyperautomation and Low-code': ['CAD'],
  'App development and low-code': ['CAD'],
  'API': ['CAD'],
  'Now Assist': ['CSA'],
  'Now Assist and agentic AI': ['CSA'],
  'Mobile Platform': ['CSA'],
};

// Categorize content type from text
function categorizeEntry(text) {
  const lower = text.toLowerCase();
  if (/\bnew\b.*\bfeature|new in the|new\b.*\brelease|introduced\b/i.test(text)) return 'new';
  if (/\bchanged?\b.*\bbehavior|update[ds]?\b.*\bto\b|modified|enhanced/i.test(text)) return 'changed';
  if (/\bdeprecated|removed|no longer|end of support/i.test(text)) return 'deprecated';
  if (/\bfixed?\b|resolved|corrected|bug/i.test(text)) return 'fixed';
  return 'new'; // default
}

// Extract summary from text (first meaningful paragraph)
function extractSummary(text, maxLen = 300) {
  // Remove the title line and metadata
  const lines = text.split('\n').filter(l => l.trim().length > 20);
  // Skip lines that are just metadata
  const meaningful = lines.filter(l => 
    !/^(release version|updated |minutes to read|\s*table \d)/i.test(l.trim())
  );
  const summary = meaningful.slice(0, 3).join(' ').substring(0, maxLen);
  return summary.trim() || text.substring(0, maxLen).trim();
}

// Determine impact level
function determineImpact(text) {
  const lower = text.toLowerCase();
  if (/breaking|deprecated|removed|mandatory|must|critical/i.test(text)) return 'high';
  if (/enhanced|improved|updated|new feature|new in/i.test(text)) return 'medium';
  return 'low';
}

const summary = {
  versions: {},
  products: new Set(),
  generatedAt: new Date().toISOString(),
};

for (const version of versions) {
  const filePath = join(dataDir, `${version}.json`);
  let raw;
  try {
    raw = JSON.parse(readFileSync(filePath, 'utf-8'));
  } catch (e) {
    console.error(`Skipping ${version}: ${e.message}`);
    continue;
  }

  const versionName = version === 'washington-dc' ? 'Washington DC' : 
    version.charAt(0).toUpperCase() + version.slice(1);

  const versionData = {
    name: versionName,
    slug: version,
    fromVersion: raw.fromVersion || null,
    totalEntries: 0,
    products: [],
  };

  for (const pa of raw.productAreas) {
    summary.products.add(pa.product);
    
    const entries = pa.entries.map(entry => ({
      title: entry.title.replace(/ release notes$/i, '').trim(),
      type: categorizeEntry(entry.text),
      impact: determineImpact(entry.text),
      summary: extractSummary(entry.text),
      url: entry.url,
      certRelevance: CERT_RELEVANCE[pa.product] || [],
    }));

    versionData.products.push({
      name: pa.product,
      slug: pa.product.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      entryCount: entries.length,
      entries,
    });
    
    versionData.totalEntries += entries.length;
  }

  summary.versions[version] = versionData;
  console.log(`${versionName}: ${versionData.totalEntries} entries across ${versionData.products.length} products`);
}

summary.products = [...summary.products].sort();

const outFile = join(dataDir, 'summary.json');
writeFileSync(outFile, JSON.stringify(summary, null, 2));
console.log(`\n✅ Saved ${outFile} (${(JSON.stringify(summary).length / 1024).toFixed(0)}KB)`);
