#!/usr/bin/env node
/**
 * Generate coverage manifest by scanning scraped courses and docs
 * Outputs to data/coverage/coverage-manifest.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data');
const SCRAPER_DIR = path.join(__dirname, '../../sn-course-scraper');

// Load certification sources
const sourcesPath = path.join(DATA_DIR, 'coverage/certification-sources.json');
const sources = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));

// Interactive courses that can't be scraped
const BLOCKED_COURSES = [
  'CMDB Health Micro-Certification Simulator',
  'Configure the CMDB Micro-Certification Simulator',
  'GRC: Integrated Risk Management (IRM) Simulator',
  'GRC: Third-party Risk Management (TPRM) Implementation Simulator',
  'Performance Analytics (PA) Implementation Simulator',
  'ITSM Implementation Simulator',
  'Human Resources (HR) Simulator',
  'Software Asset Management (SAM) Simulator',
  'Hardware Asset Simulator'
];

// Courses we know don't have scrapable content
const UNAVAILABLE_COURSES = [
  'CIS-Discovery: Certification Test Prep',
  'CIS-TPRM Delta Exam Study Guide',
  'ITIL v3 Foundations Certified',
  'Certified System Administrator',
  'ServiceNow Fundamentals' // Alias for Welcome to ServiceNow
];

function getDirectoryStats(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return null;
  }
  
  let totalChars = 0;
  let fileCount = 0;
  let lastModified = null;
  
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isFile() && (file.endsWith('.md') || file.endsWith('.txt') || file.endsWith('.json'))) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        totalChars += content.length;
        fileCount++;
        
        if (!lastModified || stat.mtime > lastModified) {
          lastModified = stat.mtime;
        }
      } catch (e) {
        // Skip unreadable files
      }
    }
  }
  
  return {
    chars: totalChars,
    files: fileCount,
    lastScraped: lastModified ? lastModified.toISOString().split('T')[0] : null
  };
}

function getCourseStatus(courseName, slugMapping) {
  // Check if blocked (interactive)
  if (BLOCKED_COURSES.some(b => courseName.includes(b) || b.includes(courseName))) {
    return { status: 'blocked', reason: 'interactive' };
  }
  
  // Check if unavailable
  if (UNAVAILABLE_COURSES.some(u => courseName.includes(u) || u.includes(courseName))) {
    return { status: 'unavailable', reason: 'no-content' };
  }
  
  // Try to find scraped content
  const slug = slugMapping[courseName];
  if (slug) {
    const dirPath = path.join(SCRAPER_DIR, 'scraped-courses', slug);
    const stats = getDirectoryStats(dirPath);
    if (stats && stats.chars > 1000) {
      return { status: 'complete', ...stats };
    } else if (stats) {
      return { status: 'partial', ...stats };
    }
  }
  
  // Try fuzzy matching on directory names
  const scrapedCoursesDir = path.join(SCRAPER_DIR, 'scraped-courses');
  if (fs.existsSync(scrapedCoursesDir)) {
    const dirs = fs.readdirSync(scrapedCoursesDir);
    const normalizedName = courseName.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    for (const dir of dirs) {
      const normalizedDir = dir.replace(/-/g, '').toLowerCase();
      if (normalizedDir.includes(normalizedName) || normalizedName.includes(normalizedDir)) {
        const dirPath = path.join(scrapedCoursesDir, dir);
        const stats = getDirectoryStats(dirPath);
        if (stats && stats.chars > 1000) {
          return { status: 'complete', ...stats, matchedDir: dir };
        }
      }
    }
  }
  
  return { status: 'missing' };
}

function getDocBundleStatus(bundleId) {
  const dirPath = path.join(SCRAPER_DIR, 'scraped-docs', bundleId);
  const stats = getDirectoryStats(dirPath);
  
  if (stats && stats.chars > 10000) {
    return { status: 'complete', ...stats };
  } else if (stats) {
    return { status: 'partial', ...stats };
  }
  
  return { status: 'missing' };
}

function getQuestionCount(certCode) {
  const questionsDir = path.join(DATA_DIR, 'questions', certCode.toLowerCase());
  if (!fs.existsSync(questionsDir)) {
    return 0;
  }
  
  let count = 0;
  const files = fs.readdirSync(questionsDir);
  
  for (const file of files) {
    if (file.endsWith('.json')) {
      try {
        const content = JSON.parse(fs.readFileSync(path.join(questionsDir, file), 'utf8'));
        if (Array.isArray(content)) {
          count += content.length;
        } else if (content.questions) {
          count += content.questions.length;
        }
      } catch (e) {
        // Skip invalid files
      }
    }
  }
  
  return count;
}

function generateManifest() {
  const manifest = {
    generated: new Date().toISOString(),
    certifications: {}
  };
  
  for (const [certCode, certData] of Object.entries(sources.certifications)) {
    const courseResults = {
      required: [],
      officiallyRecommended: [],
      snReadyRecommended: []
    };
    
    // Process each course tier
    for (const tier of ['required', 'officiallyRecommended', 'snReadyRecommended']) {
      for (const courseName of certData.courses[tier] || []) {
        const status = getCourseStatus(courseName, sources.courseSlugMapping || {});
        courseResults[tier].push({
          name: courseName,
          ...status
        });
      }
    }
    
    // Process doc bundles
    const docBundleResults = [];
    for (const bundle of certData.docBundles || []) {
      const status = getDocBundleStatus(bundle.id);
      docBundleResults.push({
        ...bundle,
        ...status
      });
    }
    
    // Calculate coverage stats
    const requiredCourses = courseResults.required;
    const scrapableCourses = requiredCourses.filter(c => c.status !== 'blocked' && c.status !== 'unavailable');
    const scrapedCourses = scrapableCourses.filter(c => c.status === 'complete' || c.status === 'partial');
    
    const totalChars = [
      ...requiredCourses,
      ...courseResults.officiallyRecommended,
      ...courseResults.snReadyRecommended,
      ...docBundleResults
    ].reduce((sum, item) => sum + (item.chars || 0), 0);
    
    manifest.certifications[certCode] = {
      fullName: certData.fullName,
      courses: courseResults,
      docBundles: docBundleResults,
      summary: {
        requiredTotal: requiredCourses.length,
        requiredScrapable: scrapableCourses.length,
        requiredScraped: scrapedCourses.length,
        requiredCoverage: scrapableCourses.length > 0 
          ? Math.round((scrapedCourses.length / scrapableCourses.length) * 100) 
          : 100,
        docBundlesTotal: docBundleResults.length,
        docBundlesScraped: docBundleResults.filter(d => d.status === 'complete').length,
        totalChars,
        questionCount: getQuestionCount(certCode)
      }
    };
  }
  
  return manifest;
}

// Generate and write manifest
const manifest = generateManifest();
const outputPath = path.join(DATA_DIR, 'coverage/coverage-manifest.json');
fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));

console.log(`Coverage manifest generated: ${outputPath}`);
console.log(`Certifications processed: ${Object.keys(manifest.certifications).length}`);

// Print summary
console.log('\n📊 Coverage Summary:');
for (const [cert, data] of Object.entries(manifest.certifications)) {
  const { summary } = data;
  const status = summary.requiredCoverage >= 80 ? '✅' : summary.requiredCoverage >= 50 ? '🟡' : '❌';
  console.log(`  ${status} ${cert}: ${summary.requiredCoverage}% courses | ${summary.questionCount} questions | ${(summary.totalChars / 1000).toFixed(0)}K chars`);
}
