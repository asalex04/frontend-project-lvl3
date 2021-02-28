export default (link) => {
  const proxy = 'https://hexlet-allorigins.herokuapp.com';
  
  return `${proxy}/get?url=${encodeURIComponent(link)}`;
}
