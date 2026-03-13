-- European salary data from Reddit threads (March 2026 scrape)
-- Exchange rates used: GBP=1.26, EUR=1.08, SEK=0.095, DKK=0.14, CAD=0.73

-- UK salaries
INSERT OR IGNORE INTO salary_submissions (role, base_salary, employment_type, yoe_servicenow, country, city, certifications, source, source_id, notes) VALUES
('Consultant', 125000, 'Full-time (W2)', '10+', 'GB', 'Remote', '["CSA"]', 'reddit', 'uk-1ckms44-1', 'STC at ServiceNow, £99k + bonus/stocks, 9-10 years, 40s'),
('Consultant', 107000, 'Full-time (W2)', '8+', 'GB', 'Remote', '["CSA"]', 'reddit', 'uk-1ckms44-2', 'STC at SN, £85k base + bonus/stocks over £100k'),
('Architect', 126000, 'Full-time (W2)', '5-7', 'GB', 'Remote', '["CSA"]', 'reddit', 'uk-1ckms44-3', 'Solution architect, £100k, 5yr SN, 15yr IT'),
('Consultant', 94500, 'Full-time (W2)', '5-7', 'GB', 'Remote', '["CSA","CAD","CIS-ITSM"]', 'reddit', 'uk-1ckms44-4', 'STC, £75k, 7yr exp'),
('Developer', 81900, 'Full-time (W2)', '3-5', 'GB', 'Remote', '["CSA"]', 'reddit', 'uk-1ckms44-5', 'Senior developer, £65k'),
('Developer', 73000, 'Full-time (W2)', '2-3', 'GB', 'Remote', '["CSA"]', 'reddit', 'uk-1ckms44-6', 'Developer, £58k'),
('Developer', 69300, 'Full-time (W2)', '<1', 'GB', 'London', '["CSA"]', 'reddit', 'uk-1nu9xjc-1', 'Developer starting, £55k, London'),
('Architect', 63000, 'Full-time (W2)', '3-5', 'GB', 'Remote', '["CSA"]', 'reddit', 'uk-1ckms44-7', 'Customer architect, £50k, 4 years'),
('Administrator', 59800, 'Full-time (W2)', '3-5', 'GB', 'Remote', '["CSA"]', 'reddit', 'uk-1ckms44-8', 'End-client role, £47.5k'),
('Consultant', 92000, 'Full-time (W2)', '2-3', 'GB', 'Remote', '["CSA"]', 'reddit', 'uk-1ckms44-9', 'Partner senior tech consultant, £73k'),
('Architect', 48000, 'Full-time (W2)', '3-5', 'GB', 'Remote', '["CTA"]', 'reddit', 'uk-1ckms44-10', 'Architect at Kyndryl, £38k underpaid');

-- Netherlands salaries
INSERT OR IGNORE INTO salary_submissions (role, base_salary, employment_type, yoe_servicenow, country, city, certifications, source, source_id, notes) VALUES
('Consultant', 88000, 'Full-time (W2)', '5-7', 'NL', 'Remote', '["CSA"]', 'reddit', 'nl-1fq2nts-1', 'Senior solution consultant, €75-88k range, took higher'),
('Consultant', 86400, 'Full-time (W2)', '5-7', 'NL', 'Remote', '["CSA"]', 'reddit', 'nl-vbe09l-1', 'Now €80k with 5+ years, started at €37k'),
('Consultant', 48600, 'Full-time (W2)', '1-2', 'NL', 'Remote', '["CSA"]', 'reddit', 'nl-vbe09l-2', 'ITOM consultant, €45k, 1 year exp, started €42k');

-- Denmark salaries
INSERT OR IGNORE INTO salary_submissions (role, base_salary, employment_type, yoe_servicenow, country, city, certifications, source, source_id, notes) VALUES
('Consultant', 180000, 'Freelance', '10+', 'DK', 'Remote', '["CSA"]', 'reddit', 'dk-vbe09l-1', 'Own consultancy, 15+ years ITSM, $180k+ surplus'),
('Architect', 105000, 'Full-time (W2)', '8+', 'DK', 'Remote', '["CSA"]', 'reddit', 'dk-vbe09l-2', 'Consultant, $105k'),
('Architect', 90000, 'Full-time (W2)', '8+', 'DK', 'Remote', '["CSA"]', 'reddit', 'dk-vbe09l-3', 'Bank architect, $90k before switch');

-- Germany salaries
INSERT OR IGNORE INTO salary_submissions (role, base_salary, employment_type, yoe_servicenow, country, city, certifications, source, source_id, notes) VALUES
('Consultant', 103000, 'Full-time (W2)', '5-7', 'DE', 'Remote', '["CSA"]', 'reddit', 'de-1mkvbyv-1', 'Sr Tech Consultant, €70-120k range, mid estimate €95k');

-- Sweden salaries (converted from SEK: 35k SEK/month * 12 * 0.095 = ~40k USD)
INSERT OR IGNORE INTO salary_submissions (role, base_salary, employment_type, yoe_servicenow, country, city, certifications, source, source_id, notes) VALUES
('Consultant', 42000, 'Full-time (W2)', '1-2', 'SE', 'Remote', '["CSA"]', 'reddit', 'se-efm5qa-1', 'Entry level, 32-38k SEK/month, took mid');

-- Canada salaries (from age/experience thread)
INSERT OR IGNORE INTO salary_submissions (role, base_salary, employment_type, yoe_servicenow, country, city, certifications, source, source_id, notes) VALUES
('Administrator', 73000, 'Full-time (W2)', '3-5', 'CA', 'Remote', '["CSA"]', 'reddit', 'ca-1b7cghh-1', 'Lead ServiceNow admin, team of 4, 100k CAD'),
('Developer', 54750, 'Full-time (W2)', '1-2', 'CA', 'Remote', '["CSA","CIS-HRSD"]', 'reddit', 'ca-1b7cghh-2', '75k CAD, 1yr HRSD');

-- Additional US data from threads
INSERT OR IGNORE INTO salary_submissions (role, base_salary, employment_type, yoe_servicenow, country, city, certifications, source, source_id, notes) VALUES
('Developer', 120000, 'Full-time (W2)', '1-2', 'US', 'Florida', '["CSA","CAD","CIS-Discovery","CIS-ITSM"]', 'reddit', 'us-1b7cghh-1', '26M, 1yr SN, 8yr IT'),
('Administrator', 90000, 'Full-time (W2)', '5-7', 'US', 'Remote', '["CSA"]', 'reddit', 'us-1b7cghh-2', 'CSA for small company, 5yr exp, 53yo'),
('Developer', 160000, 'Full-time (W2)', '5-7', 'US', 'Remote', '["CSA","CAD","CIS-ITSM","CIS-HRSD"]', 'reddit', 'us-1b7cghh-3', 'Sr SN Developer, going for CTA, 35yo'),
('Administrator', 105000, 'Full-time (W2)', '3-5', 'US', 'Remote', '["CSA","ITIL4"]', 'reddit', 'us-1b7cghh-4', 'SN BA, works with CMDB, 31yo'),
('Developer', 140000, 'Full-time (W2)', '5-7', 'US', 'Remote', '["CSA"]', 'reddit', 'us-vbe09l-1', 'SN Consultant, 140k from Principal at 100k'),
('Consultant', 150000, 'Full-time (W2)', '5-7', 'US', 'Midwest', '["CSA"]', 'reddit', 'us-vbe09l-2', 'Sr Consultant, started intern at 65k'),
('Developer', 118000, 'Full-time (W2)', '10+', 'US', 'Remote', '["CSA"]', 'reddit', 'us-vbe09l-3', 'Senior Developer, started in 1999'),
('Consultant', 150000, 'Full-time (W2)', '5-7', 'US', 'Remote', '["CSA"]', 'reddit', 'us-vbe09l-4', 'Partner Sr TC, started at 60k 6yr ago');
