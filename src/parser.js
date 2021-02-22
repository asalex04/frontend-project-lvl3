const getContent = (node, name) => (node.querySelector(name).textContent);

export default (data) => {
  const domparser = new DOMParser();
  const doc = domparser.parseFromString(data, 'text/xml');
  const error = doc.querySelector('parsererror');
  if (error) {
    throw new Error(error.textContent);
  }
  const items = Array.from(doc.querySelectorAll('item'));
  const posts = items.map((elem) => ({
    title: getContent(elem, 'title'),
    link: getContent(elem, 'link'),
    description: getContent(elem, 'description'),
  }));

  const feed = {
    title: getContent(doc, 'title'),
    description: getContent(doc, 'description'),
    posts,
  };
  return feed;
};
