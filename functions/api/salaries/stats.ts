// GET /api/salaries/stats - Get salary statistics from D1
import type { D1Database } from '@cloudflare/workers-types';

interface Env {
  SALARIES_DB: D1Database;
}

interface RoleStats {
  role: string;
  count: number;
  median: number;
  p25: number;
  p75: number;
  min: number;
  max: number;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    // Get all salaries for computing stats
    const { results: allSalaries } = await context.env.SALARIES_DB.prepare(`
      SELECT role, base_salary, country, certifications, yoe_servicenow, company_type
      FROM salary_submissions
      WHERE base_salary > 10000
      ORDER BY role, base_salary
    `).all();

    // Compute stats by role
    const byRole: Record<string, number[]> = {};
    const allValues: number[] = [];
    const countries = new Set<string>();

    for (const row of allSalaries as any[]) {
      const salary = row.base_salary;
      allValues.push(salary);
      countries.add(row.country);

      if (!byRole[row.role]) byRole[row.role] = [];
      byRole[row.role].push(salary);
    }

    const computeStats = (arr: number[]): Omit<RoleStats, 'role'> => {
      const sorted = [...arr].sort((a, b) => a - b);
      const len = sorted.length;
      return {
        count: len,
        median: sorted[Math.floor(len / 2)] || 0,
        p25: sorted[Math.floor(len * 0.25)] || 0,
        p75: sorted[Math.floor(len * 0.75)] || 0,
        min: sorted[0] || 0,
        max: sorted[len - 1] || 0,
      };
    };

    const roleStats: RoleStats[] = Object.entries(byRole)
      .map(([role, salaries]) => ({
        role,
        ...computeStats(salaries),
      }))
      .sort((a, b) => b.median - a.median);

    const overall = computeStats(allValues);

    return new Response(
      JSON.stringify({
        overall: {
          ...overall,
          countries: countries.size,
        },
        byRole: roleStats,
        updatedAt: new Date().toISOString(),
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        } 
      }
    );
  } catch (error) {
    console.error('Error fetching stats:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch salary stats' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
