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
        this.messageTimeout = null;
        this.renderDisplay();
    }

    renderDisplay() {
        this.innerHTML = '';

        const display = document.createElement('div');
        display.className = 'inline-display';
        display.tabIndex = 0;
        display.textContent = this.value || 'Click to edit';
        display.addEventListener('click', () => this.renderEditor());
        display.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.renderEditor();
            }
        });

        this.messageEl = document.createElement('div');
        this.messageEl.className = 'inline-message';

        this.appendChild(display);
        this.appendChild(this.messageEl);
    }

    renderEditor() {
        this.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.className = 'inline-editor d-flex flex-column gap-2';

        const input = this.type === 'textarea'
            ? document.createElement('textarea')
            : document.createElement('input');

        if (this.type !== 'textarea') {
            input.type = 'text';
        }

        input.className = 'form-control';
        input.value = this.value;
        if (this.maxlength) {
            input.maxLength = parseInt(this.maxlength, 10);
        }

        const actions = document.createElement('div');
        actions.className = 'd-flex gap-2';

        const saveButton = document.createElement('button');
        saveButton.type = 'button';
        saveButton.className = 'btn btn-sm btn-primary';
        saveButton.textContent = 'Save';

        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.className = 'btn btn-sm btn-outline-secondary';
        cancelButton.textContent = 'Cancel';

        actions.appendChild(saveButton);
        actions.appendChild(cancelButton);

        this.messageEl = document.createElement('div');
        this.messageEl.className = 'inline-message';

        wrapper.appendChild(input);
        wrapper.appendChild(actions);
        wrapper.appendChild(this.messageEl);
        this.appendChild(wrapper);

        input.focus();

        cancelButton.addEventListener('click', () => this.renderDisplay());
        saveButton.addEventListener('click', () => this.saveValue(input.value, saveButton, cancelButton, input));
        input.addEventListener('keydown', (event) => {
            if (this.type === 'textarea') {
                if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                    event.preventDefault();
                    this.saveValue(input.value, saveButton, cancelButton, input);
                }
                return;
            }

            if (event.key === 'Enter') {
                event.preventDefault();
                this.saveValue(input.value, saveButton, cancelButton, input);
            }
        });
    }

    validateValue(value) {
        if (!value) {
            return 'Value cannot be empty.';
        }

        if (this.field === 'summary' && value.length > 500) {
            return 'Summary must be 500 characters or less.';
        }

        return '';
    }

    async saveValue(rawValue, saveButton, cancelButton, input) {
        const value = rawValue.trim();
        const validationError = this.validateValue(value);
        if (validationError) {
            this.showMessage(validationError, 'error');
            return;
        }

        if (value === this.value) {
            this.renderDisplay();
            return;
        }

        saveButton.disabled = true;
        cancelButton.disabled = true;
        input.disabled = true;

        try {
            const response = await fetch('/api/update_findings.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: this.id,
                    field: this.field,
                    value,
                }),
            });

            const data = await response.json();
            if (!response.ok || !data.success) {
                const message = data && data.message ? data.message : 'Save failed.';
                this.showMessage(message, 'error');
                return;
            }

            this.value = value;
            this.renderDisplay();
            this.showMessage('Saved.', 'success');
        } catch (error) {
            this.showMessage('Network error. Please try again.', 'error');
        } finally {
            saveButton.disabled = false;
            cancelButton.disabled = false;
            input.disabled = false;
        }
    }

    showMessage(text, type) {
        if (!this.messageEl) {
            return;
        }

        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
        }

        this.messageEl.textContent = text;
        this.messageEl.className = `inline-message inline-message-${type}`;

        if (type === 'success') {
            this.messageTimeout = setTimeout(() => {
                if (this.messageEl) {
                    this.messageEl.textContent = '';
                    this.messageEl.className = 'inline-message';
                }
            }, 2000);
        }
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
        this.messageTimeout = null;
        this.renderDisplay();


    renderDisplay() {
        this.innerHTML = '';

        const display = document.createElement('div');
        display.className = 'inline-display';
        display.tabIndex = 0;
        display.textContent = this.value || 'Click to edit';
        display.addEventListener('click', () => this.renderEditor());
        display.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.renderEditor();
            }
        });

        this.messageEl = document.createElement('div');
        this.messageEl.className = 'inline-message';

        this.appendChild(display);
        this.appendChild(this.messageEl);
    }

    renderEditor() {
        this.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.className = 'inline-editor d-flex flex-column gap-2';

        const select = document.createElement('select');
        select.className = 'form-select';

        this.options.forEach((optionValue) => {
            const option = document.createElement('option');
            option.value = optionValue;
            option.textContent = optionValue;
            if (optionValue === this.value) {
                option.selected = true;
            }
            select.appendChild(option);
        });

        const actions = document.createElement('div');
        actions.className = 'd-flex gap-2';

        const saveButton = document.createElement('button');
        saveButton.type = 'button';
        saveButton.className = 'btn btn-sm btn-primary';
        saveButton.textContent = 'Save';

        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.className = 'btn btn-sm btn-outline-secondary';
        cancelButton.textContent = 'Cancel';

        actions.appendChild(saveButton);
        actions.appendChild(cancelButton);

        this.messageEl = document.createElement('div');
        this.messageEl.className = 'inline-message';

        wrapper.appendChild(select);
        wrapper.appendChild(actions);
        wrapper.appendChild(this.messageEl);
        this.appendChild(wrapper);

        select.focus();

        cancelButton.addEventListener('click', () => this.renderDisplay());
        saveButton.addEventListener('click', () => this.saveValue(select.value, saveButton, cancelButton, select));
    }

    validateValue(value) {
        if (!value) {
            return 'Value cannot be empty.';
        }

        if (!this.options.includes(value)) {
            return 'Invalid status option.';
        }

        return '';
    }

    async saveValue(value, saveButton, cancelButton, select) {
        const validationError = this.validateValue(value);
        if (validationError) {
            this.showMessage(validationError, 'error');
            return;
        }

        if (value === this.value) {
            this.renderDisplay();
            return;
        }

        saveButton.disabled = true;
        cancelButton.disabled = true;
        select.disabled = true;

        try {
            const response = await fetch('/api/update_findings.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: this.id,
                    field: this.field,
                    value,
                }),
            });

            const data = await response.json();
            if (!response.ok || !data.success) {
                const message = data && data.message ? data.message : 'Save failed.';
                this.showMessage(message, 'error');
                return;
            }

            this.value = value;
            this.renderDisplay();
            this.showMessage('Saved.', 'success');
        } catch (error) {
            this.showMessage('Network error. Please try again.', 'error');
        } finally {
            saveButton.disabled = false;
            cancelButton.disabled = false;
            select.disabled = false;
        }
    }

    showMessage(text, type) {
        if (!this.messageEl) {
            return;
        }

        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
        }

        this.messageEl.textContent = text;
        this.messageEl.className = `inline-message inline-message-${type}`;

        if (type === 'success') {
            this.messageTimeout = setTimeout(() => {
                if (this.messageEl) {
                    this.messageEl.textContent = '';
                    this.messageEl.className = 'inline-message';
                }
            }, 2000);
        }
    }
    }

}

customElements.define('inline-edit', InlineEdit);
customElements.define('status-select', StatusSelect);
