/**
 * Inline edit for in-place editing of finding fields. This component reads data attributes to determine which field it is editing and handles the display, edit, and save interactions.
 * The StatusSelect component is a specialized version for editing the status field with predefined options.
 * Both components should communicate with the backend API to save changes and provide user feedback on success or error.
 */
class InlineEdit extends HTMLElement {
    connectedCallback() {
        // Read element attributes and render the display view.
        this.id = this.getAttribute('data-id');
        this.field = this.getAttribute('data-field');
        this.type = this.getAttribute('data-type') || 'text';
        this.maxlength = this.getAttribute('data-maxlength');
        this.value = this.getAttribute('data-value') || '';

        // TODO: On click, somehow do something to enable editing

    }

}

/**
 * This is a separate web component for selecting the status of a finding, which has a predefined set of options (Open, Investigating, Closed). It follows a similar pattern to InlineEdit but uses a select input instead of text/textarea.
 * If we have time in the interview, implement this component as well.
 */
class StatusSelect extends HTMLElement {
    connectedCallback() {
        // Read element attributes and render the display view.
        this.id = this.getAttribute('data-id');
        this.field = this.getAttribute('data-field');
        this.value = this.getAttribute('data-value') || '';
        this.options = ['Open', 'Investigating', 'Closed'];

        // Todo, on click, also handle options.


    }

}

customElements.define('inline-edit', InlineEdit);
customElements.define('status-select', StatusSelect);
