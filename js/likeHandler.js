import { getComments, updateLikeLocally } from './comments.js';
import { renderComments } from './render.js';

function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}

export function handleLikeClick(event) {
  event.stopPropagation();
  
  const button = event.currentTarget;
  const commentId = parseInt(button.getAttribute('data-id'));
  
 
  button.classList.add('-loading-like');
  
  const comments = getComments();
  const comment = comments.find(c => c.id === commentId);
  
  if (comment) {
    delay(500).then(() => {
      if (comment.isLiked) {
        comment.isLiked = false;
        comment.likes = comment.likes - 1;
      } else {
        comment.isLiked = true;
        comment.likes = comment.likes + 1;
      }
      
      updateLikeLocally(commentId, comment.isLiked, comment.likes);
      renderComments();
      
      const newButton = document.querySelector(`.like-button[data-id="${commentId}"]`);
      if (newButton) {
        setTimeout(() => {
          newButton.classList.remove('-loading-like');
        }, 100);
      }
    });
  }
}
