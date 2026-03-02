# Findings App (Starter)

This is a small PHP app for tracking findings in a company review process.

## Quick setup

1. Serve the folder with PHP's built-in server:
   
   php -S localhost:8000

2. Open http://localhost:8000/index.php

## Candidate task (20 minutes)

You are given a working codebase. Your goal is to add inline editing to the findings table. You may use HTML5 custom elements (web components); a template is provided. Keep changes small and focused.

### Requirements

- In the findings table, make `company_name`, `title`, `status`, and `summary` editable inline.
- Save via AJAX to a PHP endpoint and update the UI without a full reload (/api/update_findings.php).
- Validate:
  - `company_name`, `title`, and `summary` must be non-empty
  - `summary` max length 500
- Provide success/error messages on save.

### Constraints

- Vanilla PHP + JavaScript
- Bootstrap is OK

### Deliverable

- Working inline edits for the three text fields. If time permits, include the 'select' field with options.
- No database required; the update API is stubbed

## Suggested places to look

- `index.php` (table view)
- `api/update_finding.php` (API endpoint)
- `assets/js/inline-edit.js` (custom elements)
