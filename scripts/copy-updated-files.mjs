#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const INPUT_DIR = '/tmp/updated-questions';
const OUTPUT_DIR = './data/questions';

// Get all certification directories
const certDirs = readdirSync(INPUT_DIR);
let copied = 0;

for (const certDir of certDirs) {
  const certInputPath = join(INPUT_DIR, certDir);
  const certOutputPath = join(OUTPUT_DIR, certDir);

  const files = readdirSync(certInputPath).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const inputPath = join(certInputPath, file);
    const outputPath = join(certOutputPath, file);

    try {
      const content = readFileSync(inputPath, 'utf-8');
      writeFileSync(outputPath, content);
      console.log(`Copied: ${file}`);
      copied++;
    } catch (err) {
      console.error(`Failed to copy ${file}: ${err.message}`);
    }
  }
}

console.log(`\nTotal files copied: ${copied}`);
