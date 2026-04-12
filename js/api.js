import { sanitizeHtml } from './sanitize.js';
import { comments } from './comments.js';
import { renderComments } from './render.js';

export function getCurrentDateTime() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

export function addNewComment(name, text) {
  const newComment = {
    id: Date.now(),
    name: sanitizeHtml(name),
    text: sanitizeHtml(text),
    date: getCurrentDateTime(),
    likes: 0,
    isLiked: false
  };
  comments.push(newComment);
  renderComments();
}

export function validateAndAdd(nameInput, commentInput) {
  const name = nameInput.value.trim();
  const comment = commentInput.value.trim();
  
  if (name === '') {
    alert('Пожалуйста, введите ваше имя');
    return false;
  }
  if (comment === '') {
    alert('Пожалуйста, введите текст комментария');
    return false;
  }
  
  addNewComment(name, comment);
  nameInput.value = '';
  commentInput.value = '';
  return true;
}