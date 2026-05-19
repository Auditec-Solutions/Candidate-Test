This is a basic application to test a SE2 engineer. 

Implement the following:
- SQLite database containing "Findings", "Companies", and "Contacts". Put in some reasonable mock data. (Create a 'seed' sql file to populate the database and run it)

- API endpoints to retrieve all of them.
  - No authentication/authorization for this mock project

- The current "Findings List" page (currently just 'findings') should also include the company's first found 'contact'.

- Create the following additional pages:
  - Finding Info
  - Company Info
  - Contact Info
  - Company List
  - Contact List

And a navigation bar for the list pages.

The base pages should perform 'fetch' queries to retrieve the data from the API endpoints.