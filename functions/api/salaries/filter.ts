// GET /api/salaries/filter - Get filtered salary statistics from D1
import type { D1Database } from '@cloudflare/workers-types';

interface Env {
  SALARIES_DB: D1Database;
}

interface SalaryEntry {
  role: string;
  base_salary: number;
  country: string;
  certifications: string | null;
  yoe_servicenow: string | null;
  company_type: string | null;
  city: string | null;
  remote_pct: number | null;
}

interface Stats {
  count: number;
  median: number;
  p25: number;
  p75: number;
  min: number;
  max: number;
  avg: number;
}

// Mapping from URL slugs to database values
const ROLE_SLUGS: Record<string, string> = {
  'developer': 'Developer',
  'architect': 'Architect',
  'administrator': 'Administrator',
  'admin': 'Administrator',
  'consultant': 'Consultant',
  'manager': 'Manager',
  'product-owner': 'Product Owner',
};

const COUNTRY_SLUGS: Record<string, string> = {
  'usa': 'US',
  'us': 'US',
  'united-states': 'US',
  'canada': 'CA',
  'ca': 'CA',
  'uk': 'GB',
  'united-kingdom': 'GB',
  'germany': 'DE',
  'de': 'DE',
  'india': 'IN',
  'in': 'IN',
  'france': 'FR',
  'fr': 'FR',
  'belgium': 'BE',
  'be': 'BE',
};

const computeStats = (arr: number[]): Stats => {
  if (arr.length === 0) {
    return { count: 0, median: 0, p25: 0, p75: 0, min: 0, max: 0, avg: 0 };
  }
  const sorted = [...arr].sort((a, b) => a - b);
  const len = sorted.length;
  const sum = sorted.reduce((a, b) => a + b, 0);
  return {
    count: len,
    median: sorted[Math.floor(len / 2)] || 0,
    p25: sorted[Math.floor(len * 0.25)] || 0,
    p75: sorted[Math.floor(len * 0.75)] || 0,
    min: sorted[0] || 0,
    max: sorted[len - 1] || 0,
    avg: Math.round(sum / len),
  };
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url);
    const roleSlug = url.searchParams.get('role')?.toLowerCase();
    const countrySlug = url.searchParams.get('country')?.toLowerCase();

    // Build query conditions
    const conditions: string[] = ['base_salary > 10000'];
    const params: (string | number)[] = [];

    let filterRole: string | null = null;
    let filterCountry: string | null = null;

    if (roleSlug && ROLE_SLUGS[roleSlug]) {
      filterRole = ROLE_SLUGS[roleSlug];
      conditions.push('role = ?');
      params.push(filterRole);
    }

    if (countrySlug && COUNTRY_SLUGS[countrySlug]) {
      filterCountry = COUNTRY_SLUGS[countrySlug];
      conditions.push('country = ?');
      params.push(filterCountry);
    }

    // Get filtered salaries
    const query = `
      SELECT role, base_salary, country, certifications, yoe_servicenow, company_type, city, remote_pct
      FROM salary_submissions
      WHERE ${conditions.join(' AND ')}
      ORDER BY base_salary
    `;

    const stmt = context.env.SALARIES_DB.prepare(query);
    const boundStmt = params.length > 0 ? stmt.bind(...params) : stmt;
    const { results } = await boundStmt.all<SalaryEntry>();

    if (!results || results.length === 0) {
      return new Response(
        JSON.stringify({
          error: 'No data found for this filter',
          filter: { role: filterRole, country: filterCountry },
          stats: null,
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Compute overall stats for this filter
    const allSalaries = results.map((r) => r.base_salary);
    const overallStats = computeStats(allSalaries);

    // Compute breakdown by the other dimension
    let breakdown: { label: string; stats: Stats }[] = [];

    if (filterRole && !filterCountry) {
      // Breakdown by country
      const byCountry: Record<string, number[]> = {};
      for (const row of results) {
        if (!byCountry[row.country]) byCountry[row.country] = [];
        byCountry[row.country].push(row.base_salary);
      }
      breakdown = Object.entries(byCountry)
        .map(([country, salaries]) => ({
          label: country,
          stats: computeStats(salaries),
        }))
        .sort((a, b) => b.stats.count - a.stats.count);
    } else if (filterCountry && !filterRole) {
      // Breakdown by role
      const byRole: Record<string, number[]> = {};
      for (const row of results) {
        if (!byRole[row.role]) byRole[row.role] = [];
        byRole[row.role].push(row.base_salary);
      }
      breakdown = Object.entries(byRole)
        .map(([role, salaries]) => ({
          label: role,
          stats: computeStats(salaries),
        }))
        .sort((a, b) => b.stats.median - a.stats.median);
    }

    // Compute experience breakdown
    const byExperience: Record<string, number[]> = {};
    for (const row of results) {
      const exp = row.yoe_servicenow || 'Unknown';
      if (!byExperience[exp]) byExperience[exp] = [];
      byExperience[exp].push(row.base_salary);
    }
    const experienceBreakdown = Object.entries(byExperience)
      .map(([exp, salaries]) => ({
        label: exp,
        stats: computeStats(salaries),
      }))
      .sort((a, b) => {
        // Sort by experience level
        const order = ['< 1 year', '1-2 years', '3-5 years', '6-10 years', '10+ years', 'Unknown'];
        return order.indexOf(a.label) - order.indexOf(b.label);
      });

    return new Response(
      JSON.stringify({
        filter: {
          role: filterRole,
          country: filterCountry,
          roleSlug,
          countrySlug,
        },
        stats: overallStats,
        breakdown,
        experienceBreakdown,
        updatedAt: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching filtered stats:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch salary stats' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
