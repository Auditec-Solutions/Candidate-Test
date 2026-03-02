class InlineEdit extends HTMLElement {
  connectedCallback() {
    // Read element attributes and render the display view.
    this.id = this.getAttribute('data-id');
    this.field = this.getAttribute('data-field');
    this.type = this.getAttribute('data-type') || 'text';
    this.maxlength = this.getAttribute('data-maxlength');
    this.value = this.getAttribute('data-value') || '';
    
    
    // TODO: 
    // Render a clickable, read-only view of the current value.
    // When clicked, it should swap to an editor state where the user can edit the value. The editor should include an input (or textarea if data-type is "textarea") and Save/Cancel buttons.
    // In the editor state, clicking "Save" should call this.handleSave(input.value) and clicking "Cancel" should to revert to the read-only view.

  }

}

/**
 * This is a separate web component for selecting the status of a finding, which has a predefined set of options (Open, Investigating, Closed). It follows a similar pattern to InlineEdit but uses a select input instead of text/textarea.
 */
class StatusSelect extends HTMLElement {
  connectedCallback() {
    // Read element attributes and render the display view.
    this.id = this.getAttribute('data-id');
    this.field = this.getAttribute('data-field');
    this.value = this.getAttribute('data-value') || '';
    this.options = ['Open', 'Investigating', 'Closed'];

    

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
