<?php

declare(strict_types=1);

const APP_DB_PATH = __DIR__ . '/data/app.db';

function app_db(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $databaseDirectory = dirname(APP_DB_PATH);

    if (!is_dir($databaseDirectory) && !mkdir($databaseDirectory, 0775, true) && !is_dir($databaseDirectory)) {
        throw new RuntimeException('Database directory could not be created.');
    }

    $pdo = new PDO('sqlite:' . APP_DB_PATH, null, null, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    $pdo->exec('PRAGMA foreign_keys = ON');

    return $pdo;
}

function fetch_all_rows(string $sql, array $params = []): array
{
    $statement = app_db()->prepare($sql);
    $statement->execute($params);

    return $statement->fetchAll();
}

function fetch_one_row(string $sql, array $params = []): ?array
{
    $statement = app_db()->prepare($sql);
    $statement->execute($params);
    $row = $statement->fetch();

    return $row === false ? null : $row;
}

function finding_with_relations_sql(): string
{
    return <<<SQL
        SELECT
            findings.id,
            findings.company_id,
            findings.title,
            findings.status,
            findings.summary,
            findings.created_at,
            companies.name AS company_name,
            first_contacts.id AS contact_id,
            first_contacts.first_name || ' ' || first_contacts.last_name AS contact_name,
            first_contacts.email AS contact_email
        FROM findings
        INNER JOIN companies ON companies.id = findings.company_id
        LEFT JOIN contacts AS first_contacts
            ON first_contacts.id = (
                SELECT contacts_inner.id
                FROM contacts AS contacts_inner
                WHERE contacts_inner.company_id = companies.id
                ORDER BY contacts_inner.id ASC
                LIMIT 1
            )
    SQL;
}

function fetch_findings(): array
{
    return fetch_all_rows(finding_with_relations_sql() . ' ORDER BY findings.created_at DESC, findings.id DESC');
}

function fetch_finding_by_id(int $id): ?array
{
    return fetch_one_row(finding_with_relations_sql() . ' WHERE findings.id = :id LIMIT 1', ['id' => $id]);
}

function fetch_companies(): array
{
    return fetch_all_rows(
        'SELECT id, name, industry, website, created_at FROM companies ORDER BY name ASC'
    );
}

function fetch_company_by_id(int $id): ?array
{
    $company = fetch_one_row(
        'SELECT id, name, industry, website, created_at FROM companies WHERE id = :id LIMIT 1',
        ['id' => $id]
    );

    if ($company === null) {
        return null;
    }

    $company['contacts'] = fetch_all_rows(
        'SELECT id, first_name, last_name, email, phone, job_title, created_at
         FROM contacts
         WHERE company_id = :company_id
         ORDER BY id ASC',
        ['company_id' => $id]
    );

    $company['findings'] = fetch_all_rows(
        'SELECT id, title, status, summary, created_at
         FROM findings
         WHERE company_id = :company_id
         ORDER BY created_at DESC, id DESC',
        ['company_id' => $id]
    );

    return $company;
}

function fetch_contacts(): array
{
    return fetch_all_rows(
        'SELECT
            contacts.id,
            contacts.company_id,
            contacts.first_name,
            contacts.last_name,
            contacts.email,
            contacts.phone,
            contacts.job_title,
            contacts.created_at,
            companies.name AS company_name
         FROM contacts
         INNER JOIN companies ON companies.id = contacts.company_id
         ORDER BY contacts.last_name ASC, contacts.first_name ASC'
    );
}

function fetch_contact_by_id(int $id): ?array
{
    return fetch_one_row(
        'SELECT
            contacts.id,
            contacts.company_id,
            contacts.first_name,
            contacts.last_name,
            contacts.email,
            contacts.phone,
            contacts.job_title,
            contacts.created_at,
            companies.name AS company_name,
            companies.website AS company_website,
            companies.industry AS company_industry
         FROM contacts
         INNER JOIN companies ON companies.id = contacts.company_id
         WHERE contacts.id = :id
         LIMIT 1',
        ['id' => $id]
    );
}
