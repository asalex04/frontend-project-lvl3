export default (data) => {
  const domparser = new DOMParser();
  const doc = domparser.parseFromString(data, 'text/xml');
  const error = doc.querySelector('parsererror');
  if (error) {
    throw new Error(error.textContent);
  }
  const arrItems = Array.from(doc.querySelectorAll('item'));
  const items = arrItems.map((elem) => ({
    title: elem.querySelector('title').textContent,
    link: elem.querySelector('link').textContent,
    description: elem.querySelector('description').textContent,
  }));

  const feed = {
    title: doc.querySelector('title').textContent,
    description: doc.querySelector('description').textContent,
    items,
  };
  return feed;
};
