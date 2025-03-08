/* eslint-disable no-param-reassign */

import axios from 'axios';
import { uniqueId } from 'lodash';
import parseRss from './parser.js';

export const addFeed = (watchedState, data, urlRss) => {
  watchedState.feed = [{
    id: uniqueId('feed_'),
    urlRss,
    title: data.channel.title,
    description: data.channel.description,
  }, ...watchedState.feed];
};

export const addPost = (watchedState, feedId, title, link, description) => {
  watchedState.posts = [...watchedState.posts, {
    id: uniqueId('post_'),
    feedId,
    description,
    title,
    link,
  }];
};

const fetchData = (url, addProxy) => axios
  .get(addProxy(url))
  .then((response) => response.data.contents)
  .catch((error) => {
    throw error;
  });

const fetchAndParseFeed = (watchedState, urlRss, addProxy) => fetchData(urlRss, addProxy)
  .then((data) => {
    const parsedData = parseRss(data);

    addFeed(watchedState, parsedData, urlRss);

    const lastFeedId = watchedState.feed[0].id;
    const newPosts = parsedData.posts.map((item) => ({
      id: uniqueId('post_'),
      feedId: lastFeedId,
      title: item.title,
      link: item.link,
      description: item.description,
      date: item.date,
    }));

    watchedState.posts = [...newPosts, ...watchedState.posts];

    watchedState.posts = [...watchedState.posts]
      .sort((a, b) => {
        if (a.feedId === b.feedId) {
          return new Date(b.date) - new Date(a.date);
        }
        return b.feedId - a.feedId;
      });
  })
  .catch((error) => Promise.reject(error));

export default fetchAndParseFeed;
