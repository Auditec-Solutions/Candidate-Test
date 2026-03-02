<?php
$findings = [
  [
    'id' => 1,
    'company_name' => 'Northwind',
    'title' => 'Inconsistent revenue recognition',
    'status' => 'Open',
    'summary' => 'Revenue timing varies across regions.',
  ],
  [
    'id' => 2,
    'company_name' => 'Contoso',
    'title' => 'Incomplete vendor contracts',
    'status' => 'Investigating',
    'summary' => 'Several vendor agreements are missing signatures.',
  ],
  [
    'id' => 3,
    'company_name' => 'Fabrikam',
    'title' => 'Expense policy exceptions',
    'status' => 'Closed',
    'summary' => 'Two exceptions documented and approved.',
  ],
];

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
$finding = null;
foreach ($findings as $item) {
  if ($item['id'] === $id) {
    $finding = $item;
    break;
  }
}

if (!$finding) {
  http_response_code(404);
  echo 'Finding not found.';
  exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Finding Detail</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="assets/css/app.css" rel="stylesheet">
</head>
<body class="bg-light">
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1 class="mb-0">Finding Detail</h1>
      <a class="btn btn-sm btn-outline-secondary" href="index.php">Back</a>
    </div>

    <div class="card">
      <div class="card-body">
        <div class="mb-3">
          <div class="text-muted small">Company</div>
          <div class="fw-semibold"><?php echo htmlspecialchars($finding['company_name']); ?></div>
        </div>

        <div class="mb-3">
          <div class="text-muted small">Title</div>
          <inline-edit data-id="<?php echo $finding['id']; ?>" data-field="title" data-type="text" data-value="<?php echo htmlspecialchars($finding['title']); ?>"></inline-edit>
        </div>

        <div class="mb-3">
          <div class="text-muted small">Status</div>
          <status-select data-id="<?php echo $finding['id']; ?>" data-field="status" data-value="<?php echo htmlspecialchars($finding['status']); ?>"></status-select>
        </div>

        <div class="mb-3">
          <div class="text-muted small">Summary</div>
          <inline-edit data-id="<?php echo $finding['id']; ?>" data-field="summary" data-type="textarea" data-maxlength="500" data-value="<?php echo htmlspecialchars($finding['summary']); ?>"></inline-edit>
        </div>

        <div id="save-status" class="small"></div>
      </div>
    </div>
  </div>

  <script src="assets/js/inline-edit-completed.js"></script>
</body>
</html>
