/* eslint-disable no-param-reassign */

import axios from 'axios';
import { uniqueId } from 'lodash';
import parseRss from './parser.js';

const updatePosts = (watchedState, addProxy) => {
  const promises = watchedState.feed.map((feed) => axios
    .get(addProxy(feed.urlRss))
    .then((response) => {
      const { posts } = parseRss(response.data.contents);
      const postState = watchedState.posts;

      const postsWithCurrentId = postState.filter((post) => post.feedId === feed.id);
      const postLink = postsWithCurrentId.map((post) => post.link);
      const newPost = posts.filter((post) => !postLink.includes(post.link));

      const newPosts = newPost.map((post) => ({
        id: uniqueId('post_'),
        feedId: feed.id,
        title: post.title,
        link: post.link,
        description: post.description,
        date: post.date,
      }));

      watchedState.posts = [...newPosts, ...watchedState.posts];

      watchedState.posts = [...watchedState.posts].sort((a, b) => {
        if (a.feedId === b.feedId) {
          return new Date(b.date) - new Date(a.date);
        }
        return b.feedId - a.feedId;
      });
    })
    .catch((error) => {
      console.error(
        `Ошибка при получении данных для фида ${feed.id}:`,
        error.message,
      );
    }));

  return Promise.all(promises).finally(() => setTimeout(updatePosts, 5000, watchedState, addProxy));
};

export default updatePosts;
