# Findings App

Php/sqlite demo app with fetch-driven list and detail pages for findings, companies, and contacts for candidates to extend off of.

## run locally

1a. If using Windows:

Ensure that the latest C++ redist is installed:
https://aka.ms/vc14/vc_redist.x64.exe

Use the included PHP executable to start the server.

	```powershell
	.\php\php.exe -S 127.0.0.1:8099 -t .
	```

1b. If using Linux, install PHP from the store and then run it. For Debian, that's:

	```bash
	sudo apt install php php-sqlite3 php-mbstring
	```

Then run the server.

	```bash
	php -S 127.0.0.1:8099 -t .
	```

2. Open the local application:

	```text
	http://127.0.0.1:8099/
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

## Other

To restore the database, re-checkout or hard reset the 'app.db'.