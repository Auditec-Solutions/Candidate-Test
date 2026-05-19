PRAGMA foreign_keys = ON;

BEGIN TRANSACTION;

DELETE FROM findings;
DELETE FROM contacts;
DELETE FROM companies;

INSERT INTO companies (id, name, industry, website, created_at)
VALUES
  (1, 'Northwind', 'Retail Distribution', 'https://northwind.example.com', '2026-02-01 09:00:00'),
  (2, 'Contoso', 'Manufacturing', 'https://contoso.example.com', '2026-02-03 10:30:00'),
  (3, 'Fabrikam', 'Financial Services', 'https://fabrikam.example.com', '2026-02-05 14:15:00');

INSERT INTO contacts (id, company_id, first_name, last_name, email, phone, job_title, created_at)
VALUES
  (1, 1, 'Avery', 'Shaw', 'avery.shaw@northwind.example.com', '555-0101', 'Controller', '2026-02-10 08:15:00'),
  (2, 1, 'Lena', 'Ortiz', 'lena.ortiz@northwind.example.com', '555-0102', 'Operations Director', '2026-02-10 09:45:00'),
  (3, 2, 'Marcus', 'Reed', 'marcus.reed@contoso.example.com', '555-0201', 'Procurement Lead', '2026-02-11 11:00:00'),
  (4, 2, 'Priya', 'Nair', 'priya.nair@contoso.example.com', '555-0202', 'Legal Counsel', '2026-02-11 13:20:00'),
  (5, 3, 'Noah', 'Kim', 'noah.kim@fabrikam.example.com', '555-0301', 'Finance Manager', '2026-02-12 10:10:00');

INSERT INTO findings (id, company_id, title, status, summary, created_at)
VALUES
  (1, 1, 'Inconsistent revenue recognition', 'Open', 'Revenue timing varies across regions and month-end controls are not applied consistently.', '2026-02-25 09:12:00'),
  (2, 2, 'Incomplete vendor contracts', 'Investigating', 'Several vendor agreements are missing signatures or the latest amendment pages.', '2026-02-24 15:45:00'),
  (3, 3, 'Expense policy exceptions', 'Closed', 'Two policy exceptions were documented, approved, and archived with supporting evidence.', '2026-02-23 08:30:00'),
  (4, 1, 'Inventory reconciliation lag', 'Open', 'Warehouse counts are being reconciled two days after close, delaying exception review.', '2026-02-22 16:05:00');

COMMIT;
