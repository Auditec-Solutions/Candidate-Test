<?php

declare(strict_types=1);

require_once __DIR__ . '/common.php';

api_run(function (): array {
    $id = api_optional_positive_int('id');

    if ($id === null) {
        return fetch_findings();
    }

    $finding = fetch_finding_by_id($id);

    if ($finding === null) {
        api_error_response('Finding not found.', 404);
    }

    return $finding;
});
