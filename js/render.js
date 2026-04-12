import { getComments } from './comments.js';
import { escapeHtml } from './sanitize.js';
import { handleLikeClick } from './likeHandler.js';
import { handleCommentClick } from './commentHandler.js';

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