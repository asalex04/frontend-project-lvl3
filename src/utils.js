export default (link) => {
  const proxy = 'https://hexlet-allorigins.herokuapp.com';
  
  const newUrl = new URL('/get', proxy);
  newUrl.searchParams.set('url', link);
  return newUrl.toString();
}
