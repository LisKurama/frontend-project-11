import axios from 'axios';
import { uniqueId } from 'lodash';
import parseRss from './parserXmlRss.js';
import addProxy from './addProxy.js';

export const addFeed = (watchedState, data, urlRss) => {
  watchedState.feed.push({
    id: uniqueId('feed_'),
    urlRss,
    title: data.channel.title,
    description: data.channel.description,
  });
};

export const addPost = (watchedState, feedId, title, link, description) => {
  watchedState.posts.push({
    id: uniqueId('post_'),
    feedId,
    description,
    title,
    link,
  });
};

const fetchData = (url) => axios
  .get(addProxy(url))
  .then((response) => response.data.contents)
  .catch((error) => {
    throw error;
  });

const fetchAndParseFeed = (watchedState, urlRss) => fetchData(urlRss)
  .then((data) => {
    const parsedData = parseRss(data);
    addFeed(watchedState, parsedData, urlRss);
    const lastFeedId = watchedState.feed[watchedState.feed.length - 1].id;
    parsedData.posts.forEach((item) => addPost(
      watchedState,
      lastFeedId,
      item.title,
      item.link,
      item.description,
    ));
  })
  .catch((error) => Promise.reject(error));

export default fetchAndParseFeed;
