import validateUrl from '../lib/validation';
import fetchRss from '../lib/api';
import parseRss from '../lib/parser';

const handleFormSubmit = (e, state) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const url = formData.get('url');

  validateUrl(url, state.feeds)
    .then(() => {
      fetchRss(url)
        .then((data) => parseRss(data))
        .then((parsedData) => {
          state.feeds.push({ url, ...parsedData });
          // Добавление новых фидов в UI
        })
        .catch((error) => {
          console.error('Ошибка загрузки RSS:', error);
        });
    })
    .catch((error) => {
      console.error('Ошибка валидации:', error);
    });
};

export default handleFormSubmit;
