// Check if the product is already liked on page load
if (localStorage.getItem('liked') === 'true') {
  likeButton.classList.add('liked');
  const icon = likeButton.querySelector('i');
  icon.classList.remove('fa-heart');
  icon.classList.add('fa-heart-filled');
}

// Save the liked state to localStorage
likeButton.addEventListener('click', function() {
  likeButton.classList.toggle('liked');
  const icon = likeButton.querySelector('i');
  if (likeButton.classList.contains('liked')) {
    icon.classList.remove('fa-heart');
    icon.classList.add('fa-heart-filled');
    localStorage.setItem('liked', 'true'); // Save to localStorage
  } else {
    icon.classList.remove('fa-heart-filled');
    icon.classList.add('fa-heart');
    localStorage.setItem('liked', 'false'); // Save to localStorage
  }
});
