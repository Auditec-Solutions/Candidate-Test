class InlineEdit extends HTMLElement {
  connectedCallback() {
    // Read element attributes and render the display view.
    this.id = this.getAttribute('data-id');
    this.field = this.getAttribute('data-field');
    this.type = this.getAttribute('data-type') || 'text';
    this.maxlength = this.getAttribute('data-maxlength');
    this.value = this.getAttribute('data-value') || '';

    this.renderDisplay();
  }

  renderDisplay() {
    // TODO: Render a clickable, read-only view of the current value.
    // Hint: set this.innerHTML, create a div with .inline-display, and
    // listen for click to call this.renderEditor().
  }

  renderEditor() {
    // TODO: Render the editor state (input or textarea) plus Save/Cancel.
    // The Save button should call this.handleSave(input.value).
    // The Cancel button should call this.renderDisplay().
  }

  async handleSave(nextValue) {
    // TODO: Validate and POST to api/update_finding.php.
    // Requirements:
    // - title and summary must be non-empty
    // - summary max length 500
    // - showStatus on success or error
  }
}

class StatusSelect extends HTMLElement {
  connectedCallback() {
    // Read element attributes and render the display view.
    this.id = this.getAttribute('data-id');
    this.field = this.getAttribute('data-field');
    this.value = this.getAttribute('data-value') || '';
    this.options = ['Open', 'Investigating', 'Closed'];

    this.renderDisplay();
  }

  renderDisplay() {
    // TODO: Render a clickable, read-only view of the current status.
    // Hint: use .inline-display and click to call this.renderEditor().
  }

  renderEditor() {
    // TODO: Render a select input for the status plus Save/Cancel buttons.
  }

  async handleSave(nextValue) {
    // TODO: Validate and POST to api/update_finding.php, then update UI.
  }
}

function showStatus(message, isError) {
  // TODO: Show a small success/error message in #save-status.
}

customElements.define('inline-edit', InlineEdit);
customElements.define('status-select', StatusSelect);
