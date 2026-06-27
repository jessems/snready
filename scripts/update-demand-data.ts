#!/usr/bin/env npx tsx
/**
 * Weekly Demand Data Update Script
 * Fetches job demand scores for ServiceNow certifications using Brave Search API
 * Run via cron: every Monday 6 AM UTC
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const BRAVE_API_KEY = process.env.BRAVE_API_KEY;
if (!BRAVE_API_KEY) {
  console.error('Error: BRAVE_API_KEY environment variable required');
  process.exit(1);
}

interface CertificationDemand {
  slug: string;
  name: string;
  fullName: string;
  jobCount: number;
  linkedInCount: number;
  indeedCount: number;
  previousJobCount?: number;
  weekOverWeekChange?: number;
  trend: 'up' | 'down' | 'stable';
  hiddenGem: boolean;
  hiddenGemReason?: string;
}

interface DemandData {
  lastUpdated: string;
  totalJobs: number;
  certifications: CertificationDemand[];
  hiddenGems: string[];
  topCerts: string[];
}

// Load certifications
const certsPath = join(process.cwd(), 'data', 'certifications.json');
const certsData = JSON.parse(readFileSync(certsPath, 'utf-8'));

// Load previous demand data if exists
const demandPath = join(process.cwd(), 'data', 'demand-data.json');
let previousData: DemandData | null = null;
if (existsSync(demandPath)) {
  try {
    previousData = JSON.parse(readFileSync(demandPath, 'utf-8'));
  } catch {
    console.log('No valid previous demand data found');
  }
}

interface BraveResult {
  title: string;
  url: string;
  description: string;
}

interface BraveSearchResponse {
  web?: {
    results?: BraveResult[];
  };
}

async function searchBrave(query: string): Promise<BraveResult[]> {
  const url = new URL('https://api.search.brave.com/res/v1/web/search');
  url.searchParams.set('q', query);
  url.searchParams.set('count', '20');
  
  try {
    const res = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': BRAVE_API_KEY!
      }
    });
    
    if (!res.ok) {
      console.error(`Brave API error: ${res.status}`);
      return [];
    }
    
    const data = await res.json() as BraveSearchResponse;
    return data.web?.results || [];
  } catch (err) {
    console.error(`Error searching:`, err);
    return [];
  }
}

// Extract job count from Indeed/LinkedIn snippets
function extractJobCount(results: BraveResult[]): { linkedin: number; indeed: number } {
  let linkedin = 0;
  let indeed = 0;
  
  for (const r of results) {
    // LinkedIn: "1,234 jobs" or "500+ jobs"
    if (r.url.includes('linkedin.com')) {
      const match = r.description.match(/([\d,]+)\+?\s*(?:jobs?|positions?|openings?)/i) 
        || r.title.match(/([\d,]+)\+?\s*(?:jobs?|positions?|openings?)/i);
      if (match) {
        const count = parseInt(match[1].replace(/,/g, ''), 10);
        linkedin = Math.max(linkedin, count);
      }
    }
    
    // Indeed: "X jobs available" in descriptions
    if (r.url.includes('indeed.com')) {
      const match = r.description.match(/([\d,]+)\+?\s*(?:jobs?|positions?|available)/i)
        || r.title.match(/([\d,]+)\+?\s*(?:jobs?|positions?)/i);
      if (match) {
        const count = parseInt(match[1].replace(/,/g, ''), 10);
        indeed = Math.max(indeed, count);
      }
    }
  }
  
  return { linkedin, indeed };
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('🔍 Updating ServiceNow certification demand data...\n');
  
  const results: CertificationDemand[] = [];
  let totalJobs = 0;
  
  for (const cert of certsData.certifications) {
    // Search for job postings
    const searchQuery = `ServiceNow "${cert.name}" OR "${cert.fullName}" jobs`;
    
    console.log(`Searching: ${cert.name}...`);
    const searchResults = await searchBrave(searchQuery);
    const counts = extractJobCount(searchResults);
    
    // Combined job count (use max of either source, or estimate from result count)
    const jobCount = Math.max(counts.linkedin, counts.indeed, searchResults.length * 50);
    
    // Find previous count for this cert
    const prevCert = previousData?.certifications.find(c => c.slug === cert.slug);
    const previousJobCount = prevCert?.jobCount;
    
    // Calculate week-over-week change
    let weekOverWeekChange: number | undefined;
    let trend: 'up' | 'down' | 'stable' = 'stable';
    
    if (previousJobCount !== undefined && previousJobCount > 0) {
      weekOverWeekChange = Math.round(((jobCount - previousJobCount) / previousJobCount) * 100);
      if (weekOverWeekChange > 5) trend = 'up';
      else if (weekOverWeekChange < -5) trend = 'down';
    }
    
    // Hidden gem = good demand but not CSA/CAD (the obvious ones)
    const hiddenGem = jobCount > 500 && !['csa', 'cad', 'cta'].includes(cert.slug);
    
    results.push({
      slug: cert.slug,
      name: cert.name,
      fullName: cert.fullName,
      jobCount,
      linkedInCount: counts.linkedin,
      indeedCount: counts.indeed,
      previousJobCount,
      weekOverWeekChange,
      trend,
      hiddenGem,
      hiddenGemReason: hiddenGem ? `${jobCount.toLocaleString()} estimated jobs - underrated certification` : undefined
    });
    
    totalJobs += jobCount;
    console.log(`  → LinkedIn: ${counts.linkedin}, Indeed: ${counts.indeed}, Est: ${jobCount} ${trend === 'up' ? '📈' : trend === 'down' ? '📉' : '➡️'}`);
    
    // Rate limit: 1.5 seconds between requests
    await delay(1500);
  }
  
  // Sort by job count descending
  results.sort((a, b) => b.jobCount - a.jobCount);
  
  // Find hidden gems
  const hiddenGems = results
    .filter(c => c.hiddenGem)
    .map(c => c.slug);
  
  const topCerts = results.slice(0, 5).map(c => c.slug);
  
  const demandData: DemandData = {
    lastUpdated: new Date().toISOString(),
    totalJobs,
    certifications: results,
    hiddenGems,
    topCerts
  };
  
  // Save the data
  writeFileSync(demandPath, JSON.stringify(demandData, null, 2));
  
  console.log('\n✅ Demand data updated successfully!');
  console.log(`📊 Total estimated job postings: ${totalJobs.toLocaleString()}`);
  console.log(`💎 Hidden gems found: ${hiddenGems.length} (${hiddenGems.join(', ') || 'none'})`);
  
  // Print top 5 in-demand certifications
  console.log('\n🏆 Top 5 In-Demand Certifications:');
  results.slice(0, 5).forEach((c, i) => {
    console.log(`  ${i + 1}. ${c.name}: ~${c.jobCount.toLocaleString()} jobs`);
  });
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
