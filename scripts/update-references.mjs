#!/usr/bin/env node
/**
 * Script to update question references to use actual URLs from source
 * When a question has a source URL but text-only references,
 * this script updates the references to include the source URL.
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const QUESTIONS_DIR = './data/questions';

function processFile(filePath) {
  const content = JSON.parse(readFileSync(filePath, 'utf-8'));
  let updated = false;

  if (!content.questions) return false;

  for (const question of content.questions) {
    // Get the source URL if available
    const sourceUrl = question.source?.course?.url ||
                      question.source?.documentation?.url;

    if (!sourceUrl) continue;

    // Check if wrongAnswers have text-only references
    if (question.explanation?.wrongAnswers) {
      for (const wa of question.explanation.wrongAnswers) {
        // If reference exists but doesn't start with http, update it
        if (wa.reference && !wa.reference.startsWith('http')) {
          wa.reference = sourceUrl;
          updated = true;
        }
        // If reference is missing, add the source URL
        else if (!wa.reference) {
          wa.reference = sourceUrl;
          updated = true;
        }
      }
    }

    // Also update the correct explanation to include URL if missing
    if (question.explanation?.correct && sourceUrl) {
      const hasUrl = question.explanation.correct.includes('http');
      if (!hasUrl) {
        question.explanation.correct += ` See: ${sourceUrl}`;
        updated = true;
      }
    }
  }

  if (updated) {
    writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
    return true;
  }
  return false;
}

// Get all certification directories
const certDirs = readdirSync(QUESTIONS_DIR);
let totalUpdated = 0;

for (const certDir of certDirs) {
  const certPath = join(QUESTIONS_DIR, certDir);
  const files = readdirSync(certPath).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const filePath = join(certPath, file);
    if (processFile(filePath)) {
      console.log(`Updated: ${filePath}`);
      totalUpdated++;
    }
  }
}

console.log(`\nTotal files updated: ${totalUpdated}`);
