import i18next from 'i18next';
import _ from 'lodash';

export default (state, elements) => {
  const { postSection } = elements;
  const { posts } = state.data;
  const title = document.createElement('h2');
  title.textContent = i18next.t('posts');
  const container = _.flatten(posts).map((elem) => {
    const post = `
      <ul class='list-group'>
        <li class='list-group-item d-flex justify-content-between align-items-start'>
          <a href='${elem.link}' class='font-weight-bold' data-id='${elem.postId}' target='_blank'>${elem.title}</a>
          <button type='button' class='btn btn-primary btn-sm' data-id=${elem.postId} data-toggle='modal' data-target='#modal'>Просмотр</button>
        </li>
      </ul>
      `;
    return post;
  }).join('');
  
  postSection.innerHTML = container;
  postSection.prepend(title);
};