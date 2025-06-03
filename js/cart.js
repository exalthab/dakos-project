// Formate le prix en XOF sans décimales
function formatPrice(amount) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Met à jour le badge du panier (nombre total d'articles)
function updateCartCount(cart = null) {
  if (!cart) {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
  }
  const count = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const cartCountElem = document.getElementById('cart-count');
  if (cartCountElem) {
    cartCountElem.textContent = count;
    cartCountElem.style.display = count > 0 ? 'inline-block' : 'none';
  }
}

// Affiche les articles dans le panier
function renderCartItems() {
  const cartItemsElem = document.getElementById('cart-items');
  const totalPriceElem = document.getElementById('total-price');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Si le panier est vide
  if (cart.length === 0) {
    cartItemsElem.innerHTML = '<p class="text-muted">Your cart is empty.</p>';
    totalPriceElem.textContent = formatPrice(0);
    updateCartCount([]);
    return;
  }

  let total = 0;
  let html = '<div class="list-group">';

  // Parcours des articles du panier
  cart.forEach((item, index) => {
    const quantity = item.quantity || 1;
    const itemTotal = item.price * quantity;
    total += itemTotal;

    html += `
      <div class="list-group-item d-flex justify-content-between align-items-center">
        <div>
          <h5 class="mb-1">${item.name}</h5>
          <small>Price: ${formatPrice(item.price)} &times; ${quantity}</small>
        </div>
        <div>
          <strong>${formatPrice(itemTotal)}</strong>
          <button class="btn btn-sm btn-danger ms-3 remove-btn" data-index="${index}" aria-label="Remove ${item.name}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  });

  html += '</div>';
  cartItemsElem.innerHTML = html;
  totalPriceElem.textContent = formatPrice(total);
  updateCartCount(cart);

  // Ajout des listeners sur les boutons Remove
  document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', () => {
      const idx = parseInt(button.getAttribute('data-index'), 10);
      cart.splice(idx, 1); // Suppression de l'élément du panier
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCartItems(); // Ré-render les articles du panier
    });
  });
}

// Initialisation au chargement
document.addEventListener('DOMContentLoaded', () => {
  renderCartItems();
});
