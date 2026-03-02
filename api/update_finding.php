<?php
// Stubbed API for the take-home exercise. No database updates are performed.

header('Content-Type: application/json');

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

$id = isset($data['id']) ? (int)$data['id'] : 0;
$field = isset($data['field']) ? trim($data['field']) : '';
$value = isset($data['value']) ? trim($data['value']) : '';

$allowed = ['company_name', 'title', 'status', 'summary'];

if ($id <= 0 || !in_array($field, $allowed, true)) {
    echo json_encode(['success' => false, 'message' => 'Invalid input.']);
    exit;
}

if ($value === '') {
    echo json_encode(['success' => false, 'message' => 'Value cannot be empty.']);
    exit;
}

if ($field === 'summary' && strlen($value) > 500) {
    echo json_encode(['success' => false, 'message' => 'Summary too long.']);
    exit;
}

echo json_encode(['success' => true]);
