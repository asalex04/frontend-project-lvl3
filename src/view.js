import onChange from 'on-change';

export default (state) => {
  onChange(state, (path, value) => {
    console.log('view');
  });
};