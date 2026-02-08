#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join, basename } from 'path';

const QUESTIONS_DIR = './data/questions';
const OUTPUT_DIR = '/tmp/updated-questions';

// Create output directory
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

function processFile(filePath) {
  const content = JSON.parse(readFileSync(filePath, 'utf-8'));
  let updated = false;

  if (!content.questions) return { updated: false };

  for (const q of content.questions) {
    const sourceUrl = q.source?.course?.url || q.source?.documentation?.url;
    if (!sourceUrl) continue;

    // Update wrongAnswers references
    if (q.explanation?.wrongAnswers) {
      for (const wa of q.explanation.wrongAnswers) {
        if (wa.reference && !wa.reference.startsWith('http')) {
          wa.reference = sourceUrl;
          updated = true;
        }
      }
    }

    // Add URL to correct explanation if missing
    if (q.explanation?.correct && !q.explanation.correct.includes('http')) {
      q.explanation.correct += ' See: ' + sourceUrl;
      updated = true;
    }
  }

  return { updated, content };
}

// Get all certification directories
const certDirs = readdirSync(QUESTIONS_DIR);
const updatedFiles = [];

for (const certDir of certDirs) {
  const certPath = join(QUESTIONS_DIR, certDir);
  const certOutputDir = join(OUTPUT_DIR, certDir);

  if (!existsSync(certOutputDir)) {
    mkdirSync(certOutputDir, { recursive: true });
  }

  const files = readdirSync(certPath).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const filePath = join(certPath, file);
    const result = processFile(filePath);

    if (result.updated) {
      const outputPath = join(certOutputDir, file);
      writeFileSync(outputPath, JSON.stringify(result.content, null, 2) + '\n');
      updatedFiles.push({
        original: filePath,
        output: outputPath
      });
      console.log(`Updated: ${file}`);
    }
  }
}

console.log(`\nTotal files updated: ${updatedFiles.length}`);
console.log('\nFiles to copy back:');
updatedFiles.forEach(f => console.log(`  ${f.output} -> ${f.original}`));
