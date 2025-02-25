import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';
import handleFormSubmit from './views/appView';
import { updateFeeds } from './state/appState';

const initApp = () => {
  const state = {
    feeds: [],
  };

  const form = document.getElementById('rss-form');
  form.addEventListener('submit', (e) => handleFormSubmit(e, state));

  updateFeeds(state);
};

export default initApp;
