import axios from 'axios';
import parseRss from './parserXmlRss.js';
import { addPost } from './rssService.js';
import addProxy from './addProxy.js';

const updatePosts = (watchedState) => {
  const promises = watchedState.feed.map((feed) => axios
    .get(addProxy(feed.urlRss))
    .then((response) => {
      const { posts } = parseRss(response.data.contents);
      const postState = watchedState.posts;
      const postsWithCurrentId = postState.filter(
        (post) => post.feedId === feed.id,
      );
      const postLink = postsWithCurrentId.map((post) => post.link);
      const newPost = posts.filter((post) => !postLink.includes(post.link));
      newPost.forEach((post) => {
        addPost(
          watchedState,
          feed.id,
          post.title,
          post.link,
          post.description,
        );
      });
    })
    .catch((error) => {
      console.error(
        `Ошибка при получении данных для фида ${feed.id}:`,
        error.message,
      );
    }));

  return Promise.all(promises).finally(() => setTimeout(updatePosts, 5000, watchedState));
};

export default updatePosts;
