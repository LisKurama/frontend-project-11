/* eslint-disable no-param-reassign */

import axios from 'axios';
import { uniqueId } from 'lodash';
import parseRss from './parser.js';
import addProxy from './proxy.js';

export const addFeed = (watchedState, data, urlRss) => {
  watchedState.feed = [...watchedState.feed, {
    id: uniqueId('feed_'),
    urlRss,
    title: data.channel.title,
    description: data.channel.description,
  }];
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
    const newPosts = parsedData.posts.map((item) => ({
      id: uniqueId('post_'),
      feedId: lastFeedId,
      title: item.title,
      link: item.link,
      description: item.description,
      date: item.date,
    }));
    watchedState.posts = [...watchedState.posts, ...newPosts]
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  })
  .catch((error) => Promise.reject(error));

export default fetchAndParseFeed;
