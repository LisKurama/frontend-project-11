import fetchRss from '../lib/api';
import parseRss from '../lib/parser';

const updateFeeds = (state) => {
  state.feeds.forEach((feed) => {
    fetchRss(feed.url)
      .then((data) => parseRss(data))
      .then((parsedData) => {
        // Обновление постов
      })
      .catch((error) => {
        console.error('Ошибка обновления фидов:', error);
      });
  });

  setTimeout(() => updateFeeds(state), 5000);
};

export { updateFeeds };
