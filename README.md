# Findings App (Starter)

This is a small PHP app for tracking findings in a company review process.

## Quick setup

1. Serve the folder with PHP's built-in server:
   
   php -S localhost:8000

2. Open http://localhost:8000/index.php

## Candidate task (20 minutes)

You are given a working codebase. Your goal is to add inline editing to the findings table using HTML5 custom elements (web components). Keep changes small and focused.

### Requirements

- In the findings table, make `company_name`, `title`, `status`, and `summary` editable inline.
- Use custom elements (e.g. `<inline-edit>` and `<status-select>`).
- Save via AJAX to a PHP endpoint and update the UI without a full reload.
- Validate:
  - `company_name`, `title`, and `summary` must be non-empty
  - `summary` max length 500
- Provide a small success/error message on save.

### Constraints

- Vanilla PHP + JavaScript
- Bootstrap is OK
- Keep it small and reasonable

### Deliverable

- Working inline edits for the four fields
- No database required; the update API is stubbed

## Suggested places to look

- `index.php` (table view)
- `api/update_finding.php` (API endpoint)
- `assets/js/inline-edit.js` (custom elements)
