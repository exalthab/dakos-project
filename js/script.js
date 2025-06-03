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
    badge.style.display = totalItems > 0 ? 'inline-block' : 'none'; // Hide if 0 items
  }
}

// ========== Add to Cart Function ========== 
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Check if the product is already in the cart
  const existingProductIndex = cart.findIndex(item => item.id === product.id);

  if (existingProductIndex !== -1) {
    // If the product exists, increase the quantity
    cart[existingProductIndex].quantity += 1;
  } else {
    // Otherwise, add the product to the cart with quantity 1
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount(); // Update the cart count in the UI
  alert(`${product.name} added to cart!`); // Alert user
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
    document.getElementById('product-desc').textContent = product.description || 'No description available';

    // Add "Add to Cart" functionality
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
      addToCartBtn.addEventListener('click', () => {
        addToCart(product);
      });
    }

    // Handle "Like" button interaction
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
