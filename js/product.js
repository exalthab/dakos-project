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
    if (!response.ok) {
      throw new Error('Échec de la récupération des produits');
    }
    products = await response.json();
    if (window.location.pathname === '/product.html') {
      displayProductDetail(products);
    } else {
      displayProducts(products); // For the homepage
    }
  } catch (error) {
    console.error('Failed to load products:', error);
    alert('Impossible de charger les produits, veuillez réessayer plus tard.');
  }
}

// Display product details (for product page)
function displayProductDetail(list) {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id'), 10);

  const product = list.find(p => p.id === productId);
  if (!product) return;

  // Populate product details on the page
  document.getElementById('product-title').textContent = product.name;
  document.getElementById('product-price').textContent = formatXOF(product.price);
  document.getElementById('product-img').src = product.image;
  document.getElementById('product-desc').textContent = product.description || 'No description available';

  // Handle the like button state
  const likeButton = document.getElementById('like-btn');
  handleLikeButtonState(likeButton, product.id);

  // Handle "Add to Cart" button
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const priceText = document.getElementById('product-price').textContent || '';
      const price = parseFloat(priceText.replace(/[^\d.,-]/g, '').replace(',', '.')) || 0;

      const productToAdd = {
        title: product.name,
        price,
        img: product.image,
        quantity: 1
      };

      addToCart(null, true, productToAdd);  // Add to cart from product page
      alert("Produit ajouté au panier !");
    });
  }

  // Attach events to the like button
  if (likeButton) {
    likeButton.addEventListener('click', () => {
      toggleLikeState(likeButton, product.id);
    });
  }
}

// Display products list (for homepage or category page)
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
        <a href="product.html?id=${product.id}" class="btn btn-outline-primary mb-2">Voir les détails</a>
        <button class="btn btn-primary mt-auto add-to-cart" data-id="${product.id}">Ajouter au panier</button>
        <button class="btn btn-outline-danger mt-2 like-btn" data-id="${product.id}">
          <i class="fas fa-heart"></i>
          <span class="liked-text" style="display:none;">Liked</span>
        </button>
      </div>
    `;

    col.appendChild(card);
    productList.appendChild(col);

    // Handle the like button state for this product
    const likeButton = card.querySelector('.like-btn');
    handleLikeButtonState(likeButton, product.id);
  });

  attachAddToCartEvents();
  attachLikeButtonEvents();
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

// Attach events to the like buttons
function attachLikeButtonEvents() {
  document.querySelectorAll('.like-btn').forEach(likeButton => {
    likeButton.addEventListener('click', function() {
      const productId = parseInt(likeButton.dataset.id);
      if (!isNaN(productId)) {
        toggleLikeState(likeButton, productId);
      }
    });
  });
}

// Handle like button state based on localStorage or previous state
function handleLikeButtonState(likeButton, productId) {
  const likedState = localStorage.getItem(`liked-${productId}`);
  const likedText = likeButton.querySelector('.liked-text');
  const icon = likeButton.querySelector('i');

  if (likedState === 'true') {
    likeButton.classList.add('liked');
    icon.classList.remove('fa-heart');
    icon.classList.add('fa-heart-filled');
    likedText.style.display = 'inline';  // Show 'Liked' text
  } else {
    likeButton.classList.remove('liked');
    icon.classList.remove('fa-heart-filled');
    icon.classList.add('fa-heart');
    likedText.style.display = 'none';  // Hide 'Liked' text
  }
}

// Toggle the liked state and update localStorage
function toggleLikeState(likeButton, productId) {
  likeButton.classList.toggle('liked');
  const icon = likeButton.querySelector('i');
  const likedText = likeButton.querySelector('.liked-text');

  if (likeButton.classList.contains('liked')) {
    icon.classList.remove('fa-heart');
    icon.classList.add('fa-heart-filled');
    likedText.style.display = 'inline';  // Show 'Liked' text
    localStorage.setItem(`liked-${productId}`, 'true'); // Save to localStorage
  } else {
    icon.classList.remove('fa-heart-filled');
    icon.classList.add('fa-heart');
    likedText.style.display = 'none';  // Hide 'Liked' text
    localStorage.setItem(`liked-${productId}`, 'false'); // Save to localStorage
  }
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

  const existing = cart.find(item => item.id === product.id || item.title === product.title);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name || product.title,
      price: parseFloat(product.price.replace(/[^\d.-]/g, '')) || product.price,
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

// Unified DOMContentLoaded initializer
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  updateCartCount();
});
