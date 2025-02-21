import 'bootstrap/dist/css/bootstrap.min.css';

document.getElementById('rss-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const rssUrl = document.getElementById('rss-url').value;
  console.log('RSS URL:', rssUrl);
  // Здесь будет логика добавления RSS-потока
});
