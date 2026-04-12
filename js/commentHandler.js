import { comments } from './comments.js';

export function handleCommentClick(event) {
  const commentElement = event.currentTarget;
  const commentId = parseInt(commentElement.getAttribute('data-id'));
  
  const comment = comments.find(c => c.id === commentId);
  
  if (comment) {
    const commentInput = document.querySelector('.add-form-text');
    commentInput.value = `> ${comment.text}\n\n`;
    commentInput.focus();
  }
}