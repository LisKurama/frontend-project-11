import renderFeeds from './renderFeed.js';
import renderPosts from './renderPost.js';
import renderErrors from './renderErrors.js';
import renderFormState from './renderFormeState.js';
import renderModalId from './renderModalId.js';

export default function render(state, i18nextInstance, elements) {
  const renderPath = (path) => {
    switch (path) {
      case 'formState':
        renderFormState(state, i18nextInstance, elements);
        break;
      case 'submitForm.error':
      case 'submitForm.success':
        renderErrors(state, i18nextInstance, elements);
        break;
      case 'feed':
        renderFeeds(state, i18nextInstance, elements);
        break;
      case 'posts':
      case 'readPosts':
        renderPosts(state, i18nextInstance, elements);
        break;
      case 'modalPostId':
        renderModalId(state, i18nextInstance, elements);
        break;
      default:
        break;
    }
  };
  return renderPath;
}
