/* eslint-disable no-param-reassign */

export default function renderFormState(state, i18nextInstance, elements) {
    const {
      inputField, feedbackElement, submitButton, form,
    } = elements;
  
    switch (state.formState) {
      case 'invalid':
        submitButton.disabled = false;
        inputField.classList.add('is-invalid');
        feedbackElement.classList.remove('text-success', 'text-warning');
        feedbackElement.classList.add('text-danger');
        feedbackElement.textContent = i18nextInstance.t('invalid');
        inputField.value = '';
        inputField.focus();
        break;
  
      case 'sending':
        submitButton.disabled = true;
        inputField.classList.remove('is-invalid');
        feedbackElement.classList.remove('text-danger', 'text-success');
        feedbackElement.classList.add('text-warning');
        feedbackElement.textContent = i18nextInstance.t('sending');
        break;
  
      case 'added':
        submitButton.disabled = false;
        inputField.classList.remove('is-invalid');
        feedbackElement.classList.remove('text-danger', 'text-warning');
        feedbackElement.classList.add('text-success');
        feedbackElement.textContent = i18nextInstance.t('success');
        form.reset();
        inputField.focus();
        break;
  
      default:
        break;
    }
  }
  