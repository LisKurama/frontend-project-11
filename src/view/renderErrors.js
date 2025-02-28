/* eslint-disable no-param-reassign */
export default function renderErrors(state, i18nextInstance, elements) {
    if (state.submitForm.error === '') {
      return;
    }
  
    elements.feedbackElement.classList.add('text-danger');
    elements.feedbackElement.textContent = i18nextInstance.t(
      `${state.submitForm.error}`,
    );
  }
  