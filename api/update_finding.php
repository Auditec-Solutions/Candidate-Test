<?php

declare(strict_types=1);

require_once __DIR__ . '/common.php';

api_update_entity(
    'findings',
    [
        'title' => ['column' => 'title', 'maxLength' => 200],
        'status' => ['column' => 'status', 'maxLength' => 40, 'allowedValues' => ['Open', 'Investigating', 'Closed']],
        'summary' => ['column' => 'summary', 'maxLength' => 1000],
    ],
    'fetch_finding_by_id',
    'Finding'
);
