let comments = [];

export function getComments() {
  return comments;
}

export function setComments(newComments) {
  comments = newComments;
}

export function updateLikeLocally(commentId, isLiked, likes) {
  const comment = comments.find(c => c.id === commentId);
  if (comment) {
    comment.isLiked = isLiked;
    comment.likes = likes;
  }
}