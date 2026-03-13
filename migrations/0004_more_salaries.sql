-- More salary data from Reddit threads (March 2026 scrape)
-- Exchange rates: GBP=1.26, EUR=1.08, SEK=0.095, INR=0.012

-- UK salaries (additional)
INSERT OR IGNORE INTO salary_submissions (role, base_salary, employment_type, yoe_servicenow, country, city, certifications, source, source_id, notes) VALUES
('Consultant', 95000, 'Full-time (W2)', '5-7', 'GB', 'Remote', '["CSA","CIS-ITSM","CIS-SIR"]', 'reddit', 'uk-1hfhpae-1', '£75-80k, 7 years exp, UK'),
('Developer', 37800, 'Full-time (W2)', '<1', 'GB', 'Remote', '["CSA"]', 'reddit', 'uk-wrawk3-1', 'UK grad dev £30k, jumped to £45k then £60k'),
('Developer', 75600, 'Full-time (W2)', '1-2', 'GB', 'Remote', '["CSA"]', 'reddit', 'uk-wrawk3-2', 'UK tech consultant £60k after 10mo'),
('Architect', 103000, 'Full-time (W2)', '5-7', 'GB', 'Remote', '["CSA"]', 'reddit', 'uk-zu4140-1', 'Tech Lead/Architect UK retailer £82k, 5yr SN, 20yr IT');

-- Portugal
INSERT OR IGNORE INTO salary_submissions (role, base_salary, employment_type, yoe_servicenow, country, city, certifications, source, source_id, notes) VALUES
('Developer', 43200, 'Full-time (W2)', '3-5', 'PT', 'Remote', '["CSA"]', 'reddit', 'pt-zu4140-1', '€40k, 4yr exp, Portugal full remote');

-- Sweden (€5-6k/mo = €66k/yr = $71k)
INSERT OR IGNORE INTO salary_submissions (role, base_salary, employment_type, yoe_servicenow, country, city, certifications, source, source_id, notes) VALUES
('Developer', 71000, 'Full-time (W2)', '3-5', 'SE', 'Remote', '["CSA"]', 'reddit', 'se-zu4140-1', '€5-6k/month, average SN dev in Sweden');

-- Middle Europe (likely Poland/Czech)
INSERT OR IGNORE INTO salary_submissions (role, base_salary, employment_type, yoe_servicenow, country, city, certifications, source, source_id, notes) VALUES
('Developer', 30000, 'Full-time (W2)', '3-5', 'PL', 'Remote', '["CSA","CAD","CIS-ITSM"]', 'reddit', 'eu-wrawk3-1', '$30k dev lead 5+ devs, 4yr exp, middle EU country');

-- Europe (unspecified - likely Poland/Spain)
INSERT OR IGNORE INTO salary_submissions (role, base_salary, employment_type, yoe_servicenow, country, city, certifications, source, source_id, notes) VALUES
('Consultant', 43200, 'Full-time (W2)', '2-3', 'ES', 'Remote', '["CSA","CIS-ITSM"]', 'reddit', 'eu-wrawk3-2', '€40k tech consultant, 2yr exp, preparing for CSM');

-- India salaries
INSERT OR IGNORE INTO salary_submissions (role, base_salary, employment_type, yoe_servicenow, country, city, certifications, source, source_id, notes) VALUES
('Developer', 10000, 'Full-time (W2)', '3-5', 'IN', 'Remote', '["CSA"]', 'reddit', 'in-zu4140-1', '$10k, 3yr exp ITSM/ITOM/ITAM/SAM/HAM/ATF'),
('Developer', 40000, 'Full-time (W2)', '8+', 'IN', 'Remote', '["CSA"]', 'reddit', 'in-zu4140-2', '$40k, 9+ years SN dev'),
('Developer', 9000, 'Full-time (W2)', '3-5', 'IN', 'Hybrid', '["CSA","CAD","CIS-HR"]', 'reddit', 'in-17lmp5y-1', '750k INR ($9k), 3.5yr exp, micro certs CMDB/PI');

-- Philippines
INSERT OR IGNORE INTO salary_submissions (role, base_salary, employment_type, yoe_servicenow, country, city, certifications, source, source_id, notes) VALUES
('Consultant', 20000, 'Full-time (W2)', '2-3', 'PH', 'Remote', '["CSA","CAD"]', 'reddit', 'ph-17lmp5y-1', '$20k, 2yr SN, 5yr dev exp, remote for EU/AU clients');

-- More US data from threads
INSERT OR IGNORE INTO salary_submissions (role, base_salary, employment_type, yoe_servicenow, country, city, certifications, source, source_id, notes) VALUES
('Developer', 141000, 'Full-time (W2)', '<1', 'US', 'Remote', '[]', 'reddit', 'us-17lmp5y-1', 'Data Center OPS Analyst, 8yr DC exp, no certs'),
('Consultant', 180000, 'Full-time (W2)', '5-7', 'US', 'Remote', '["CSA","CIS-ITSM","CIS-CSM"]', 'reddit', 'us-17lmp5y-2', '6.5yr exp, consultant'),
('Developer', 100000, 'Full-time (W2)', '3-5', 'US', 'Remote', '["CSA"]', 'reddit', 'us-17lmp5y-3', 'Functional lead for SN module dev team'),
('Consultant', 180000, 'Full-time (W2)', '8+', 'US', 'DMV', '["CSA"]', 'reddit', 'us-17lmp5y-4', '8+ years, consultant'),
('Developer', 310000, 'Full-time (W2)', '3-5', 'US', 'Remote', '["CSA","CAD"]', 'reddit', 'us-17lmp5y-5', '2 roles both SN Admin, 3yr exp, overemployed'),
('Architect', 168000, 'Full-time (W2)', '10+', 'US', 'Durham NC', '["CSA"]', 'reddit', 'us-17lmp5y-6', '13yr NOW exp, 20yr IT, 15% bonus + RSUs'),
('Developer', 179000, 'Full-time (W2)', '3-5', 'US', 'Remote', '["CSA","CAD"]', 'reddit', 'us-17lmp5y-7', 'Sr Platform Engineer, 3.5yr exp'),
('Administrator', 150000, 'Full-time (W2)', '8+', 'US', 'NC', '["CSA","CIS-HR"]', 'reddit', 'us-17lmp5y-8', 'Principal analyst/architect, 8+ yr exp, 15% bonus'),
('Developer', 100000, 'Full-time (W2)', '1-2', 'US', 'Texas', '["CSA"]', 'reddit', 'us-17lmp5y-9', '1yr exp, in office 3x/week'),
('Developer', 103000, 'Full-time (W2)', '1-2', 'US', 'Westcoast', '["CSA"]', 'reddit', 'us-zu4140-1', 'Admin III/dev, 1yr sysadmin + 1.5yr SN, 8% bonus'),
('Consultant', 200000, 'Freelance', '10+', 'US', 'Remote', '["CSA"]', 'reddit', 'us-zu4140-2', 'Self-employed consultant, 10yr'),
('Developer', 60000, 'Full-time (W2)', '<1', 'US', 'South', '["CSA"]', 'reddit', 'us-zu4140-3', 'Jr dev, 1yr IT, remote'),
('Administrator', 82000, 'Full-time (W2)', '2-3', 'US', 'Nashville', '["CSA"]', 'reddit', 'us-zu4140-4', 'SN Admin, 10yr IT, 2yr SN admin'),
('Developer', 120000, 'Full-time (W2)', '3-5', 'US', 'Midwest', '["CSA"]', 'reddit', 'us-zu4140-5', 'Dev, 10yr IT, 3.5yr SN'),
('Administrator', 135000, 'Full-time (W2)', '8+', 'US', 'New England', '["CSA","ITIL4"]', 'reddit', 'us-zu4140-6', 'Platform Owner, 8yr SN, 15yr IT, 15% bonus, female'),
('Consultant', 180000, 'Full-time (W2)', '10+', 'US', 'Remote', '["CSA"]', 'reddit', 'us-zu4140-7', '25yr total, 13yr SN, Principal at consulting firm, 20% bonus'),
('Developer', 100000, 'Full-time (W2)', '2-3', 'US', 'Remote', '["CSA"]', 'reddit', 'us-zu4140-8', '2yr SN, 2yr full stack prior'),
('Consultant', 150000, 'Freelance', '10+', 'US', 'Remote', '["CSA"]', 'reddit', 'us-zu4140-9', '$150/hr independent consultant'),
('Developer', 150000, 'Full-time (W2)', '1-2', 'US', 'PNW', '["CSA"]', 'reddit', 'us-zu4140-10', '1yr SN, 9yr IT'),
('Consultant', 100000, 'Full-time (W2)', '2-3', 'US', 'Remote', '["CSA"]', 'reddit', 'us-zu4140-11', '2yr IT, 2yr SN, 5% bonus'),
('Administrator', 134000, 'Full-time (W2)', '2-3', 'US', 'Remote', '["CSA"]', 'reddit', 'us-wrawk3-3', 'Built ITSM/CSM/FSM/VR, started at $90k, 6% bonus'),
('Administrator', 70000, 'Full-time (W2)', '1-2', 'US', 'Remote', '["CSA"]', 'reddit', 'us-wrawk3-4', 'SN Analyst, employer paying for training'),
('Architect', 150000, 'Full-time (W2)', '5-7', 'US', 'Remote', '["CSA","CAD"]', 'reddit', 'us-wrawk3-5', 'Platform architect, started at $38k desk-side');
