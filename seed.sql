INSERT INTO findings (company_name, title, status, summary, created_at)
VALUES
  ('Northwind', 'Inconsistent revenue recognition', 'Open', 'Revenue timing varies across regions.', NOW()),
  ('Contoso', 'Incomplete vendor contracts', 'Investigating', 'Several vendor agreements are missing signatures.', NOW()),
  ('Fabrikam', 'Expense policy exceptions', 'Closed', 'Two exceptions documented and approved.', NOW());
