import _ from 'lodash';
import * as yup from 'yup';
import axios from 'axios';

const validate = (link, feeds) => {
  const links = feeds.map((feed) => feed.link);
  const schema = yup
    .string()
    .url()
    .notOneOf(links, 'dupliсated link');
  try {
    schema.validateSync(link);
    return null;
  } catch (err) {
    return err.message;
  }
};
