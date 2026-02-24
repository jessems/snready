#!/usr/bin/env npx tsx
/**
 * Migration script: Upgrade all 30-day users to lifetime access
 * 
 * Prerequisites:
 *   npx wrangler login
 * 
 * Run:
 *   npx tsx scripts/migrate-30day-to-lifetime.ts
 */

import { execSync } from 'child_process';

const KV_NAMESPACE_ID = 'bcb7c1925c84424cb90713533b286c63';
const LIFETIME_MS = 100 * 365 * 24 * 60 * 60 * 1000; // 100 years

function wrangler(cmd: string): string {
  return execSync(`npx wrangler ${cmd}`, { encoding: 'utf-8' });
}

async function migrate() {
  console.log('🔍 Fetching access keys from KV...\n');
  
  // List all keys with prefix "access:"
  const listOutput = wrangler(`kv:key list --namespace-id ${KV_NAMESPACE_ID} --prefix "access:"`);
  const keys: { name: string }[] = JSON.parse(listOutput);
  
  console.log(`Found ${keys.length} access records\n`);
  
  if (keys.length === 0) {
    console.log('No records to migrate.');
    return;
  }

  const newExpiresAt = Date.now() + LIFETIME_MS;
  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  for (const { name: key } of keys) {
    try {
      // Get current value
      const raw = wrangler(`kv:key get --namespace-id ${KV_NAMESPACE_ID} "${key}"`);
      const record = JSON.parse(raw);

      // Skip if already lifetime (expiresAt > 50 years from now)
      const fiftyYearsMs = 50 * 365 * 24 * 60 * 60 * 1000;
      if (record.expiresAt > Date.now() + fiftyYearsMs) {
        console.log(`⏭️  ${key} - already lifetime, skipping`);
        skipped++;
        continue;
      }

      const oldExpiry = new Date(record.expiresAt).toISOString().split('T')[0];
      
      // Update expiresAt
      record.expiresAt = newExpiresAt;
      
      // Write back without TTL (wrangler kv:key put without --ttl = no expiration)
      const tempFile = `/tmp/kv-migrate-${Date.now()}.json`;
      require('fs').writeFileSync(tempFile, JSON.stringify(record));
      wrangler(`kv:key put --namespace-id ${KV_NAMESPACE_ID} "${key}" --path "${tempFile}"`);
      require('fs').unlinkSync(tempFile);
      
      console.log(`✅ ${key} - migrated (was expiring ${oldExpiry})`);
      migrated++;

      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 200));

    } catch (err) {
      console.error(`❌ ${key} - error:`, (err as Error).message);
      errors++;
    }
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Migration complete:
  ✅ Migrated: ${migrated}
  ⏭️  Skipped:  ${skipped} (already lifetime)
  ❌ Errors:   ${errors}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}

migrate().catch(console.error);
