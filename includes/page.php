<?php

declare(strict_types=1);

function request_entity_id(): ?int
{
    $id = filter_input(
        INPUT_GET,
        'id',
        FILTER_VALIDATE_INT,
        ['options' => ['min_range' => 1]]
    );

    return is_int($id) ? $id : null;
}

function render_app_page(string $title, string $heading, string $pageKey, string $activeSection): void
{
    $entityId = request_entity_id();
    $navigationItems = [
        ['key' => 'findings', 'label' => 'Findings', 'href' => 'index.php'],
        ['key' => 'companies', 'label' => 'Companies', 'href' => 'companies.php'],
        ['key' => 'contacts', 'label' => 'Contacts', 'href' => 'contacts.php'],
    ];
    ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?php echo htmlspecialchars($title); ?></title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="assets/css/app.css" rel="stylesheet">
</head>
<body class="app-shell">
  <div class="container py-4 py-lg-5">
    <nav class="app-nav mb-4" aria-label="Primary">
      <?php foreach ($navigationItems as $navigationItem): ?>
        <a
          class="app-nav__link <?php echo $activeSection === $navigationItem['key'] ? 'is-active' : ''; ?>"
          href="<?php echo htmlspecialchars($navigationItem['href']); ?>"
        >
          <?php echo htmlspecialchars($navigationItem['label']); ?>
        </a>
      <?php endforeach; ?>
    </nav>

    <header class="page-header mb-4">
      <p class="page-header__eyebrow mb-2">audit tracker</p>
      <h1 class="mb-0"><?php echo htmlspecialchars($heading); ?></h1>
    </header>

    <main
      id="app"
      class="app-surface"
      data-page="<?php echo htmlspecialchars($pageKey); ?>"
      <?php if ($entityId !== null): ?>data-entity-id="<?php echo $entityId; ?>"<?php endif; ?>
    ></main>
  </div>

  <script src="assets/js/app.js" defer></script>
</body>
</html>
    <?php
}
