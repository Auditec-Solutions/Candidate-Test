<?php

declare(strict_types=1);

require_once __DIR__ . '/common.php';

try {
    api_require_post();

    $validateField = static function (array $fieldConfig, string $value): void {
        $maxLength = (int) ($fieldConfig['maxLength'] ?? 255);

        if (mb_strlen($value) > $maxLength) {
            api_error_response('Value is too long.', 400);
        }

        $allowedValues = $fieldConfig['allowedValues'] ?? null;

        if (is_array($allowedValues) && !in_array($value, $allowedValues, true)) {
            api_error_response('Invalid value.', 400);
        }
    };

    $payload = api_json_input();
    $companyName = isset($payload['company_name']) && is_string($payload['company_name'])
        ? trim($payload['company_name'])
        : '';
    $companyId = null;

    if ($companyName !== '') {
        $company = fetch_one_row(
            'SELECT id
             FROM companies
             WHERE name = :name COLLATE NOCASE
             LIMIT 1',
            ['name' => $companyName]
        );

        $companyId = $company === null ? null : (int) $company['id'];

        if ($companyId === null) {
            api_error_response('Company not found.', 404);
        }
    } else {
        $companyId = api_payload_positive_int($payload, 'company_id');

        if (fetch_company_by_id($companyId) === null) {
            api_error_response('Company not found.', 404);
        }
    }

    $title = api_payload_string($payload, 'title', 'Title cannot be empty.');
    $status = api_payload_string($payload, 'status', 'Status cannot be empty.');
    $summary = api_payload_string($payload, 'summary', 'Summary cannot be empty.');

    $validateField(['maxLength' => 200], $title);
    $validateField([
        'maxLength' => 40,
        'allowedValues' => ['Open', 'Investigating', 'Closed'],
    ], $status);
    $validateField(['maxLength' => 1000], $summary);

    $statement = app_db()->prepare(
        'INSERT INTO findings (company_id, title, status, summary, created_at)
         VALUES (:company_id, :title, :status, :summary, :created_at)'
    );
    $statement->execute([
        'company_id' => $companyId,
        'title' => $title,
        'status' => $status,
        'summary' => $summary,
        'created_at' => date('Y-m-d H:i:s'),
    ]);

    $findingId = (int) app_db()->lastInsertId();
    $finding = fetch_finding_by_id($findingId);

    if (!is_array($finding)) {
        api_error_response('Finding not found.', 404);
    }

    api_json_response([
        'success' => true,
        'data' => $finding,
    ], 201);
} catch (PDOException $exception) {
    $message = $exception->getMessage();

    if (str_contains($message, 'FOREIGN KEY constraint failed') || str_contains($message, 'CHECK constraint failed')) {
        api_error_response('Unable to save finding.', 400);
    }

    error_log($message);
    api_error_response('Server error.', 500);
} catch (Throwable $exception) {
    error_log($exception->getMessage());
    api_error_response('Server error.', 500);
}