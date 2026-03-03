<?php
$findings = [
  [
    'id' => 1,
    'company_name' => 'Northwind',
    'title' => 'Inconsistent revenue recognition',
    'status' => 'Open',
    'summary' => 'Revenue timing varies across regions.',
    'created_at' => '2026-02-25 09:12:00',
  ],
  [
    'id' => 2,
    'company_name' => 'Contoso',
    'title' => 'Incomplete vendor contracts',
    'status' => 'Investigating',
    'summary' => 'Several vendor agreements are missing signatures.',
    'created_at' => '2026-02-24 15:45:00',
  ],
  [
    'id' => 3,
    'company_name' => 'Fabrikam',
    'title' => 'Expense policy exceptions',
    'status' => 'Closed',
    'summary' => 'Two exceptions documented and approved.',
    'created_at' => '2026-02-23 08:30:00',
  ],
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Findings</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="assets/css/app.css" rel="stylesheet">
</head>
<body class="bg-light">
  <div class="container py-4">
    <h1 class="mb-4">Findings</h1>
    <div class="card">
      <div class="card-body">
        <table class="table table-striped align-middle">
          <thead>
            <tr>
              <th>Company</th>
              <th>Title</th>
              <th>Status</th>
              <th>Summary</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($findings as $finding): ?>
              <tr>
                <td>
                  <inline-edit
                    data-id="<?php echo htmlspecialchars($finding['id']); ?>"
                    data-field="company_name"
                    data-type="text"
                    data-value="<?php echo htmlspecialchars($finding['company_name']); ?>"
                  ></inline-edit>
                </td>
                <td>
                  <inline-edit
                    data-id="<?php echo htmlspecialchars($finding['id']); ?>"
                    data-field="title"
                    data-type="text"
                    data-value="<?php echo htmlspecialchars($finding['title']); ?>"
                  ></inline-edit>
                </td>
                <td>
                  <status-select
                    data-id="<?php echo htmlspecialchars($finding['id']); ?>"
                    data-field="status"
                    data-value="<?php echo htmlspecialchars($finding['status']); ?>"
                  ></status-select>
                </td>
                <td>
                  <inline-edit
                    data-id="<?php echo htmlspecialchars($finding['id']); ?>"
                    data-field="summary"
                    data-type="textarea"
                    data-maxlength="500"
                    data-value="<?php echo htmlspecialchars($finding['summary']); ?>"
                  ></inline-edit>
                </td>
                <td><?php echo htmlspecialchars($finding['created_at']); ?></td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <script src="assets/js/inline-edit.js"></script>
</body>
</html>
