-- Salary submissions table with source attribution
CREATE TABLE IF NOT EXISTS salary_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  
  -- Core compensation
  role TEXT NOT NULL,
  base_salary INTEGER NOT NULL,
  bonus INTEGER,
  equity INTEGER,
  hourly_rate INTEGER,
  employment_type TEXT DEFAULT 'Full-time (W2)',
  
  -- Experience
  yoe_servicenow TEXT,
  yoe_total INTEGER,
  
  -- Credentials
  certifications TEXT, -- JSON array
  education TEXT,
  
  -- Location
  country TEXT NOT NULL,
  city TEXT,
  remote_pct INTEGER,
  
  -- Company
  company_type TEXT,
  company_size TEXT,
  
  -- Source tracking (prevents duplicates)
  source TEXT NOT NULL,
  source_id TEXT, -- unique identifier within source (e.g., Reddit comment ID)
  source_url TEXT,
  
  -- Metadata
  submitted_at TEXT DEFAULT (datetime('now')),
  verified INTEGER DEFAULT 0,
  notes TEXT,
  
  -- Prevent duplicate imports
  UNIQUE(source, source_id)
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_salaries_role ON salary_submissions(role);
CREATE INDEX IF NOT EXISTS idx_salaries_country ON salary_submissions(country);
CREATE INDEX IF NOT EXISTS idx_salaries_source ON salary_submissions(source);
