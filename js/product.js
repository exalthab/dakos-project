let products = [];

// Custom XOF Currency Formatter (XOF 7 871,49 format)
const xofFormatter = new Intl.NumberFormat('fr-FR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

function formatXOF(amount) {
  return 'XOF ' + xofFormatter.format(amount);
}

// Load products from JSON and display them
async function loadProducts() {
  try {
    const response = await fetch('data/product.json');
    products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error('Failed to load products:', error);
  }
}

// Display a list of products
function displayProducts(list) {
  const productList = document.getElementById('product-list');
  if (!productList) return;

  productList.innerHTML = '';

  list.forEach(product => {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-md-4 col-lg-3';

    const card = document.createElement('div');
    card.className = 'card h-100';

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="card-img-top">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${product.name}</h5>
        <p class="card-text">${formatXOF(product.price)}</p>
        <a href="product.html?id=${product.id}" class="btn btn-outline-primary mb-2">View Details</a>
        <button class="btn btn-primary mt-auto add-to-cart" data-id="${product.id}">Add to Cart</button>
      </div>
    `;

    col.appendChild(card);
    productList.appendChild(col);
  });

  attachAddToCartEvents();
}

// Attach click events to "Add to Cart" buttons
function attachAddToCartEvents() {
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const productId = parseInt(button.dataset.id);
      if (!isNaN(productId)) addToCart(productId);
    });
  });
}

// Filter products by category
function filterProducts(category) {
  const filtered = category === 'all'
    ? products
    : products.filter(p => p.category === category);
  displayProducts(filtered);
}

// Add a product to the cart
function addToCart(id, fromDetails = false, detailsProduct = null) {
  let cart = getCart();
  let product;

  if (fromDetails && detailsProduct) {
    product = detailsProduct;
  } else {
    product = products.find(p => p.id === id);
    if (!product) return;
  }

  const existing = cart.find(item => item.id === (product.id || null) || item.title === product.title);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id || null,
      name: product.name || product.title,
      price: typeof product.price === 'string' ? parseFloat(product.price.replace(/[^\d.-]/g, '')) : product.price,
      image: product.image || product.img,
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartCount();
}

// Get cart from localStorage
function getCart() {
  try {
    return JSON.parse(localStorage.getItem('cart')) || [];
  } catch {
    return [];
  }
}

// Save cart to localStorage
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Update the cart item counter in the header
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  const badge = document.getElementById('cart-count');
  if (badge) badge.textContent = count;
}

// Show a summary of the cart in a modal or preview
function updateCartSummary() {
  const cart = getCart();
  const summaryEl = document.getElementById('cart-summary');
  const totalEl = document.getElementById('cart-total');

  if (!summaryEl || !totalEl) return;

  if (cart.length === 0) {
    summaryEl.innerHTML = '<p>Your cart is empty.</p>';
    totalEl.textContent = formatXOF(0);
    return;
  }

  let total = 0;
  summaryEl.innerHTML = '';

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    summaryEl.innerHTML += `
      <div class="d-flex justify-content-between mb-2">
        <span>${item.name} x${item.quantity}</span>
        <span>${formatXOF(itemTotal)}</span>
      </div>
    `;
  });

  totalEl.textContent = formatXOF(total);
}

// Unified DOMContentLoaded initializer
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  updateCartCount();

  const filter = document.getElementById('category-filter');
  if (filter) {
    filter.addEventListener('change', e => filterProducts(e.target.value));
  }

  // If on product detail page, setup add-to-cart
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const title = document.getElementById('product-title')?.textContent || '';
      const priceText = document.getElementById('product-price')?.textContent || '';
      const img = document.getElementById('product-img')?.src || '';

      const price = parseFloat(priceText.replace(/[^\d.,-]/g, '').replace(',', '.'));

      const product = {
        title,
        price,
        img,
        quantity: 1
      };

      addToCart(null, true, product);
      alert("Produit ajouté au panier !");
    });
  }

  // Mini cart modal preview
  const cartIcon = document.querySelector('[href="cart.html"]');
  if (cartIcon && document.getElementById('cartModal')) {
    cartIcon.addEventListener('click', e => {
      e.preventDefault();
      updateCartSummary();
      const modal = new bootstrap.Modal(document.getElementById('cartModal'));
      modal.show();
    });
  }
});
