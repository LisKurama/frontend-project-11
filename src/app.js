import * as yup from 'yup';
import onChange from 'on-change';
import i18next from 'i18next';
import axios from 'axios';
import render from './view/View.js';
import fetchAndParseFeed from './rssServices/rssService.js';
import resources from './locales/index.js';
import updatePosts from './rssServices/updatePosts.js';

const getMessageError = (error) => {
  if (error.isParsingError) {
    return 'parsingError';
  }
  if (axios.isAxiosError(error)) {
    return 'networkError';
  }
  return error.message.key ?? 'unknown';
};

export default function app() {
  const state = {
    formState: 'filling',
    feed: [],
    posts: [],
    submitForm: {
      error: '',
      success: '',
    },
    readPosts: [],
    modalPostId: null,
  };

  const elements = {
    feedbackElement: document.querySelector('.feedback'),
    inputField: document.querySelector('#url-input'),
    form: document.querySelector('.rss-form'),
    submitButton: document.querySelector('.rss-form [type="submit"]'),
    ulPost: document.querySelector('.posts'),
    modalTitle: document.querySelector('#exampleModalLabel'),
    modalBody: document.querySelector('.modal-body'),
    viewButton: document.querySelector('.modal-footer .btn-primary'),
    postList: document.querySelector('.posts'),
    feedList: document.querySelector('.feeds'),
  };

  function createFormSchema() {
    return yup.object().shape({
      inputValue: yup
        .string()
        .trim()
        .required(() => ({ key: 'empty' }))
        .url(() => ({ key: 'notURL' }))
        .notOneOf(
          state.feed.map((feed) => feed.urlRss),
          () => ({ key: 'duplicateURL' }),
        ),
    });
  }

  const i18nextInstance = i18next.createInstance();
  i18nextInstance
    .init({
      lng: 'ru',
      debug: false,
      resources,
    })
    .then(() => {
      const watchedState = onChange(state, (path) => {
        render(watchedState, i18nextInstance, elements)(path);
      });

      updatePosts(watchedState);

      const handleFormSubmit = (inputValue) => {
        const formSchema = createFormSchema();
        formSchema
          .validate({ inputValue }, { abortEarly: false })
          .then(() => {
            watchedState.submitForm.error = '';
            watchedState.formState = 'sending';
            return fetchAndParseFeed(watchedState, inputValue);
          })
          .then(() => {
            watchedState.formState = 'added';
          })
          .catch((error) => {
            watchedState.formState = 'invalid';
            const errorMessageKey = getMessageError(error);
            watchedState.submitForm.error = errorMessageKey;
          });
      };

      elements.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const inputField = document.querySelector('#url-input');
        const inputValue = inputField.value.trim();
        handleFormSubmit(inputValue);
      });

      const markPostAsRead = (postId) => {
        if (!state.readPosts.includes(postId)) {
          watchedState.readPosts.push(postId);
        }
      };

      elements.ulPost.addEventListener('click', (event) => {
        const postElement = event.target.closest('.liPost');
        if (postElement) {
          const postId = postElement.getAttribute('data-id');
          if (event.target.tagName === 'BUTTON') {
            watchedState.modalPostId = postId;
            markPostAsRead(postId);
          } else if (event.target.tagName === 'A') {
            markPostAsRead(postId);
          }
        }
      });
    });
}
