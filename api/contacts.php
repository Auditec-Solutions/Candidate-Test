<?php

declare(strict_types=1);

require_once __DIR__ . '/common.php';

api_run(function (): array {
    $id = api_optional_positive_int('id');

    if ($id === null) {
        return fetch_contacts();
    }

    $contact = fetch_contact_by_id($id);

    if ($contact === null) {
        api_error_response('Contact not found.', 404);
    }

    return $contact;
});
