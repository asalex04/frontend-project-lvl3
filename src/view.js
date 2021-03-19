export default (state, path, elements, i18Instance) => {
  const {
    input, addButton, feedback, titleModal, body, article, feedSection, postSection,
  } = elements;

  const renderPosts = (dataPosts) => {
    postSection.innerHTML = '';
    const title = document.createElement('h2');
    title.textContent = i18Instance.t('posts');

    const ul = document.createElement('ul');
    ul.className = 'list-group';

    dataPosts.forEach((post) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');

      const link = document.createElement('a');
      link.setAttribute('href', post.link);
      link.setAttribute('target', '_blank');
      link.className = 'font-weight-bold';
      link.textContent = post.title;
      link.dataset.id = post.postId;

      const btn = document.createElement('button');
      btn.classList.add('btn', 'btn-primary', 'btn-sm');
      btn.textContent = i18Instance.t('button');
      btn.setAttribute('type', 'button');
      btn.dataset.id = post.postId;
      btn.dataset.toggle = 'modal';
      btn.dataset.target = '#modal';

      li.append(link);
      li.append(btn);
      ul.append(li);
    });
    postSection.append(title);
    postSection.append(ul);
  };

  const renderFeeds = (dataFeeds) => {
    feedSection.innerHTML = '';
    const h2 = document.createElement('h2');
    const ul = document.createElement('ul');
    h2.textContent = i18Instance.t('feeds');
    ul.classList.add('list-group', 'mb-5');
    dataFeeds.forEach((feed) => {
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

  const renderErrors = (errors) => {
    input.classList.add('is-invalid');
    input.removeAttribute('readonly');
    feedback.classList.add('text-danger');
    feedback.textContent = i18Instance.t(`errors.${errors}`);
  };

  const renderValid = (formValid) => {
    const { valid, error } = formValid;
    if (!valid && error) {
      renderErrors(error);
    } else {
      input.classList.remove('is-invalid');
      feedback.classList.remove('text-danger');
    }
  };

  const renderSuccess = () => {
    feedback.classList.add('text-success');
    feedback.classList.remove('text-danger');
    feedback.textContent = i18Instance.t('msg.success');
    input.classList.remove('is-invalid');
  };

  const renderModal = (stateModal) => {
    const {
      title, description, link, postId,
    } = stateModal.modal;
    const currLink = document.querySelector(`[data-id = '${postId}']`);
    currLink.classList.remove('font-weight-bold');
    currLink.className = 'font-weight-normal';
    titleModal.textContent = title;
    body.textContent = description;
    article.href = link;
  };

  const processStateHandler = (stateHandler) => {
    const { processState } = stateHandler.form;
    switch (processState) {
      case 'failed':
        renderErrors(stateHandler.form.errors);
        addButton.removeAttribute('disabled');
        input.removeAttribute('readonly');
        break;
      case 'sending':
        addButton.setAttribute('disabled', true);
        input.setAttribute('readonly', true);
        input.classList.remove('is-invalid');
        feedback.classList.remove('text-danger', 'text-success');
        feedback.textContent = '';
        break;
      case 'finished':
        renderSuccess();
        renderFeeds(stateHandler.data.feeds);
        renderPosts(stateHandler.data.posts);
        addButton.removeAttribute('disabled');
        input.removeAttribute('readonly');
        input.classList.remove('is-invalid');
        input.value = null;
        input.focus();
        break;
      default:
        throw Error(`Unknown form status: ${processState}`);
    }
  };

  switch (path) {
    case 'form.processState':
      processStateHandler(state);
      break;
    case 'form.errors':
      if (state.form.errors) {
        renderErrors(state.form.errors);
      }
      break;
    case 'form.valid':
      renderValid(state.form);
      break;
    case 'data.posts':
      renderPosts(state.data.posts);
      break;
    case 'modal':
      renderModal(state);
      break;
    default:
      throw Error(`Unknown form status: ${path}`);
  }
};
