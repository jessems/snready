-- Market benchmark data from PayScale, IT Jobs Watch, Empiric (March 2026)
-- These are median/average values from aggregate sources

-- UK market benchmarks (IT Jobs Watch March 2026)
INSERT OR IGNORE INTO salary_submissions (role, base_salary, employment_type, yoe_servicenow, country, city, certifications, source, source_id, notes) VALUES
('Developer', 82000, 'Full-time (W2)', '3-5', 'GB', 'UK Average', '["CSA"]', 'itjobswatch', 'uk-median-2026', 'IT Jobs Watch UK median £65k'),
('Developer', 46000, 'Full-time (W2)', '1-2', 'GB', 'UK Average', '["CSA"]', 'itjobswatch', 'uk-p25-2026', 'IT Jobs Watch UK P25 £36.5k'),
('Developer', 101000, 'Full-time (W2)', '5-7', 'GB', 'UK Average', '["CSA"]', 'itjobswatch', 'uk-p75-2026', 'IT Jobs Watch UK P75 £80k'),
('Developer', 126000, 'Full-time (W2)', '8+', 'GB', 'UK Average', '["CSA","CAD"]', 'itjobswatch', 'uk-p90-2026', 'IT Jobs Watch UK P90 £100k'),
('Developer', 91000, 'Full-time (W2)', '3-5', 'GB', 'London', '["CSA"]', 'itjobswatch', 'uk-london-2026', 'IT Jobs Watch London median £72.5k'),
('Developer', 66000, 'Full-time (W2)', '3-5', 'GB', 'UK excl London', '["CSA"]', 'itjobswatch', 'uk-exlondon-2026', 'IT Jobs Watch UK excl London median £52.5k'),
('Developer', 86000, 'Full-time (W2)', '3-5', 'GB', 'Scotland', '["CSA"]', 'itjobswatch', 'uk-scotland-2026', 'IT Jobs Watch Scotland median £68.5k');

-- Germany PayScale
INSERT OR IGNORE INTO salary_submissions (role, base_salary, employment_type, yoe_servicenow, country, city, certifications, source, source_id, notes) VALUES
('Developer', 66000, 'Full-time (W2)', '3-5', 'DE', 'Germany Average', '["CSA"]', 'payscale', 'de-avg-2026', 'PayScale Germany avg €61k'),
('Developer', 76000, 'Full-time (W2)', '5-7', 'DE', 'Germany Average', '["CSA","CAD"]', 'payscale', 'de-sr-2026', 'PayScale Germany estimated senior €70k'),
('Developer', 130000, 'Full-time (W2)', '8+', 'DE', 'Germany Average', '["CSA","CAD"]', 'payscale', 'de-arch-2026', 'Empiric Europe high €120k');

-- Netherlands PayScale  
INSERT OR IGNORE INTO salary_submissions (role, base_salary, employment_type, yoe_servicenow, country, city, certifications, source, source_id, notes) VALUES
('Developer', 58000, 'Full-time (W2)', '3-5', 'NL', 'Netherlands Average', '["CSA"]', 'payscale', 'nl-avg-2026', 'PayScale Netherlands avg €54k'),
('Developer', 86000, 'Full-time (W2)', '5-7', 'NL', 'Netherlands Average', '["CSA","CAD"]', 'payscale', 'nl-sr-2026', 'Estimated senior €80k');

-- Belgium PayScale
INSERT OR IGNORE INTO salary_submissions (role, base_salary, employment_type, yoe_servicenow, country, city, certifications, source, source_id, notes) VALUES
('Developer', 46000, 'Full-time (W2)', '3-5', 'BE', 'Belgium Average', '["CSA"]', 'payscale', 'be-avg-2026', 'PayScale Belgium avg €43k'),
('Developer', 65000, 'Full-time (W2)', '5-7', 'BE', 'Belgium Average', '["CSA","CAD"]', 'payscale', 'be-sr-2026', 'Estimated senior €60k');

-- France (estimated from Empiric Europe range)
INSERT OR IGNORE INTO salary_submissions (role, base_salary, employment_type, yoe_servicenow, country, city, certifications, source, source_id, notes) VALUES
('Developer', 76000, 'Full-time (W2)', '3-5', 'FR', 'France Average', '["CSA"]', 'empiric', 'fr-avg-2026', 'Empiric Europe avg €65-100k mid'),
('Developer', 108000, 'Full-time (W2)', '5-7', 'FR', 'France Average', '["CSA","CAD"]', 'empiric', 'fr-sr-2026', 'Empiric Europe senior est €100k');

-- Switzerland (premium market)
INSERT OR IGNORE INTO salary_submissions (role, base_salary, employment_type, yoe_servicenow, country, city, certifications, source, source_id, notes) VALUES
('Developer', 130000, 'Full-time (W2)', '3-5', 'CH', 'Switzerland Average', '["CSA"]', 'empiric', 'ch-avg-2026', 'Switzerland premium, estimated CHF120k'),
('Developer', 173000, 'Full-time (W2)', '5-7', 'CH', 'Switzerland Average', '["CSA","CAD"]', 'empiric', 'ch-sr-2026', 'Switzerland senior, estimated CHF160k');

-- Ireland
INSERT OR IGNORE INTO salary_submissions (role, base_salary, employment_type, yoe_servicenow, country, city, certifications, source, source_id, notes) VALUES
('Developer', 81000, 'Full-time (W2)', '3-5', 'IE', 'Ireland Average', '["CSA"]', 'empiric', 'ie-avg-2026', 'Ireland estimated €75k'),
('Developer', 108000, 'Full-time (W2)', '5-7', 'IE', 'Dublin', '["CSA","CAD"]', 'empiric', 'ie-dublin-2026', 'Dublin senior €100k');

-- Austria
INSERT OR IGNORE INTO salary_submissions (role, base_salary, employment_type, yoe_servicenow, country, city, certifications, source, source_id, notes) VALUES
('Developer', 65000, 'Full-time (W2)', '3-5', 'AT', 'Austria Average', '["CSA"]', 'empiric', 'at-avg-2026', 'Austria estimated €60k');
