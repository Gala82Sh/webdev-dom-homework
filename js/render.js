import { getComments } from './comments.js';
import { escapeHtml } from './sanitize.js';
import { handleLikeClick } from './likeHandler.js';
import { handleCommentClick } from './commentHandler.js';
import { isAuthenticated, getUser } from './auth.js';

export function renderComments() {
  const commentsList = document.querySelector('.comments');
  const comments = getComments();
  
  if (!commentsList) {
    console.error('Список комментариев не найден!');
    return;
  }
  
  commentsList.innerHTML = '';
  
  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];
    const likeButtonClass = comment.isLiked ? 'like-button -active-like' : 'like-button';
    
    const commentHtml = `
      <li class="comment" data-id="${comment.id}">
        <div class="comment-header">
          <div>${escapeHtml(comment.name)}</div>
          <div>${escapeHtml(comment.date)}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">
            ${escapeHtml(comment.text)}
          </div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${comment.likes}</span>
            <button class="${likeButtonClass}" data-id="${comment.id}"></button>
          </div>
        </div>
      </li>
    `;
    
    commentsList.insertAdjacentHTML('beforeend', commentHtml);
  }
  
  attachLikeHandlers();
  attachCommentClickHandlers();
  updateFormByAuth();
}

function attachLikeHandlers() {
  const likeButtons = document.querySelectorAll('.like-button');
  likeButtons.forEach(button => {
    button.removeEventListener('click', handleLikeClick);
    button.addEventListener('click', handleLikeClick);
  });
}

function attachCommentClickHandlers() {
  const commentElements = document.querySelectorAll('.comment');
  commentElements.forEach(commentElement => {
    commentElement.removeEventListener('click', handleCommentClick);
    commentElement.addEventListener('click', handleCommentClick);
  });
}

function updateFormByAuth() {
  const addForm = document.querySelector('.add-form');
  const authMessage = document.querySelector('.auth-message');
  const nameInput = document.querySelector('.add-form-name');
  
  if (isAuthenticated()) {
    if (addForm) addForm.style.display = 'flex';
    if (authMessage) authMessage.style.display = 'none';
    
    const user = getUser();
    if (nameInput && user && user.name) {
      nameInput.value = user.name;
      nameInput.readOnly = true;
    }
  } else {
    if (addForm) addForm.style.display = 'none';
    
    if (!authMessage) {
      const container = document.querySelector('.container');
      const message = document.createElement('div');
      message.className = 'auth-message';
      message.innerHTML = `
        <p>Чтобы добавить комментарий, <a href="#" id="login-link">авторизуйтесь</a></p>
      `;
      container.insertBefore(message, addForm);
      
      const loginLink = document.getElementById('login-link');
      if (loginLink) {
        loginLink.addEventListener('click', (event) => {
          event.preventDefault();
          import('./login.js').then(module => {
            module.renderLoginPage();
          });
        });
      }
    } else {
      authMessage.style.display = 'block';
    }
  }
}