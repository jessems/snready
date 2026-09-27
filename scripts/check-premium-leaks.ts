#!/usr/bin/env npx tsx
/**
 * Fails when premium question content appears in the public static export (out/).
 * Runs automatically after `npm run build` (postbuild). Run manually:
 *   npx tsx scripts/check-premium-leaks.ts [outDir]
 */

import fs from "node:fs";
import path from "node:path";
import { scanBuildOutput } from "./premium-leaks";

async function main() {
  const outDir = path.resolve(process.argv[2] || "out");
  if (!fs.existsSync(outDir)) {
    console.error(`No build output found at ${outDir}. Run \`npm run build\` first.`);
    process.exit(1);
  }

  const result = await scanBuildOutput(outDir);
  console.log(
    `🔍 Premium leak check: ${result.needleCount} snippets from ${result.premiumQuestionCount} premium questions across ${result.scannedFiles} files`
  );

  if (result.protectedHits.length > 0) {
    console.log(`   ${result.protectedHits.length} admin-only files contain premium content (protected by functions/admin/_middleware.ts)`);
  }

  if (result.leaks.length === 0) {
    console.log("✅ No premium question content found in public build output");
    return;
  }

  console.error(`❌ Premium question content found in ${result.leaks.length} public files:`);
  for (const leak of result.leaks.slice(0, 50)) {
    const questionIds = Array.from(new Set(leak.needles.map((needle) => needle.questionId)));
    console.error(`   ${leak.file}: ${questionIds.length} premium questions (e.g. ${questionIds.slice(0, 3).join(", ")})`);
  }
  if (result.leaks.length > 50) console.error(`   …and ${result.leaks.length - 50} more files`);
  process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
