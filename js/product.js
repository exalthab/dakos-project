const likeButton = document.getElementById('like-btn');
if (likeButton) {
  likeButton.dataset.id = product.id; // 🔥 important
  handleLikeButtonState(likeButton, product.id);

  likeButton.addEventListener('click', () => {
    toggleLikeState(likeButton, product.id);
  });
}
