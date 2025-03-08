/* eslint-disable no-param-reassign, no-undef */

import onChange from 'on-change';

const renderFormState = (state, i18nextInstance, elements) => {
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
};

const renderFeeds = (state, i18nextInstance, elements) => {
  const { feedList } = elements;
  feedList.innerHTML = '';
  if (state.feed.length > 0) {
    const feedTitle = document.createElement('h2');
    feedTitle.textContent = i18nextInstance.t('Feeds');
    feedList.appendChild(feedTitle);

    const ulFeed = document.createElement('ul');

    state.feed
      .sort((a, b) => a.title.localeCompare(b.title))
      .forEach((feed) => {
        const liFeed = document.createElement('li');

        const feedTitleElement = document.createElement('strong');
        feedTitleElement.textContent = feed.title;
        liFeed.appendChild(feedTitleElement);

        const feedDescription = document.createElement('p');
        feedDescription.textContent = feed.description;
        liFeed.appendChild(feedDescription);

        ulFeed.appendChild(liFeed);
      });
    feedList.appendChild(ulFeed);
  }
};

const renderPosts = (state, i18nextInstance, elements) => {
  const { postList } = elements;
  postList.innerHTML = '';

  if (state.posts.length > 0) {
    const postTitle = document.createElement('h2');
    postTitle.textContent = i18nextInstance.t('Posts');
    postList.appendChild(postTitle);

    const ulPost = document.createElement('ul');

    [...state.posts]
      .sort((a, b) => {
        if (a.feedId === b.feedId) {
          return new Date(b.date) - new Date(a.date);
        }
        return b.feedId - a.feedId;
      })
      .forEach((post) => {
        const liPost = document.createElement('li');
        liPost.setAttribute('data-id', post.id);
        liPost.classList.add('liPost');

        const postLink = document.createElement('a');
        postLink.setAttribute('href', post.link);
        postLink.setAttribute('target', '_blank');
        postLink.textContent = i18nextInstance.t(post.title);

        if (state.readPosts.includes(post.id)) {
          postLink.classList.remove('fw-bold');
          postLink.classList.add('fw-normal', 'text-muted');
        } else {
          postLink.classList.add('fw-bold');
          postLink.classList.remove('fw-normal', 'text-muted');
        }

        const button = document.createElement('button');
        button.classList.add('buttonPost');
        button.setAttribute('type', 'button');
        button.setAttribute('data-bs-toggle', 'modal');
        button.setAttribute('data-bs-target', '#exampleModal');
        button.textContent = i18nextInstance.t('view');

        liPost.appendChild(postLink);
        liPost.appendChild(button);
        ulPost.appendChild(liPost);
      });

    postList.appendChild(ulPost);
  }
};

const renderModalId = (state, i18nextInstance, elements) => {
  const { modalTitle, modalBody, viewButton } = elements;
  const post = state.posts.find((p) => p.id === state.modalPostId);
  if (post) {
    modalTitle.textContent = i18nextInstance.t(post.title);
    modalBody.textContent = i18nextInstance.t(post.description);
    viewButton.onclick = () => {
      const link = document.createElement('a');
      link.href = post.link;
      link.target = '_blank';
      link.click();
    };
  }
};

const renderErrors = (state, i18nextInstance, elements) => {
  if (state.submitForm.error === '') {
    return;
  }

  elements.feedbackElement.classList.add('text-danger');
  elements.feedbackElement.textContent = i18nextInstance.t(
    `${state.submitForm.error}`,
  );
};

const render = (state, i18nextInstance, elements) => {
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
};

export default function watchState(state, i18nextInstance, elements) {
  return onChange(state, (path) => {
    render(state, i18nextInstance, elements)(path);
  });
}
