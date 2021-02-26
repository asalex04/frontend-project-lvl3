export default (state, path, elements) => {
  const { input, addButton, feedback, feedSection, postSection } = elements;

  const renderFeeds = (state, elements) => {
    const { feedSection } = elements;
    feedSection.innerHTML = '';
    const h2 = document.createElement('h2');
    const ul = document.createElement('ul');
    h2.innerText = 'Фиды';
    ul.classList.add('list-group', 'mb-5');
    state.data.feeds.map((feed) => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      const h3 = document.createElement('h3');
      h3.innerText = feed.title;
      const p = document.createElement('p');
      p.innerText = feed.description;
      li.append(h3);
      li.append(p);
      ul.prepend(li);
    });
    feedSection.append(h2);
    feedSection.append(ul);
  };

  const renderPosts = (state, elements) => {
    const { postSection } = elements;
    postSection.innerHTML = '';
    const h2 = document.createElement('h2');
    const ul = document.createElement('ul');
    h2.textContent = 'Посты';
    ul.className = 'list-group';
    state.data.posts.map((post) => {
      console.log('tets');
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
      const a = document.createElement('a');
      a.innerText = post.title;
      a.className = 'font-weight-bold';
      li.append(a);
    });
    postSection.append(h2);
    postSection.append(ul);
  };

  const renderErrors = (state) => {
    const { errors } = state.form;
    input.classList.add('is-invalid');
    feedback.classList.add('text-danger');
    if (errors === 'duplicated link') {
      feedback.textContent = 'RSS уже загружен';
    } else {
      feedback.textContent = 'Ссылка должна быть валидным URL';
    }
  };

  const renderSuccess = () => {
    feedback.classList.add('text-success');
    feedback.classList.remove('text-danger');
    feedback.textContent = 'RSS успешно загружен';
    input.classList.remove('is-invalid');    
  };

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
      if (!state.form.valid) {
        renderErrors(state);
      }
      break;
    default:
      break;
  }
};