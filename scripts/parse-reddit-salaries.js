#!/usr/bin/env node
// Parse Reddit salary comments and output SQL INSERT statements

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data/reddit-salary-threads');

// Parse salary from text like "$130k", "130000", "£40k", "99,000", etc.
function parseSalary(text) {
  // Look for patterns like $130k, $130,000, 130k, etc.
  const patterns = [
    /[\$£€]\s*(\d{1,3})[,.]?(\d{3})/,      // $130,000 or $130.000
    /[\$£€]\s*(\d{2,3})\s*[kK]/,            // $130k
    /(\d{2,3})[kK]\s*(salary|base|year|annual)?/i,  // 130k salary
    /(\d{1,3})[,.](\d{3})\s*(salary|base|year|annual|usd|\$)?/i,  // 130,000 salary
    /making\s*[\$£€]?\s*(\d{1,3})[,.]?(\d{3})?[kK]?/i,  // making $130k
    /salary[:\s]+[\$£€]?\s*(\d{1,3})[,.]?(\d{3})?[kK]?/i,  // salary: $130k
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      let num = parseInt(match[1]);
      if (match[2] && match[2].length === 3) {
        num = parseInt(match[1] + match[2]);
      } else if (num < 1000) {
        num = num * 1000;
      }
      if (num >= 20000 && num <= 500000) {
        return num;
      }
    }
  }
  return null;
}

// Parse YoE from text
function parseYoE(text) {
  const patterns = [
    /(\d+)\+?\s*(?:years?|y|yrs?)\s*(?:of\s+)?(?:exp|experience)?/i,
    /(\d+)\+?\s*(?:years?|y|yrs?)\s*(?:in\s+)?(?:sn|servicenow|snow)/i,
    /been\s+(?:in\s+)?(?:sn|servicenow)?\s*(?:for\s+)?(\d+)\s*(?:years?|y)/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return parseInt(match[1]);
  }
  return null;
}

// Map YoE to range
function yoeToRange(yoe) {
  if (!yoe) return null;
  if (yoe < 1) return '<1 year';
  if (yoe <= 2) return '1-2 years';
  if (yoe <= 5) return '3-5 years';
  if (yoe <= 10) return '6-10 years';
  return '10+ years';
}

// Extract certifications
function parseCerts(text) {
  const certs = [];
  const certPatterns = [
    'CSA', 'CAD', 'CIS-ITSM', 'CIS-HR', 'CIS-CSM', 'CIS-Discovery', 
    'CIS-SM', 'CIS-SAM', 'CIS-HAM', 'CIS-PA', 'CIS-EM', 'CIS-RC',
    'CIS-TPRM', 'CIS-SPM', 'CIS-VR', 'CIS-SIR', 'CTA', 'ITIL'
  ];
  const upper = text.toUpperCase();
  for (const cert of certPatterns) {
    if (upper.includes(cert.toUpperCase())) {
      certs.push(cert);
    }
  }
  return certs;
}

// Detect role from text
function parseRole(text) {
  const lower = text.toLowerCase();
  if (lower.includes('architect')) return 'Architect';
  if (lower.includes('consultant')) return 'Consultant';
  if (lower.includes('product owner') || lower.includes('product manager') || lower.includes('po ')) return 'Product Owner';
  if (lower.includes('manager') || lower.includes(' lead') || lower.includes('team lead')) return 'Manager';
  if (lower.includes('senior dev') || lower.includes('sr dev') || lower.includes('sr. dev')) return 'Developer';
  if (lower.includes('developer') || lower.includes(' dev ') || lower.includes(' dev,')) return 'Developer';
  if (lower.includes('admin')) return 'Administrator';
  if (lower.includes('engineer')) return 'Developer';
  return null;
}

// Detect country
function parseCountry(text) {
  const lower = text.toLowerCase();
  if (lower.includes('uk') || lower.includes('united kingdom') || lower.includes('london') || text.includes('£')) return 'GB';
  if (lower.includes('canada') || lower.includes('canadian') || lower.includes('toronto') || lower.includes('ontario')) return 'CA';
  if (lower.includes('india') || lower.includes('bangalore') || lower.includes('hyderabad') || lower.includes('inr') || text.includes('₹')) return 'IN';
  if (lower.includes('australia') || lower.includes('sydney') || lower.includes('melbourne')) return 'AU';
  if (lower.includes('germany') || lower.includes('berlin') || lower.includes('munich')) return 'DE';
  // US states/cities
  if (/\b(california|ca|texas|tx|florida|fl|new york|ny|nc|ohio|virginia|va|colorado|georgia|ga|illinois|washington|seattle|chicago|austin|denver|atlanta|boston|raleigh|durham)\b/i.test(text)) return 'US';
  if (text.includes('$') && !lower.includes('cad') && !lower.includes('aud')) return 'US';
  return null;
}

// Extract city/location
function parseLocation(text) {
  const patterns = [
    /location[:\s]+([A-Za-z\s,]+?)(?:\.|$|\n)/i,
    /(?:in|from|based in)\s+([A-Za-z\s,]+?)(?:\.|$|\n|working)/i,
    /\b(california|texas|florida|new york|north carolina|ohio|virginia|colorado|georgia|illinois|washington|seattle|chicago|austin|denver|atlanta|boston|raleigh|durham|toronto|london|bangalore|hyderabad|sydney|melbourne)\b/i,
  ];
  
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1].trim().substring(0, 50);
  }
  return null;
}

// Check for remote work
function parseRemote(text) {
  const lower = text.toLowerCase();
  if (lower.includes('fully remote') || lower.includes('100% remote') || lower.includes('full remote')) return 100;
  if (lower.includes('hybrid')) return 50;
  if (lower.includes('remote')) return 80;
  return null;
}

// Parse a single comment - now more flexible
function parseComment(body, commentId, source) {
  if (!body || body === '[deleted]' || body === '[removed]' || body.length < 20) return null;
  
  const salary = parseSalary(body);
  if (!salary) return null;
  
  let role = parseRole(body);
  if (!role) {
    // Default to Developer if salary is mentioned but role isn't clear
    if (salary >= 60000) role = 'Developer';
    else return null;
  }
  
  const country = parseCountry(body);
  if (!country) return null; // Skip if we can't determine country
  
  const yoe = parseYoE(body);
  const certs = parseCerts(body);
  const location = parseLocation(body);
  const remote = parseRemote(body);

  return {
    role,
    salary,
    yoe: yoeToRange(yoe),
    certs: JSON.stringify(certs),
    country,
    city: location,
    remote,
    source,
    sourceId: commentId
  };
}

// Main
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
const results = [];
const seen = new Set();

for (const file of files) {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(dataDir, file)));
    const source = `reddit-${file.replace('.json', '')}`;
    
    for (const comment of data.data || []) {
      const parsed = parseComment(comment.body, comment.id, source);
      if (parsed && !seen.has(parsed.sourceId)) {
        seen.add(parsed.sourceId);
        results.push(parsed);
      }
    }
  } catch (e) {
    console.error(`-- Error parsing ${file}: ${e.message}`);
  }
}

// Output SQL
console.log('-- Parsed Reddit salary data');
console.log(`-- Total: ${results.length} entries\n`);

for (const r of results) {
  const city = r.city ? `'${r.city.replace(/'/g, "''")}'` : 'NULL';
  const sql = `INSERT OR IGNORE INTO salary_submissions (role, base_salary, yoe_servicenow, certifications, country, city, remote_pct, source, source_id, source_url) VALUES ('${r.role}', ${r.salary}, ${r.yoe ? `'${r.yoe}'` : 'NULL'}, '${r.certs}', '${r.country}', ${city}, ${r.remote || 'NULL'}, '${r.source}', '${r.sourceId}', 'https://reddit.com');`;
  console.log(sql);
}
