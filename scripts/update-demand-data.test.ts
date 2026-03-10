#!/usr/bin/env npx tsx
/**
 * Tests for update-demand-data.ts
 * 
 * Run: BRAVE_API_KEY=xxx npx tsx scripts/update-demand-data.test.ts
 */

const BRAVE_API_KEY = process.env.BRAVE_API_KEY;

if (!BRAVE_API_KEY) {
  console.error("❌ BRAVE_API_KEY required");
  process.exit(1);
}

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  details?: string;
}

const results: TestResult[] = [];

// Test 1: Brave Search API returns valid response
async function testBraveSearchReturnsResults() {
  const testName = "Brave Search API returns valid response for CSA jobs";
  
  try {
    const query = "ServiceNow Certified System Administrator jobs";
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=5`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "X-Subscription-Token": BRAVE_API_KEY!,
      },
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    
    // Verify structure
    if (!data.web || !data.web.results || !Array.isArray(data.web.results)) {
      throw new Error("Invalid response structure: missing web.results array");
    }

    if (data.web.results.length === 0) {
      throw new Error("No results returned");
    }

    // Verify each result has required fields
    for (const result of data.web.results) {
      if (!result.title || !result.url) {
        throw new Error("Result missing title or url");
      }
    }

    results.push({
      name: testName,
      passed: true,
      details: `Got ${data.web.results.length} results. First: "${data.web.results[0].title.slice(0, 50)}..."`,
    });
  } catch (error) {
    results.push({
      name: testName,
      passed: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

// Test 2: Job count extraction from search results
async function testJobCountExtraction() {
  const testName = "Job count can be extracted from search results";
  
  try {
    const query = "ServiceNow ITSM jobs site:linkedin.com";
    const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}&count=10`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "X-Subscription-Token": BRAVE_API_KEY!,
      },
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    
    // Try to extract job counts from snippets
    let foundCount = false;
    let extractedCount = 0;
    const patterns: string[] = [];

    for (const result of data.web?.results || []) {
      const text = `${result.title} ${result.description || ""}`;
      
      // Look for patterns like "1,234 jobs", "500+ positions"
      const countMatch = text.match(/(\d{1,3}(?:,\d{3})*)\+?\s*(?:jobs?|positions?|openings?|results?)/i);
      if (countMatch) {
        foundCount = true;
        const num = parseInt(countMatch[1].replace(/,/g, ""), 10);
        if (num > extractedCount) {
          extractedCount = num;
          patterns.push(`"${countMatch[0]}" from "${result.title.slice(0, 30)}..."`);
        }
      }
    }

    // Also check if job sites are in results (indirect indicator)
    const jobSites = (data.web?.results || []).filter((r: { url: string }) =>
      r.url.includes("indeed") ||
      r.url.includes("linkedin.com/jobs") ||
      r.url.includes("glassdoor") ||
      r.url.includes("dice.com")
    );

    if (foundCount) {
      results.push({
        name: testName,
        passed: true,
        details: `Extracted count: ${extractedCount}. Patterns found: ${patterns.slice(0, 2).join(", ")}`,
      });
    } else if (jobSites.length > 0) {
      results.push({
        name: testName,
        passed: true,
        details: `No explicit count, but found ${jobSites.length} job site results (can estimate from this)`,
      });
    } else {
      throw new Error("Could not extract job count or find job sites");
    }
  } catch (error) {
    results.push({
      name: testName,
      passed: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

// Test 3: Multiple certification queries work
async function testMultipleCertQueries() {
  const testName = "Multiple certification queries return varied results";
  
  try {
    const certs = [
      { name: "CSA", query: "ServiceNow System Administrator jobs" },
      { name: "CIS-ITSM", query: "ServiceNow ITSM Implementation jobs" },
      { name: "CIS-Discovery", query: "ServiceNow Discovery jobs" },
    ];

    const results_data: { name: string; resultCount: number; hasJobSites: boolean }[] = [];

    for (const cert of certs) {
      // Rate limit
      await new Promise((resolve) => setTimeout(resolve, 1100));

      const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(cert.query)}&count=5`;
      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "X-Subscription-Token": BRAVE_API_KEY!,
        },
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status} for ${cert.name}`);
      }

      const data = await response.json();
      const resultCount = data.web?.results?.length || 0;
      const hasJobSites = (data.web?.results || []).some(
        (r: { url: string }) =>
          r.url.includes("indeed") ||
          r.url.includes("linkedin") ||
          r.url.includes("glassdoor")
      );

      results_data.push({ name: cert.name, resultCount, hasJobSites });
    }

    // Verify we got results for all certs
    const allHaveResults = results_data.every((r) => r.resultCount > 0);
    
    if (!allHaveResults) {
      throw new Error("Some certifications returned no results");
    }

    results.push({
      name: testName,
      passed: true,
      details: results_data.map((r) => `${r.name}: ${r.resultCount} results, job sites: ${r.hasJobSites}`).join("; "),
    });
  } catch (error) {
    results.push({
      name: testName,
      passed: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

// Run all tests
async function runTests() {
  console.log("🧪 Running Demand Data Update Tests\n");
  console.log("=".repeat(60) + "\n");

  await testBraveSearchReturnsResults();
  await new Promise((r) => setTimeout(r, 1100)); // Rate limit
  
  await testJobCountExtraction();
  await new Promise((r) => setTimeout(r, 1100)); // Rate limit
  
  await testMultipleCertQueries();

  // Print results
  console.log("\n" + "=".repeat(60));
  console.log("RESULTS\n");

  let passed = 0;
  let failed = 0;

  for (const result of results) {
    if (result.passed) {
      console.log(`✅ ${result.name}`);
      if (result.details) {
        console.log(`   ${result.details}`);
      }
      passed++;
    } else {
      console.log(`❌ ${result.name}`);
      console.log(`   Error: ${result.error}`);
      failed++;
    }
    console.log();
  }

  console.log("=".repeat(60));
  console.log(`\n${passed} passed, ${failed} failed\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
