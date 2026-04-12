import { getComments, updateLikeLocally } from './comments.js';
import { renderComments } from './render.js';

export function handleLikeClick(event) {
  event.stopPropagation();
  
  const button = event.currentTarget;
  const commentId = parseInt(button.getAttribute('data-id'));
  
  const comments = getComments();
  const comment = comments.find(c => c.id === commentId);
  
  if (comment) {
    let newIsLiked;
    let newLikes;
    
    if (comment.isLiked) {
      newIsLiked = false;
      newLikes = comment.likes - 1;
    } else {
      newIsLiked = true;
      newLikes = comment.likes + 1;
    }
    
    updateLikeLocally(commentId, newIsLiked, newLikes);
    renderComments();
  }
}