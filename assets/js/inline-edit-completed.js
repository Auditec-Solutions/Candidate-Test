/**
 * Inline editor web component for editing a single finding field in place.
 * Reads data attributes from the element and handles display, edit, and save.
 */
class InlineEdit extends HTMLElement {
  /**
   * Initialize state from data attributes and render the read-only view.
   */
  connectedCallback() {
    this.id = this.getAttribute('data-id');
    this.field = this.getAttribute('data-field');
    this.type = this.getAttribute('data-type') || 'text';
    this.maxlength = this.getAttribute('data-maxlength');
    this.value = this.getAttribute('data-value') || '';

    this.renderDisplay();
  }

  /**
   * Render the read-only value display and attach click-to-edit behavior.
   */
  renderDisplay() {
    this.innerHTML = '';
    const display = document.createElement('div');
    display.className = 'inline-display';
    display.textContent = this.value || '(empty)';
    display.setAttribute('role', 'button');
    display.setAttribute('tabindex', '0');
    display.addEventListener('click', () => this.renderEditor());
    display.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.renderEditor();
      }
    });
    this.appendChild(display);
  }

  /**
   * Render the editable input (text or textarea) with Save/Cancel actions.
   */
  renderEditor() {
    this.innerHTML = '';
    const input = this.type === 'textarea' ? document.createElement('textarea') : document.createElement('input');
    if (this.type !== 'textarea') {
      input.type = 'text';
    }
    input.className = 'form-control mb-2';
    input.value = this.value;
    if (this.maxlength) {
      input.setAttribute('maxlength', this.maxlength);
    }

    const actions = document.createElement('div');
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn btn-sm btn-primary me-2';
    saveBtn.textContent = 'Save';
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-sm btn-outline-secondary';
    cancelBtn.textContent = 'Cancel';

    saveBtn.addEventListener('click', () => this.handleSave(input.value));
    cancelBtn.addEventListener('click', () => this.renderDisplay());
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.renderDisplay();
        return;
      }
      if (this.type !== 'textarea' && event.key === 'Enter') {
        event.preventDefault();
        this.handleSave(input.value);
        return;
      }
      if (this.type === 'textarea' && event.key === 'Enter' && event.ctrlKey) {
        event.preventDefault();
        this.handleSave(input.value);
      }
    });

    actions.appendChild(saveBtn);
    actions.appendChild(cancelBtn);

    this.appendChild(input);
    this.appendChild(actions);
    input.focus();
  }

  /**
   * Validate and persist changes via API, then update the UI state.
   * @param {string} nextValue
   * @returns {Promise<void>}
   */
  async handleSave(nextValue) {
    if (this.isSaving) {
      return;
    }

    const trimmed = (nextValue || '').trim();
    const max = this.maxlength ? parseInt(this.maxlength, 10) : null;

    if (!trimmed) {
      showStatus('Value cannot be empty.', true);
      return;
    }
    if (max && trimmed.length > max) {
      showStatus(`Max length is ${max}.`, true);
      return;
    }

    const payload = { id: this.id, field: this.field, value: trimmed };

    this.isSaving = true;
    try {
      const res = await fetch('api/update_finding.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!data.success) {
        showStatus(data.message || 'Save failed.', true);
        return;
      }
      this.value = trimmed;
      this.renderDisplay();
      showStatus('Saved.', false);
    } catch (err) {
      showStatus('Save failed.', true);
    } finally {
      this.isSaving = false;
    }
  }
}

/**
 * Status selector web component for editing a finding's status in place.
 * Provides a small, focused dropdown editor and save/cancel actions.
 */
class StatusSelect extends HTMLElement {
  /**
   * Initialize state from data attributes and render the read-only view.
   */
  connectedCallback() {
    this.id = this.getAttribute('data-id');
    this.field = this.getAttribute('data-field');
    this.value = this.getAttribute('data-value') || '';
    this.options = ['Open', 'Investigating', 'Closed'];

    this.renderDisplay();
  }

  /**
   * Render the read-only status display and attach click-to-edit behavior.
   */
  renderDisplay() {
    this.innerHTML = '';
    const display = document.createElement('div');
    display.className = 'inline-display';
    display.textContent = this.value || '(empty)';
    display.setAttribute('role', 'button');
    display.setAttribute('tabindex', '0');
    display.addEventListener('click', () => this.renderEditor());
    display.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.renderEditor();
      }
    });
    this.appendChild(display);
  }

  /**
   * Render the status dropdown and Save/Cancel actions.
   */
  renderEditor() {
    this.innerHTML = '';
    const select = document.createElement('select');
    select.className = 'form-select mb-2';
    this.options.forEach((opt) => {
      const option = document.createElement('option');
      option.value = opt;
      option.textContent = opt;
      if (opt === this.value) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    const actions = document.createElement('div');
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn btn-sm btn-primary me-2';
    saveBtn.textContent = 'Save';
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-sm btn-outline-secondary';
    cancelBtn.textContent = 'Cancel';

    saveBtn.addEventListener('click', () => this.handleSave(select.value));
    cancelBtn.addEventListener('click', () => this.renderDisplay());
    select.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        this.renderDisplay();
        return;
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        this.handleSave(select.value);
      }
    });

    actions.appendChild(saveBtn);
    actions.appendChild(cancelBtn);

    this.appendChild(select);
    this.appendChild(actions);
    select.focus();
  }

  /**
   * Persist the selected status via API and update the UI state.
   * @param {string} nextValue
   * @returns {Promise<void>}
   */
  async handleSave(nextValue) {
    if (this.isSaving) {
      return;
    }

    const trimmed = (nextValue || '').trim();
    if (!trimmed) {
      showStatus('Value cannot be empty.', true);
      return;
    }

    const payload = { id: this.id, field: this.field, value: trimmed };

    this.isSaving = true;
    try {
      const res = await fetch('api/update_finding.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!data.success) {
        showStatus(data.message || 'Save failed.', true);
        return;
      }
      this.value = trimmed;
      this.renderDisplay();
      showStatus('Saved.', false);
    } catch (err) {
      showStatus('Save failed.', true);
    } finally {
      this.isSaving = false;
    }
  }
}

/**
 * Show a short success/error message in the save-status area.
 * @param {string} message
 * @param {boolean} isError
 */
function showStatus(message, isError) {
  const el = document.getElementById('save-status');
  if (!el) {
    return;
  }
  // Message and time
  el.textContent = message + ' (' + new Date().toLocaleTimeString() + ')';
  el.className = isError ? 'text-danger small' : 'text-success small';
}

customElements.define('inline-edit', InlineEdit);
customElements.define('status-select', StatusSelect);
