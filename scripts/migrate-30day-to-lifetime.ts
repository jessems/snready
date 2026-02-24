/**
 * Migration script: Upgrade all 30-day users to lifetime access
 * 
 * Run with: npx wrangler kv:key list --binding SNREADY_ACCESS | npx tsx scripts/migrate-30day-to-lifetime.ts
 * 
 * Or run directly with wrangler (preferred):
 *   npx wrangler pages dev --local -- npx tsx scripts/migrate-30day-to-lifetime.ts
 * 
 * This script:
 * 1. Lists all access:* keys
 * 2. Updates expiresAt to 100 years from now
 * 3. Re-writes without TTL (making it permanent)
 */

// For running via wrangler CLI directly
async function migrate() {
  const ACCOUNT_ID = process.env.CF_ACCOUNT_ID;
  const API_TOKEN = process.env.CF_API_TOKEN;
  const KV_NAMESPACE_ID = process.env.SNREADY_ACCESS_ID;

  if (!ACCOUNT_ID || !API_TOKEN || !KV_NAMESPACE_ID) {
    console.error(`
Missing environment variables. Set:
  CF_ACCOUNT_ID     - Your Cloudflare account ID
  CF_API_TOKEN      - API token with KV write access
  SNREADY_ACCESS_ID - The KV namespace ID for SNREADY_ACCESS

Find these in Cloudflare dashboard > Workers & Pages > KV
`);
    process.exit(1);
  }

  const baseUrl = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${KV_NAMESPACE_ID}`;
  const headers = {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  };

  // 1. List all keys with prefix "access:"
  console.log('Fetching access keys...');
  const listRes = await fetch(`${baseUrl}/keys?prefix=access:`, { headers });
  const listData = await listRes.json() as { result: { name: string }[]; success: boolean };
  
  if (!listData.success) {
    console.error('Failed to list keys:', listData);
    process.exit(1);
  }

  const keys = listData.result.map(k => k.name);
  console.log(`Found ${keys.length} access records`);

  const LIFETIME_MS = 100 * 365 * 24 * 60 * 60 * 1000; // 100 years
  const newExpiresAt = Date.now() + LIFETIME_MS;

  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  for (const key of keys) {
    try {
      // 2. Get current value
      const getRes = await fetch(`${baseUrl}/values/${encodeURIComponent(key)}`, { headers });
      const raw = await getRes.text();
      const record = JSON.parse(raw);

      // Skip if already lifetime (expiresAt > 50 years from now)
      if (record.expiresAt > Date.now() + (50 * 365 * 24 * 60 * 60 * 1000)) {
        console.log(`⏭️  ${key} - already lifetime, skipping`);
        skipped++;
        continue;
      }

      // 3. Update expiresAt and re-write without TTL
      record.expiresAt = newExpiresAt;
      
      const putRes = await fetch(`${baseUrl}/values/${encodeURIComponent(key)}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(record),
      });

      if (putRes.ok) {
        console.log(`✅ ${key} - migrated to lifetime (was expiring ${new Date(record.expiresAt).toISOString()})`);
        migrated++;
      } else {
        console.error(`❌ ${key} - failed to update:`, await putRes.text());
        errors++;
      }

      // Rate limit: 4 requests per second max
      await new Promise(r => setTimeout(r, 300));

    } catch (err) {
      console.error(`❌ ${key} - error:`, err);
      errors++;
    }
  }

  console.log(`
Migration complete:
  ✅ Migrated: ${migrated}
  ⏭️  Skipped:  ${skipped}
  ❌ Errors:   ${errors}
`);
}

migrate().catch(console.error);
