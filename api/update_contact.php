<?php

declare(strict_types=1);

require_once __DIR__ . '/common.php';

api_update_entity(
    'contacts',
    [
        'first_name' => ['column' => 'first_name', 'maxLength' => 80],
        'last_name' => ['column' => 'last_name', 'maxLength' => 80],
        'email' => ['column' => 'email', 'maxLength' => 255, 'validation' => 'email'],
        'phone' => ['column' => 'phone', 'maxLength' => 40],
        'job_title' => ['column' => 'job_title', 'maxLength' => 120],
    ],
    'fetch_contact_by_id',
    'Contact'
);
