<?php

declare(strict_types=1);

require_once __DIR__ . '/common.php';

api_run(function (): array {
    $id = api_optional_positive_int('id');

    if ($id === null) {
        return fetch_companies();
    }

    $company = fetch_company_by_id($id);

    if ($company === null) {
        api_error_response('Company not found.', 404);
    }

    return $company;
});
