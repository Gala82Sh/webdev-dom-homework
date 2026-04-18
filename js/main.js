import { fetchCommentsFromApi } from './api.js';
import { validateAndAdd } from './api.js';
import { isAuthenticated, getUser } from './auth.js';
import { renderLoginPage } from './login.js';

const nameInput = document.querySelector('.add-form-name');
const commentInput = document.querySelector('.add-form-text');
const addButton = document.querySelector('.add-form-button');

if (addButton) {
  addButton.addEventListener('click', () => {
    if (isAuthenticated()) {
      validateAndAdd(nameInput, commentInput);
    } else {
      renderLoginPage();
    }
  });
}

if (commentInput) {
  commentInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (isAuthenticated()) {
        validateAndAdd(nameInput, commentInput);
      } else {
        renderLoginPage();
      }
    }
  });
}

if (isAuthenticated() && nameInput) {
  const user = getUser();
  if (user && user.name) {
    nameInput.value = user.name;
    nameInput.readOnly = true;
  }
}

async function init() {
  await fetchCommentsFromApi();
}

init();
