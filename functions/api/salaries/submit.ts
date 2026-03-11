// POST /api/salaries/submit - Submit a new salary entry
import type { D1Database } from '@cloudflare/workers-types';

interface Env {
  SALARIES_DB: D1Database;
}

interface SalarySubmission {
  role: string;
  baseSalary: number;
  bonus?: number;
  equity?: number;
  hourlyRate?: number;
  employmentType?: string;
  yoeServiceNow?: string;
  yoeTotal?: number;
  certifications?: string[];
  education?: string;
  country: string;
  city?: string;
  remotePct?: number;
  companyType?: string;
  companySize?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body: SalarySubmission = await context.request.json();

    // Validate required fields
    if (!body.role || !body.baseSalary || !body.country) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: role, baseSalary, country' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate a unique source_id for user submissions
    const sourceId = `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const result = await context.env.SALARIES_DB.prepare(`
      INSERT INTO salary_submissions (
        role, base_salary, bonus, equity, hourly_rate, employment_type,
        yoe_servicenow, yoe_total, certifications, education,
        country, city, remote_pct, company_type, company_size,
        source, source_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      body.role,
      body.baseSalary,
      body.bonus || null,
      body.equity || null,
      body.hourlyRate || null,
      body.employmentType || 'Full-time (W2)',
      body.yoeServiceNow || null,
      body.yoeTotal || null,
      body.certifications ? JSON.stringify(body.certifications) : null,
      body.education || null,
      body.country,
      body.city || null,
      body.remotePct ?? null,
      body.companyType || null,
      body.companySize || null,
      'user-submission',
      sourceId
    ).run();

    return new Response(
      JSON.stringify({ 
        success: true, 
        id: result.meta.last_row_id,
        message: 'Salary submitted successfully'
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error submitting salary:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to submit salary' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
