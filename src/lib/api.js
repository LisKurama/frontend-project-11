import axios from 'axios';

const fetchRss = (url) => {
  const proxyUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}&disableCache=true`;
  return axios.get(proxyUrl)
    .then((response) => response.data.contents);
};

export default fetchRss;
