const parseRss = (data) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'application/xml');
    const errorNode = doc.querySelector('parsererror');
    if (errorNode) {
      throw new Error('Ресурс не содержит валидный RSS');
    }
  
    const title = doc.querySelector('title').textContent;
    const description = doc.querySelector('description').textContent;
    const items = Array.from(doc.querySelectorAll('item')).map((item) => ({
      title: item.querySelector('title').textContent,
      link: item.querySelector('link').textContent,
    }));
  
    return { title, description, items };
  };
  
  export default parseRss;
