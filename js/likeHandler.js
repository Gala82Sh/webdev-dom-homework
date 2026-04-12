import { comments } from './comments.js';
import { renderComments } from './render.js';

export function handleLikeClick(event) {
  event.stopPropagation();
  
  const button = event.currentTarget;
  const commentId = parseInt(button.getAttribute('data-id'));
  
  const comment = comments.find(c => c.id === commentId);
  
  if (comment) {
    if (comment.isLiked) {
      comment.isLiked = false;
      comment.likes -= 1;
    } else {
      comment.isLiked = true;
      comment.likes += 1;
    }
    renderComments();
  }
}