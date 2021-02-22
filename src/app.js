import _ from 'lodash';
import * as yup from 'yup';
import axios from 'axios';
import view from './view.js';
import onChange from 'on-change';
import parser from './parser.js';

const proxy = 'https://hexlet-allorigins.herokuapp.com';

const validate = (data, feeds) => {
  const links = feeds.map((feed) => feed.link);
  const schema = yup
    .string()
    .url()
    .notOneOf(links, 'dupliсated link');
  try {
    schema.validateSync(data);
    return {};
  } catch (err) {
    return err.message;
  }
};

const updateValidationState = (link, watchedState) => {
  const errors= validate(link, watchedState.data.feeds)
  watchedState.form.valid = _.isEqual(errors, {});
  watchedState.form.errors = errors;
};

export default () => {
  const state = {
    form: {
      processState: 'editing',
      processError: null,
    },
    data: {
      feeds: [],
      posts: [],
    },
    valid: true,
    errors: {},
  }

  const form = document.querySelector('.rss-form');
  const elements = {
    input: document.querySelector('.form-control'),
    addButton: document.querySelector('.btn-primary'),
  };

  const watchedState = onChange (state, (path) => {
    view(state, path, elements);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const link = formData.get('url');
    updateValidationState(link, watchedState);
    watchedState.form.processState = 'sending';
  
    axios.get(`${proxy}/get?url=${encodeURIComponent(link)}`)
      .then((response) => {
        const feed = parser(response.data.contents);
        const feedId = _.uniqueId();
        state.data.feeds.push({
          id: feedId,
          title: feed.title,
          description: feed.description,
          link: link,
        });
        const newPosts = feed.posts.map((post) => ({
          ...post,
          feedId,
          postId: _.uniqueId(),
        }));
        state.data.posts.unshift(newPosts);
        console.log(state.data);
        watchedState.form.processState = 'finished';
      })
      .catch((error) => {
        watchedState.form.processError = error.message;
        watchedState.form.processState = 'failed';
        console.log(state);
      });
  });
};
