import { fetchCommentsFromApi } from './api.js';
import { validateAndAdd } from './api.js';
import { renderComments } from './render.js';

const nameInput = document.querySelector('.add-form-name');
const commentInput = document.querySelector('.add-form-text');
const addButton = document.querySelector('.add-form-button');

addButton.addEventListener('click', () => {
  validateAndAdd(nameInput, commentInput);
});

commentInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    validateAndAdd(nameInput, commentInput);
  }
});


async function init() {
 const commentsList = document.querySelector('.comments');
  if (commentsList) {
    commentsList.innerHTML = '<li>Загрузка комментариев...</li>';
  }
  
  await fetchCommentsFromApi();
}

init();