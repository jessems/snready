#!/bin/bash
# Setup Cloudflare D1 database for SNReady Salaries
# Run: CLOUDFLARE_API_TOKEN=your_token ./scripts/setup-d1.sh

set -e

echo "Creating D1 database..."
npx wrangler d1 create snready-salaries

echo ""
echo "⚠️  Copy the database_id from above and add to wrangler.toml:"
echo ""
echo "[[d1_databases]]"
echo 'binding = "SALARIES_DB"'
echo 'database_name = "snready-salaries"'
echo 'database_id = "<YOUR_DATABASE_ID>"'
echo ""

read -p "Enter the database_id: " DB_ID

echo "Running migrations..."
npx wrangler d1 execute snready-salaries --file=./migrations/0001_create_salaries.sql
npx wrangler d1 execute snready-salaries --file=./migrations/0002_seed_reddit_2024.sql

echo ""
echo "✅ Database setup complete!"
echo "30 salary records seeded from Reddit 2024 thread"
echo ""
echo "Verify with:"
echo "npx wrangler d1 execute snready-salaries --command 'SELECT COUNT(*) FROM salary_submissions'"
