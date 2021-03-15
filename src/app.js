import _ from 'lodash';
import * as yup from 'yup';
import axios from 'axios';
import onChange from 'on-change';
import view from './view.js';
import parser from './parser.js'

const period = 5000;
const proxy = 'https://hexlet-allorigins.herokuapp.com';

const proxyUrl = (link) => {
  const newUrl = new URL('/get', proxy);
  newUrl.searchParams.set('url', link);
  return newUrl.toString();
}

const updateFeeds = (state) => {
  const { feeds, posts } = state.data;
  const promises = feeds.map((feed) => {
    axios.get(proxyUrl(feed.link))
    .then((response) => {
      const newPosts = parser(response.data.contents).posts;
      const diffPosts = _.differenceWith(posts, newPosts, _.isEqual);
      posts.push({
        ...diffPosts,
        feedId: feed.id,
        postId: _.uniqueId(),
      });
    })
    .catch((error) => {
      console.log(error);
    });
  });
  Promise.all(promises).finally(() => setTimeout(updateFeeds, period, state));
};

yup.setLocale({
    string: {
      url: 'notUrl',
    },
    mixed: {
      required: 'requierd',
    }
  });
const schema = yup.string().url().required();

const validate = (data, watchedState) => {
  const { feeds } = watchedState.data;
  const links = feeds.map((feed) => feed.link);
  try {
    schema.notOneOf(links, 'notNewUrl').validateSync(data);
    return null;
  } catch (e) {
    return e.message;
  }
};

export default () => {
  const state = {
    form: {
      processState: 'filling',
      valid: true,
      errors: {},
    },
    data: {
      feeds: [],
      posts: [],
    },
    modal: null,
    readPosts: [],
  };
 
  const form = document.querySelector('.rss-form');
  const elements = {
    input: document.querySelector('.form-control'),
    addButton: document.querySelector('.btn-primary'),
    feedback: document.querySelector('.feedback'),
    feedSection: document.querySelector('.feeds'),
    postSection: document.querySelector('.posts'),
    titleModal: document.querySelector('.modal-title'),
    body: document.querySelector('.modal-body'),
    article: document.querySelector('.full-article'),
  };
  
  const watchedState = onChange (state, (path) => {
    view(state, path, elements);
  });
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const link = formData.get('url');
    const error = validate(link, watchedState);
    watchedState.form.valid = _.isEqual(error, null);
    watchedState.form.errors = error;
    if (!state.form.valid) return;
    
    watchedState.form.processState = 'sending';

    axios.get(proxyUrl(link))
      .then((response) => {
        const feed = parser(response.data.contents);
        const feedId = _.uniqueId();
        state.data.feeds.push({
          id: feedId,
          title: feed.title,
          description: feed.description,
          link: link,
        });
        const newPosts = feed.items.map((post) => ({
          ...post,
          feedId,
          postId: _.uniqueId(),
        }));
        state.data.posts.unshift(newPosts);
        watchedState.form.processState = 'finished';
      })
      .catch((error) => {
        watchedState.form.valid = false;
        if (error.message === 'Network Error') {
          watchedState.form.errors = 'requestError';
        } else {
          watchedState.form.errors = 'error';
        }
      });
  });

  elements.postSection.addEventListener('click', (e) => {
    const { id } = e.target.dataset;
    const currentPost = watchedState.data.posts[0].find((post) => post.postId === id);
    watchedState.modal = currentPost;
    watchedState.readPosts.push(id);
  })
  
  updateFeeds(watchedState);
};
