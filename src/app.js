import _ from 'lodash';
import * as yup from 'yup';
import axios from 'axios';
import view from './view.js';

const validate = (data, feeds) => {
  const links = feeds.map((feed) => feed.link);
  const schema = yup
    .string()
    .url()
    .notOneOf(links, 'dupliсated link');
  try {
    schema.validateSync(data);
    return null;
  } catch (err) {
    return err.message;
  }
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
    error: {},

  }

  const form = document.querySelector('.rss-form');
  const elements = {
    input: document.querySelector('.form-control'),
    addButton: document.querySelector('.btn-primary')
  };

  const watchedState = view(state, elements);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const link = formData.get('url');
    console.log(link);
    const error = validate(link, watchedState.data.feeds)

  })
};
