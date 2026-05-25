<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/db.php';

function api_json_response(array $payload, int $statusCode = 200): never
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');

    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    exit;
}

function api_error_response(string $message, int $statusCode): never
{
    api_json_response(['error' => $message], $statusCode);
}

function api_require_method(string $method): void
{
    if (strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET')) !== strtoupper($method)) {
        api_error_response('Method not allowed.', 405);
    }
}

function api_require_get(): void
{
    api_require_method('GET');
}

function api_require_post(): void
{
    api_require_method('POST');
}

function api_optional_positive_int(string $key): ?int
{
    $value = $_GET[$key] ?? null;

    if ($value === null || $value === '') {
        return null;
    }

    if (!is_string($value) || !ctype_digit($value)) {
        api_error_response('Invalid identifier.', 400);
    }

    $intValue = (int) $value;

    if ($intValue <= 0) {
        api_error_response('Invalid identifier.', 400);
    }

    return $intValue;
}

function api_json_input(): array
{
    $raw = file_get_contents('php://input');

    try {
        $decoded = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
    } catch (JsonException $exception) {
        api_error_response('Invalid JSON payload.', 400);
    }

    if (!is_array($decoded)) {
        api_error_response('Invalid JSON payload.', 400);
    }

    return $decoded;
}

function api_payload_positive_int(array $payload, string $key): int
{
    $value = $payload[$key] ?? null;

    if (is_int($value) && $value > 0) {
        return $value;
    }

    if (!is_string($value) || !ctype_digit($value)) {
        api_error_response('Invalid identifier.', 400);
    }

    $intValue = (int) $value;

    if ($intValue <= 0) {
        api_error_response('Invalid identifier.', 400);
    }

    return $intValue;
}

function api_payload_string(array $payload, string $key, string $message): string
{
    $value = $payload[$key] ?? null;

    if (!is_string($value)) {
        api_error_response($message, 400);
    }

    $trimmed = trim($value);

    if ($trimmed === '') {
        api_error_response($message, 400);
    }

    return $trimmed;
}

function api_validate_field_value(array $fieldConfig, string $value): void
{
    $maxLength = (int) ($fieldConfig['maxLength'] ?? 255);

    if (mb_strlen($value) > $maxLength) {
        api_error_response('Value is too long.', 400);
    }

    $allowedValues = $fieldConfig['allowedValues'] ?? null;

    if (is_array($allowedValues) && !in_array($value, $allowedValues, true)) {
        api_error_response('Invalid value.', 400);
    }

    $validation = $fieldConfig['validation'] ?? null;

    if ($validation === 'email' && filter_var($value, FILTER_VALIDATE_EMAIL) === false) {
        api_error_response('Invalid email address.', 400);
    }

    if ($validation === 'url' && filter_var($value, FILTER_VALIDATE_URL) === false) {
        api_error_response('Invalid URL.', 400);
    }
}

function api_update_entity(
    string $table,
    array $allowedFields,
    callable $fetchById,
    string $entityLabel
): void {
    try {
        api_require_post();
        $payload = api_json_input();
        $id = api_payload_positive_int($payload, 'id');
        $field = api_payload_string($payload, 'field', 'Invalid field.');
        $value = api_payload_string($payload, 'value', 'Value cannot be empty.');

        if (!isset($allowedFields[$field])) {
            api_error_response('Invalid input.', 400);
        }

        $fieldConfig = $allowedFields[$field];
        api_validate_field_value($fieldConfig, $value);

        $statement = app_db()->prepare(
            sprintf('UPDATE %s SET %s = :value WHERE id = :id', $table, $fieldConfig['column'])
        );
        $statement->execute([
            'value' => $value,
            'id' => $id,
        ]);

        $updatedEntity = $fetchById($id);

        if (!is_array($updatedEntity)) {
            api_error_response(sprintf('%s not found.', $entityLabel), 404);
        }

        api_json_response([
            'success' => true,
            'data' => $updatedEntity,
        ]);
    } catch (PDOException $exception) {
        $message = $exception->getMessage();

        if (str_contains($message, 'UNIQUE constraint failed') || str_contains($message, 'CHECK constraint failed')) {
            api_error_response('Unable to save that value.', 400);
        }

        error_log($message);
        api_error_response('Server error.', 500);
    } catch (Throwable $exception) {
        error_log($exception->getMessage());
        api_error_response('Server error.', 500);
    }
}

function api_run(callable $callback): void
{
    try {
        api_require_get();
        api_json_response(['data' => $callback()]);
    } catch (Throwable $exception) {
        error_log($exception->getMessage());
        api_error_response('Server error.', 500);
    }
}
