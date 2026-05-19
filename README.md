# Findings App

php/sqlite demo app with fetch-driven list and detail pages for findings, companies, and contacts.

## run locally

1. initialize the database:

	```bash
	mkdir -p data
	sqlite3 data/app.db < schema.sql
	sqlite3 data/app.db < seed.sql
	```

2. start the php server from the project root:

	```bash
	php -S 127.0.0.1:8088 -t .
	```

3. open the app:

	```text
	http://127.0.0.1:8088/
	```

## pages

- findings list: `/`
- finding info: `/finding.php?id=1` with editable title, status, and summary
- company list: `/companies.php`
- company info: `/company.php?id=1` with editable name, industry, and website
- contact list: `/contacts.php`
- contact info: `/contact.php?id=1` with editable first name, last name, job title, email, and phone

## api

- `GET /api/findings.php`
- `GET /api/findings.php?id=1`
- `GET /api/companies.php`
- `GET /api/companies.php?id=1`
- `GET /api/contacts.php`
- `GET /api/contacts.php?id=1`
- `POST /api/update_finding.php`
- `POST /api/update_company.php`
- `POST /api/update_contact.php`