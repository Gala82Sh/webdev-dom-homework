import { renderComments } from './render.js';
import { validateAndAdd } from './api.js';

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

renderComments();