import _ from 'lodash';
import * as yup from 'yup';
import axios from 'axios';
import 'bootstrap';
import onChange from 'on-change';
import i18next from 'i18next';
import ru from './locales/ru';
import view from './view.js';
import parser from './parser.js'

const period = 5000;
const proxy = 'https://hexlet-allorigins.herokuapp.com';

const proxyUrl = (link) => {
  const newUrl = new URL('/get', proxy);
  newUrl.searchParams.set('url', link);
  newUrl.searchParams.set('disableCache', 'true');
  return newUrl.toString();
}

const updateFeeds = (state) => {
  const { feeds, posts } = state.data;
  const savedPosts = posts.map((post) => (_.omit(post, ['id', 'feedId'])));
  const promises = feeds.map((feed) => {
    axios.get(proxyUrl(feed.link))
    .then((response) => {
      const newPosts = parser(response.data.contents).items;
      const diffPosts = _.differenceWith(savedPosts, newPosts, (a, b) => a.title === b.title);
      if (diffPosts.length !== 0) {
        posts.push({
          ...diffPosts,
          feedId: feed.id,
          postId: _.uniqueId(),
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
  });

  Promise.all(promises).finally(() => setTimeout(updateFeeds, period, state));
};

const validate = (data, watchedState, schema) => {
  const { feeds } = watchedState.data;
  const links = feeds.map((feed) => feed.link);
  try {
    schema.notOneOf(links, 'notNewUrl').validateSync(data);
    return null;
  } catch (e) {
    console.log(e.message);
    return e.message;
  }
};

export default () => {
  const i18Instance = i18next.createInstance();
  return i18Instance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  }) 
  .then(() => {
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
      readPostsId: [],
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
      view(state, path, elements, i18Instance);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const link = formData.get('url');
      const error = validate(link, watchedState, schema);
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
          state.data.posts.unshift(...newPosts);
          watchedState.form.processState = 'finished';
        })
        .catch((error) => {
          watchedState.form.valid = false;
          if (error.isAxiosError) {
            watchedState.form.errors = 'requestError';
          } else {
            watchedState.form.errors = 'error';
          }
        });
    });
  
    elements.postSection.addEventListener('click', (e) => {
      const { id } = e.target.dataset;
      const currentPost = state.data.posts.find((post) => post.postId === id);
      state.readPostsId.push(id);
      watchedState.modal = currentPost;
    })

    updateFeeds(watchedState);
  })};
