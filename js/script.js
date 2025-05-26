// ========== Currency Formatter ==========
const xofFormatter = new Intl.NumberFormat('fr-FR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

function formatXOF(amount) {
  return `XOF ${xofFormatter.format(amount)}`;
}

// ========== Update Cart Count Badge ==========
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const badge = document.getElementById('cart-count');
  if (badge) {
    badge.textContent = totalItems;
  }
}

// ========== Load Product Detail Page ==========
async function loadProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);

  if (isNaN(id)) {
    console.error('Invalid product ID in URL');
    return;
  }

  try {
    const response = await fetch('data/product.json');
    if (!response.ok) {
      throw new Error('Failed to load product data');
    }

    const products = await response.json();
    const product = products.find(p => p.id === id);

    if (!product) {
      console.warn('Product not found for ID:', id);
      return;
    }

    // Populate DOM with product info
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-img').src = product.image;
    document.getElementById('product-img').alt = product.name;
    document.getElementById('product-price').textContent = formatXOF(product.price);
    document.getElementById('product-desc').textContent = product.description;

    document.getElementById('like-btn')?.addEventListener('click', () => {
      alert(`You liked ${product.name}!`);
    });

  } catch (error) {
    console.error('Error loading product detail:', error);
  }
}

// ========== Init on Page Load ==========
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  // Only load product data on product.html page
  if (window.location.pathname.includes('product.html')) {
    loadProductDetail();
  }
});
