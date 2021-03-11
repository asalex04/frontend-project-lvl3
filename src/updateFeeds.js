import _ from 'lodash';
import axios from 'axios';
import proxyUrl from './utils.js';
import parser from './parser.js'

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

  Promise.all(promises).finally(() => setTimeout(updateFeeds, 5000, state));
};

export default updateFeeds;