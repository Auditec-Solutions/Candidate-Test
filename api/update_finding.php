<?php

// Stubbed API for the exercise. No database updates are performed.
// This endpoint validates the input and simulates a successful update response.

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON payload.']);
    exit;
}

$id = isset($data['id']) ? (int)$data['id'] : 0;
$field = isset($data['field']) ? trim($data['field']) : '';
$value = isset($data['value']) ? trim($data['value']) : '';

$allowed = ['company_name', 'title', 'status', 'summary'];

if ($id <= 0 || !in_array($field, $allowed, true)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input.']);
    exit;
}

if ($value === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Value cannot be empty.']);
    exit;
}

if ($field === 'summary' && strlen($value) > 500) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Summary too long.']);
    exit;
}

echo json_encode(['success' => true]);
