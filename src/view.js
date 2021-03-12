import i18next from 'i18next';
import renderPosts from './renderPosts.js';

export default (state, path, elements) => {
  const { input, addButton, feedback, titleModal, body, article } = elements;

  const renderFeeds = (state, elements) => {
    const { feedSection } = elements;
    feedSection.innerHTML = '';
    const h2 = document.createElement('h2');
    const ul = document.createElement('ul');
    h2.textContent = i18next.t('feeds');
    ul.classList.add('list-group', 'mb-5');
    state.data.feeds.map((feed) => {
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
        renderFeeds(state, elements);
        renderPosts(state, elements);
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
        renderErrors(state);
      break;
    case 'modal':
      renderModal(state);
      break;
    default:
      break;
  }
};