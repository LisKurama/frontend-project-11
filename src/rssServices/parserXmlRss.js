const parseRSS = (xml) => {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
  
    const parserError = xmlDoc.getElementsByTagName('parsererror');
    if (parserError.length > 0) {
      const error = new Error('Ошибка при парсинге XML');
      error.isParsingError = true;
      throw error;
    }
  
    const channelTitle = xmlDoc.getElementsByTagName('title')[0]?.textContent;
    const channelDescription = xmlDoc.getElementsByTagName('description')[0]?.textContent;
  
    const posts = xmlDoc.getElementsByTagName('item');
    const result = [];
  
    Array.from(posts).forEach((el) => {
      const title = el.getElementsByTagName('title')[0]?.textContent;
      const link = el.getElementsByTagName('link')[0]?.textContent;
      const description = el.getElementsByTagName('description')[0]?.textContent;
      const date = el.getElementsByTagName('pubDate')[0]?.textContent;
      result.push({
        title, link, description, date,
      });
    });
  
    return {
      channel: {
        title: channelTitle,
        description: channelDescription,
      },
      posts: result,
    };
  };
  
  export default parseRSS;
  