#!/usr/bin/env node
import { readFileSync } from 'fs';

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: node process-single-file.mjs <file>');
  process.exit(1);
}

const content = JSON.parse(readFileSync(filePath, 'utf-8'));

for (const q of content.questions) {
  const sourceUrl = q.source?.course?.url || q.source?.documentation?.url;
  if (!sourceUrl) continue;

  // Update wrongAnswers references
  if (q.explanation?.wrongAnswers) {
    for (const wa of q.explanation.wrongAnswers) {
      if (wa.reference && !wa.reference.startsWith('http')) {
        wa.reference = sourceUrl;
      }
    }
  }

  // Add URL to correct explanation if missing
  if (q.explanation?.correct && !q.explanation.correct.includes('http')) {
    q.explanation.correct += ' See: ' + sourceUrl;
  }
}

console.log(JSON.stringify(content, null, 2));
