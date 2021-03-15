import _ from 'lodash';
import i18next from 'i18next';

export default (state, path, elements) => {
  const { 
    input, addButton, feedback, titleModal, body, article, feedSection, postSection 
  } = elements;

  const renderPosts = (dataPosts) => {
    console.log(dataPosts);
    postSection.innerHTML= '';
    const title = document.createElement('h2');
    const ul = document.createElement('ul');
    title.textContent = i18next.t('posts');
    ul.className ='list-group';
    
    dataPosts.map((post) => {
      const li = document.createElement('li');
      const a = document.querySelector('a');
      li.className = 'list-group-item d-flex justify-content-between align-items-start';
      a.setAttribute('href', post.link);
      a.setAttribute('target', '_blank');
      a.className = 'font-weight-bold';
      a.textContent = post.title;
      a.dataset.id = post.id;

      li.append(a);
      ul.append(li);
      console.log(post);
    })
    postSection.append(title);
    postSection.append(ul);
    
  };

  /* const renderPosts = (dataPosts) => {
    console.log(dataPosts);
    const title = document.createElement('h2');
    title.textContent = i18next.t('posts');
    const container = _.flatten(dataPosts).map((elem) => {
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
  }; */

  const renderFeeds = (dataFeeds) => {
    feedSection.innerHTML = '';
    const h2 = document.createElement('h2');
    const ul = document.createElement('ul');
    h2.textContent = i18next.t('feeds');
    ul.classList.add('list-group', 'mb-5');
    dataFeeds.map((feed) => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      const h3 = document.createElement('h3');
      h3.textContent = feed.title;
      const p = document.createElement('p');
      p.textContent = feed.description;
      li.append(h3);
      li.append(p);
      ul.prepend(li);
    });
    feedSection.append(h2);
    feedSection.append(ul);
  }; 

  const renderErrors = (state) => {
    const { errors } = state.form;
    input.classList.add('is-invalid');
    feedback.classList.add('text-danger');
    feedback.textContent = i18next.t(`errors.${errors}`);
  };

  const renderSuccess = () => {
    feedback.classList.add('text-success');
    feedback.classList.remove('text-danger');
    feedback.textContent = i18next.t('msg.success');
    input.classList.remove('is-invalid');    
  };

  const renderModal = (state) => {
    const { title, description, link, postId } = state.modal;
    const currLink = document.querySelector(`[data-id = '${postId}']`);
    currLink.classList.remove('font-weight-bold');
    currLink.className = 'font-weight-normal';
    titleModal.textContent = title;
    body.textContent = description;
    article.href = link;
  }

  const processStateHandler = (state) => {
    const { processState } = state.form;
    switch (processState) {
      case 'failed':
        renderErrors(state);
        addButton.disabled = false;
        break;
      case 'filling':
        addButton.disabled = false;
        break;
      case 'sending':
        addButton.disabled = true;
        feedback.classList.remove('text-danger', 'text-success');
        feedback.textContent = '';
        break;
      case 'finished':
        renderSuccess();
        renderFeeds(state.data.feeds);
        renderPosts(state.data.posts);
        addButton.disabled = false;
        input.value = null;
        input.focus();
        break;
      default:
        break;
    }
  };

  switch (path) {
    case 'form.processState':
      processStateHandler(state);
      break;
    case 'form.errors':
      if (!state.form.valid) {
        renderErrors(state);
      }
      break;
    case 'modal':
      renderModal(state);
      break;
    default:
      break;
  }
};