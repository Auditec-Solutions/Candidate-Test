const appRoot = document.querySelector('#app');
const pageNotice = {
  message: '',
  isError: false,
};

const pageHandlers = {
    'findings-list': renderFindingsListPage,
    'finding-detail': renderFindingDetailPage,
    'companies-list': renderCompaniesListPage,
    'company-detail': renderCompanyDetailPage,
    'contacts-list': renderContactsListPage,
    'contact-detail': renderContactDetailPage,
};

const statusClassMap = {
    Open: 'status-pill status-pill--open',
    Investigating: 'status-pill status-pill--investigating',
    Closed: 'status-pill status-pill--closed',
};

initPage();

async function initPage() {
    if (!appRoot) {
        return;
    }

    const pageKey = appRoot.dataset.page;
    const handler = pageHandlers[pageKey];

    if (!handler) {
        renderMessage('Unknown page configuration.', true);
        return;
    }

    appRoot.innerHTML = renderLoadingState();

    try {
        await handler();
    } catch (error) {
        renderMessage(error instanceof Error ? error.message : 'Unable to load data.', true);
    }
}

async function renderFindingsListPage() {
    const findings = await fetchJson('api/findings.php');

    appRoot.innerHTML = `
        <section class="surface-card">
          <div class="surface-card__header">
            <div>
              <h2 class="h4 mb-1">Open and historical findings</h2>
              <p class="text-secondary mb-0">Each row includes the company's first recorded contact.</p>
            </div>
            <span class="surface-card__count">${findings.length} total</span>
          </div>
          ${renderTable(
              ['Company', 'First Contact', 'Title', 'Status', 'Summary', 'Created'],
              findings.map((finding) => `
                <tr>
                  <td>${renderLink(`company.php?id=${finding.company_id}`, finding.company_name)}</td>
                  <td>${finding.contact_id ? renderLink(`contact.php?id=${finding.contact_id}`, finding.contact_name) : '<span class="text-secondary">No contact</span>'}</td>
                  <td>${renderLink(`finding.php?id=${finding.id}`, finding.title)}</td>
                  <td>${renderStatus(finding.status)}</td>
                  <td>${escapeHtml(finding.summary)}</td>
                  <td>${formatDate(finding.created_at)}</td>
                </tr>
              `).join('')
          )}
        </section>
    `;
}

async function renderFindingDetailPage() {
    const id = requiredEntityId();
    const finding = await fetchJson(`api/findings.php?id=${encodeURIComponent(id)}`);

    appRoot.innerHTML = `
        <section class="detail-layout">
          ${renderPageNotice()}
          <article class="surface-card surface-card--detail">
            <div class="detail-header">
              <div>
                <p class="detail-label">finding</p>
                <h2 class="mb-2">${escapeHtml(finding.title)}</h2>
              </div>
              ${renderStatus(finding.status)}
            </div>
            <dl class="detail-grid">
              ${renderDetailItem('Company', renderLink(`company.php?id=${finding.company_id}`, finding.company_name))}
              ${renderDetailItem('First Contact', finding.contact_id ? renderLink(`contact.php?id=${finding.contact_id}`, finding.contact_name) : 'No contact recorded')}
              ${renderDetailItem('Contact Email', finding.contact_email ? escapeHtml(finding.contact_email) : 'Not available')}
              ${renderDetailItem('Created', formatDate(finding.created_at))}
            </dl>
            <section>
              <h3 class="h6 text-uppercase text-secondary">Summary</h3>
              <p class="mb-0">${escapeHtml(finding.summary)}</p>
            </section>
          </article>

            ${renderEditableSection('Edit Finding', 'api/update_finding.php', finding.id, [
              {
                name: 'title',
                label: 'Title',
                type: 'text',
                value: finding.title,
                maxLength: 200,
              },
              {
                name: 'status',
                label: 'Status',
                type: 'select',
                value: finding.status,
                options: ['Open', 'Investigating', 'Closed'],
              },
              {
                name: 'summary',
                label: 'Summary',
                type: 'textarea',
                value: finding.summary,
                maxLength: 1000,
                rows: 4,
              },
            ])}
        </section>
    `;

        attachEditForms();
}

async function renderCompaniesListPage() {
    const companies = await fetchJson('api/companies.php');

    appRoot.innerHTML = `
        <section class="surface-card">
          <div class="surface-card__header">
            <div>
              <h2 class="h4 mb-1">Company directory</h2>
              <p class="text-secondary mb-0">Browse companies tied to findings and contacts.</p>
            </div>
            <span class="surface-card__count">${companies.length} total</span>
          </div>
          ${renderTable(
              ['Name', 'Industry', 'Website', 'Created'],
              companies.map((company) => `
                <tr>
                  <td>${renderLink(`company.php?id=${company.id}`, company.name)}</td>
                  <td>${escapeHtml(company.industry)}</td>
                  <td>${renderExternalLink(company.website)}</td>
                  <td>${formatDate(company.created_at)}</td>
                </tr>
              `).join('')
          )}
        </section>
    `;
}

async function renderCompanyDetailPage() {
    const id = requiredEntityId();
    const company = await fetchJson(`api/companies.php?id=${encodeURIComponent(id)}`);

    appRoot.innerHTML = `
        <section class="detail-layout">
          ${renderPageNotice()}
          <article class="surface-card surface-card--detail">
            <div class="detail-header">
              <div>
                <p class="detail-label">company</p>
                <h2 class="mb-2">${escapeHtml(company.name)}</h2>
              </div>
              <a class="app-link" href="${escapeAttribute(company.website)}" target="_blank" rel="noreferrer">Visit site</a>
            </div>
            <dl class="detail-grid">
              ${renderDetailItem('Industry', escapeHtml(company.industry))}
              ${renderDetailItem('Created', formatDate(company.created_at))}
              ${renderDetailItem('Contacts', String(company.contacts.length))}
              ${renderDetailItem('Findings', String(company.findings.length))}
            </dl>
          </article>

              ${renderEditableSection('Edit Company', 'api/update_company.php', company.id, [
                {
                  name: 'name',
                  label: 'Name',
                  type: 'text',
                  value: company.name,
                  maxLength: 120,
                },
                {
                  name: 'industry',
                  label: 'Industry',
                  type: 'text',
                  value: company.industry,
                  maxLength: 120,
                },
                {
                  name: 'website',
                  label: 'Website',
                  type: 'url',
                  value: company.website,
                  maxLength: 255,
                },
              ])}

          <div class="detail-split">
            <article class="surface-card">
              <h3 class="h5 mb-3">Contacts</h3>
              ${renderStackList(
                  company.contacts,
                  (contact) => `
                    <li>
                      <a class="stack-link" href="contact.php?id=${contact.id}">
                        <strong>${escapeHtml(`${contact.first_name} ${contact.last_name}`)}</strong>
                        <span>${escapeHtml(contact.job_title)}</span>
                        <span>${escapeHtml(contact.email)}</span>
                      </a>
                    </li>
                  `,
                  'No contacts recorded.'
              )}
            </article>

            <article class="surface-card">
              <h3 class="h5 mb-3">Findings</h3>
              ${renderStackList(
                  company.findings,
                  (finding) => `
                    <li>
                      <a class="stack-link" href="finding.php?id=${finding.id}">
                        <strong>${escapeHtml(finding.title)}</strong>
                        <span>${renderStatus(finding.status)}</span>
                        <span>${formatDate(finding.created_at)}</span>
                      </a>
                    </li>
                  `,
                  'No findings recorded.'
              )}
            </article>
          </div>
        </section>
    `;

    attachEditForms();
}

async function renderContactsListPage() {
    const contacts = await fetchJson('api/contacts.php');

    appRoot.innerHTML = `
        <section class="surface-card">
          <div class="surface-card__header">
            <div>
              <h2 class="h4 mb-1">Contact directory</h2>
              <p class="text-secondary mb-0">Primary people tied to each company record.</p>
            </div>
            <span class="surface-card__count">${contacts.length} total</span>
          </div>
          ${renderTable(
              ['Name', 'Company', 'Title', 'Email', 'Phone'],
              contacts.map((contact) => `
                <tr>
                  <td>${renderLink(`contact.php?id=${contact.id}`, `${contact.first_name} ${contact.last_name}`)}</td>
                  <td>${renderLink(`company.php?id=${contact.company_id}`, contact.company_name)}</td>
                  <td>${escapeHtml(contact.job_title)}</td>
                  <td>${escapeHtml(contact.email)}</td>
                  <td>${escapeHtml(contact.phone)}</td>
                </tr>
              `).join('')
          )}
        </section>
    `;
}

async function renderContactDetailPage() {
    const id = requiredEntityId();
    const contact = await fetchJson(`api/contacts.php?id=${encodeURIComponent(id)}`);

    appRoot.innerHTML = `
        <section class="detail-layout">
          ${renderPageNotice()}
          <article class="surface-card surface-card--detail">
            <div class="detail-header">
              <div>
                <p class="detail-label">contact</p>
                <h2 class="mb-2">${escapeHtml(`${contact.first_name} ${contact.last_name}`)}</h2>
              </div>
              <a class="app-link" href="mailto:${escapeAttribute(contact.email)}">Email contact</a>
            </div>
            <dl class="detail-grid">
              ${renderDetailItem('Company', renderLink(`company.php?id=${contact.company_id}`, contact.company_name))}
              ${renderDetailItem('Job Title', escapeHtml(contact.job_title))}
              ${renderDetailItem('Email', escapeHtml(contact.email))}
              ${renderDetailItem('Phone', escapeHtml(contact.phone))}
              ${renderDetailItem('Industry', escapeHtml(contact.company_industry))}
              ${renderDetailItem('Company Site', renderExternalLink(contact.company_website))}
            </dl>
          </article>

              ${renderEditableSection('Edit Contact', 'api/update_contact.php', contact.id, [
                {
                  name: 'first_name',
                  label: 'First Name',
                  type: 'text',
                  value: contact.first_name,
                  maxLength: 80,
                },
                {
                  name: 'last_name',
                  label: 'Last Name',
                  type: 'text',
                  value: contact.last_name,
                  maxLength: 80,
                },
                {
                  name: 'job_title',
                  label: 'Job Title',
                  type: 'text',
                  value: contact.job_title,
                  maxLength: 120,
                },
                {
                  name: 'email',
                  label: 'Email',
                  type: 'email',
                  value: contact.email,
                  maxLength: 255,
                },
                {
                  name: 'phone',
                  label: 'Phone',
                  type: 'text',
                  value: contact.phone,
                  maxLength: 40,
                },
              ])}
        </section>
    `;

          attachEditForms();
}

async function fetchJson(url) {
    const response = await fetch(url, {
        headers: {
            Accept: 'application/json',
        },
    });

    let payload;

    try {
        payload = await response.json();
    } catch (error) {
        throw new Error('The server returned an invalid response.');
    }

    if (!response.ok) {
        throw new Error(payload.error || 'The request could not be completed.');
    }

    return payload.data;
}

  async function postJson(url, payload) {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    let responsePayload;

    try {
      responsePayload = await response.json();
    } catch (error) {
      throw new Error('The server returned an invalid response.');
    }

    if (!response.ok || responsePayload.success === false) {
      throw new Error(responsePayload.error || responsePayload.message || 'The request could not be completed.');
    }

    return responsePayload.data;
  }

  async function reloadCurrentPage() {
    const pageKey = appRoot?.dataset.page;
    const handler = pageKey ? pageHandlers[pageKey] : null;

    if (!handler) {
      return;
    }

    appRoot.innerHTML = renderLoadingState();
    await handler();
  }

function requiredEntityId() {
    const rawId = appRoot?.dataset.entityId || '';
    const entityId = Number.parseInt(rawId, 10);

    if (!Number.isInteger(entityId) || entityId <= 0) {
        throw new Error('A valid record identifier is required for this page.');
    }

    return entityId;
}

function renderTable(headings, bodyRows) {
    const rowsMarkup = typeof bodyRows === 'string' ? bodyRows.trim() : '';

    return `
        <div class="table-responsive">
          <table class="table app-table align-middle mb-0">
            <thead>
              <tr>${headings.map((heading) => `<th scope="col">${escapeHtml(heading)}</th>`).join('')}</tr>
            </thead>
            <tbody>${rowsMarkup || `<tr><td colspan="${headings.length}" class="text-secondary">No records found.</td></tr>`}</tbody>
          </table>
        </div>
    `;
}

function renderPageNotice() {
  if (!pageNotice.message) {
    return '';
  }

  return `<div class="alert ${pageNotice.isError ? 'alert-danger' : 'alert-success'} page-notice" role="status">${escapeHtml(pageNotice.message)}</div>`;
}

function renderDetailItem(label, value) {
    return `
        <div class="detail-item">
          <dt>${escapeHtml(label)}</dt>
          <dd>${value}</dd>
        </div>
    `;
}

function renderEditableSection(title, endpoint, entityId, fields) {
  return `
    <article class="surface-card">
      <div class="surface-card__header">
      <div>
        <h3 class="h5 mb-1">${escapeHtml(title)}</h3>
        <p class="text-secondary mb-0">Update fields directly on this page.</p>
      </div>
      </div>
      <div class="edit-grid">
      ${fields.map((field) => renderEditableFieldForm(endpoint, entityId, field)).join('')}
      </div>
    </article>
  `;
}

function renderEditableFieldForm(endpoint, entityId, field) {
  const inputId = `edit-${entityId}-${field.name}`;

  return `
    <form class="edit-form" data-endpoint="${escapeAttribute(endpoint)}" data-entity-id="${entityId}" data-field="${escapeAttribute(field.name)}" data-label="${escapeAttribute(field.label)}">
      <label class="edit-form__label" for="${escapeAttribute(inputId)}">${escapeHtml(field.label)}</label>
      ${renderEditableControl(inputId, field)}
      <div class="edit-form__actions">
      <button class="btn btn-primary btn-sm" type="submit">Save</button>
      <p class="edit-feedback" aria-live="polite"></p>
      </div>
    </form>
  `;
}

function renderEditableControl(inputId, field) {
  const maxLength = Number.isInteger(field.maxLength) ? ` maxlength="${field.maxLength}"` : '';
  const required = ' required';

  if (field.type === 'textarea') {
    const rows = Number.isInteger(field.rows) ? field.rows : 3;
    return `<textarea class="form-control edit-form__control" id="${escapeAttribute(inputId)}" name="value" rows="${rows}"${maxLength}${required}>${escapeHtml(field.value)}</textarea>`;
  }

  if (field.type === 'select') {
    return `
      <select class="form-select edit-form__control" id="${escapeAttribute(inputId)}" name="value"${required}>
        ${field.options.map((option) => `<option value="${escapeAttribute(option)}"${option === field.value ? ' selected' : ''}>${escapeHtml(option)}</option>`).join('')}
      </select>
    `;
  }

  return `<input class="form-control edit-form__control" id="${escapeAttribute(inputId)}" name="value" type="${escapeAttribute(field.type || 'text')}" value="${escapeAttribute(field.value)}"${maxLength}${required}>`;
}

function attachEditForms() {
  appRoot.querySelectorAll('.edit-form').forEach((form) => {
    form.addEventListener('submit', handleEditFormSubmit);
  });
}

async function handleEditFormSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;

  if (!(form instanceof HTMLFormElement) || !form.reportValidity()) {
    return;
  }

  const input = form.elements.namedItem('value');
  const feedback = form.querySelector('.edit-feedback');

  if (!(input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement || input instanceof HTMLSelectElement)) {
    return;
  }

  if (!(feedback instanceof HTMLElement)) {
    return;
  }

  const label = form.dataset.label || 'Field';
  const payload = {
    id: Number.parseInt(form.dataset.entityId || '', 10),
    field: form.dataset.field || '',
    value: input.value,
  };

  setFormPendingState(form, true);
  feedback.className = 'edit-feedback';
  feedback.textContent = 'Saving...';

  try {
    await postJson(form.dataset.endpoint || '', payload);
    pageNotice.message = `${label} updated.`;
    pageNotice.isError = false;
    await reloadCurrentPage();
  } catch (error) {
    pageNotice.message = '';
    pageNotice.isError = false;
    feedback.className = 'edit-feedback edit-feedback--error';
    feedback.textContent = error instanceof Error ? error.message : 'Unable to save changes.';
    setFormPendingState(form, false);
  }
}

function setFormPendingState(form, isPending) {
  form.querySelectorAll('input, textarea, select, button').forEach((element) => {
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement || element instanceof HTMLButtonElement) {
      element.disabled = isPending;
    }
  });
}

function renderStackList(items, renderer, emptyMessage) {
    if (!Array.isArray(items) || items.length === 0) {
        return `<p class="text-secondary mb-0">${escapeHtml(emptyMessage)}</p>`;
    }

    return `<ul class="stack-list">${items.map(renderer).join('')}</ul>`;
}

function renderStatus(status) {
    const cssClass = statusClassMap[status] || 'status-pill';
    return `<span class="${cssClass}">${escapeHtml(status)}</span>`;
}

function renderLoadingState() {
    return '<section class="surface-card"><p class="mb-0 text-secondary">Loading data...</p></section>';
}

function renderMessage(message, isError = false) {
    appRoot.innerHTML = `
        <section class="surface-card">
          <p class="mb-0 ${isError ? 'text-danger' : 'text-secondary'}">${escapeHtml(message)}</p>
        </section>
    `;
}

function renderLink(href, label) {
    return `<a class="app-link" href="${escapeAttribute(href)}">${escapeHtml(label)}</a>`;
}

function renderExternalLink(url) {
    return `<a class="app-link" href="${escapeAttribute(url)}" target="_blank" rel="noreferrer">${escapeHtml(url)}</a>`;
}

function formatDate(value) {
    if (!value) {
        return 'Not available';
    }

    const parsedDate = new Date(String(value).replace(' ', 'T'));

    if (Number.isNaN(parsedDate.getTime())) {
        return escapeHtml(String(value));
    }

    return parsedDate.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function escapeAttribute(value) {
    return escapeHtml(value);
}
