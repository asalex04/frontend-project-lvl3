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
    .notOneOf(links, 'notNewUrl');
  return schema.validateSync(data);  
};

const updateValidationState = (link, watchedState) => {
  const errors = validate(link, watchedState.data.feeds)
  watchedState.form.valid = _.isEqual(errors, {});
  watchedState.form.errors = errors;
};

export default () => {
  const state = {
    form: {
      processState: 'filling',
      processError: null,
      valid: true,
      errors: {},
    },
    data: {
      feeds: [],
      posts: [],
    },
  };
  yup.setLocale({
    string: {
      url: 'notUrl',
    },
    mixed: {
      required: 'requierd',
    }
  });
  const form = document.querySelector('.rss-form');
  const elements = {
    input: document.querySelector('.form-control'),
    addButton: document.querySelector('.btn-primary'),
    feedback: document.querySelector('.feedback'),
    feedSection: document.querySelector('.feeds'),
    postSection: document.querySelector('.posts'),
  };
  
  const watchedState = onChange (state, (path) => {
    view(state, path, elements);
  });
  
  updateFeeds(watchedState);
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const link = formData.get('url');
    try {
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
          watchedState.form.processState = 'finished';
          watchedState.form.processError = null;
        });
      } catch (error) {
        watchedState.form.errors = error.message;
        watchedState.form.processState = 'failed';
      }
  });
};
