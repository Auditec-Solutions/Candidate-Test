<?php

declare(strict_types=1);

require_once __DIR__ . '/common.php';

api_update_entity(
    'companies',
    [
        'name' => ['column' => 'name', 'maxLength' => 120],
        'industry' => ['column' => 'industry', 'maxLength' => 120],
        'website' => ['column' => 'website', 'maxLength' => 255, 'validation' => 'url'],
    ],
    'fetch_company_by_id',
    'Company'
);
