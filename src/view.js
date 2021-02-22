export default (state, path, elements) => {
  const { input, addButton } = elements;

  const processStateHandler = (state) => {
    const { processState, processError } = state.form;
    switch (processState) {
      case 'failed':
        //submitButton.disabled = false;
        break;
      case 'editing':
        //submitButton.disabled = false;
        break;
      case 'sending':
        addButton.disabled = true;
        break;
      case 'finished':
        //container.innerHTML = 'User Created!';
        break;
      default:
        break;
    }
  };


  switch (path) {
    case 'form.processState':
      processStateHandler(state);
      break;
    default:
      break;
  }
};