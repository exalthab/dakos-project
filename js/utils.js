// ===== CART UTILITIES =====

// XOF currency formatter (fr-FR locale with currency code "XOF")
const xofFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'XOF',
  currencyDisplay: 'code',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Format a number as XOF currency string, e.g. "XOF 7 871,49"
 * Ensures proper spacing and replacement if needed
 * @param {number} amount
 * @returns {string}
 */
export function formatXOF(amount) {
  return xofFormatter.format(amount).replace(/^XOF/, 'XOF ');
}

/**
 * Retrieve cart array from localStorage
 * @returns {Array} Cart items
 */
export function getCart() {
  try {
    return JSON.parse(localStorage.getItem('cart')) || [];
  } catch {
    return [];
  }
}

/**
 * Save cart array to localStorage
 * @param {Array} cart
 */
export function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Update the cart count badge in the header
 */
export function updateCartCount() {
  const countEl = document.getElementById('cart-count');
  if (!countEl) return;

  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  countEl.textContent = totalItems > 0 ? totalItems : ''; // Hide badge if zero
}

/**
 * Add an item to cart or update quantity if already present
 * @param {Object} newItem - The new cart item with id, quantity, price, etc.
 */
export function addItemToCart(newItem) {
  const cart = getCart();
  const existingItem = cart.find(item => String(item.id) === String(newItem.id));

  if (existingItem) {
    existingItem.quantity += newItem.quantity;
  } else {
    cart.push({ ...newItem });
  }

  saveCart(cart);
  updateCartCount();
}

/**
 * Remove an item from cart by its ID
 * @param {number|string} itemId
 */
export function removeItemFromCart(itemId) {
  const cart = getCart().filter(item => String(item.id) !== String(itemId));
  saveCart(cart);
  updateCartCount();
}

/**
 * Update the quantity of a cart item; remove if quantity <= 0
 * @param {number|string} itemId
 * @param {number} newQuantity
 */
export function updateItemQuantity(itemId, newQuantity) {
  if (newQuantity <= 0) {
    removeItemFromCart(itemId);
    return;
  }

  const cart = getCart();
  const item = cart.find(i => String(i.id) === String(itemId));

  if (item) {
    item.quantity = newQuantity;
    saveCart(cart);
    updateCartCount();
  }
}

/**
 * Calculate the total price of all items in the cart
 * @returns {number} Total price
 */
export function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

/**
 * Get the formatted total price as XOF currency string
 * @returns {string}
 */
export function getFormattedCartTotal() {
  return formatXOF(getCartTotal());
}
