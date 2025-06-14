let products = [];

// Format XOF
const xofFormatter = new Intl.NumberFormat('fr-FR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

function formatXOF(amount) {
  return 'XOF ' + xofFormatter.format(amount);
}

// Charger les produits depuis le fichier JSON
async function loadProducts() {
  try {
    const response = await fetch('data/product.json');
    if (!response.ok) throw new Error('Erreur de chargement des produits');
    
    products = await response.json();

    if (window.location.pathname.includes('product.html')) {
      displayProductDetail(products);
    } else {
      displayProducts(products);
    }
  } catch (error) {
    console.error(error);
    alert('Impossible de charger les produits.');
  }
}

// Afficher tous les produits (page d'accueil)
function displayProducts(list) {
  const productList = document.getElementById('product-list');
  if (!productList) return;

  productList.innerHTML = '';

  list.forEach(product => {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-md-4 col-lg-3';

    col.innerHTML = `
      <div class="card h-100">
        <img src="${product.image}" class="card-img-top" alt="${product.name}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">${formatXOF(product.price)}</p>
          <a href="product.html?id=${product.id}" class="btn btn-outline-primary mb-2">Voir les détails</a>
          <button class="btn btn-primary mt-auto add-to-cart" data-id="${product.id}">Ajouter au panier</button>
          <button class="btn btn-outline-danger mt-2 like-btn" data-id="${product.id}">
            <i class="fa-regular fa-heart"></i>
            <span class="liked-text" style="display: none;">Liked</span>
          </button>
        </div>
      </div>
    `;

    productList.appendChild(col);

    const likeButton = col.querySelector('.like-btn');
    handleLikeButtonState(likeButton, product.id);
  });

  attachAddToCartEvents();
  attachLikeButtonEvents();
}

// Affichage produit (product.html?id=...)
function displayProductDetail(list) {
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get('id'), 10);
  const product = list.find(p => p.id === productId);
  if (!product) return;

  document.getElementById('product-title').textContent = product.name;
  document.getElementById('product-price').textContent = formatXOF(product.price);
  document.getElementById('product-img').src = product.image;
  document.getElementById('product-desc').textContent = product.description || 'Pas de description';

  // Like button
  const likeButton = document.getElementById('like-btn');
  handleLikeButtonState(likeButton, product.id);
  if (likeButton) {
    likeButton.addEventListener('click', () => toggleLikeState(likeButton, product.id));
  }

  // Add to cart
  const addToCartBtn = document.getElementById('add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const productToAdd = {
        id: product.id,
        title: product.name,
        price: product.price,
        img: product.image,
        quantity: 1
      };
      addToCart(null, true, productToAdd);
      alert("Produit ajouté au panier !");
    });
  }
}

// Événement boutons "Add to Cart"
function attachAddToCartEvents() {
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const productId = parseInt(button.dataset.id);
      if (!isNaN(productId)) {
        addToCart(productId);
        alert("Produit ajouté au panier !");
      }
    });
  });
}

// Boutons like
function attachLikeButtonEvents() {
  document.querySelectorAll('.like-btn').forEach(button => {
    const id = parseInt(button.dataset.id);
    if (!isNaN(id)) {
      button.addEventListener('click', () => toggleLikeState(button, id));
    }
  });
}

// État initial du bouton like
function handleLikeButtonState(button, id) {
  if (!button) return;

  const liked = localStorage.getItem(`liked-${id}`) === 'true';
  const icon = button.querySelector('i');
  let likedText = button.querySelector('.liked-text');

  if (!likedText) {
    likedText = document.createElement('span');
    likedText.className = 'liked-text';
    likedText.textContent = 'Liked';
    likedText.style.display = 'none';
    button.appendChild(likedText);
  }

  if (liked) {
    button.classList.add('liked');
    icon.classList.remove('fa-regular');
    icon.classList.add('fa-solid');
    likedText.style.display = 'inline';
  } else {
    button.classList.remove('liked');
    icon.classList.remove('fa-solid');
    icon.classList.add('fa-regular');
    likedText.style.display = 'none';
  }
}

// Toggle du like
function toggleLikeState(button, id) {
  if (!button) return;
  const icon = button.querySelector('i');
  const likedText = button.querySelector('.liked-text');
  const isLiked = button.classList.toggle('liked');

  if (isLiked) {
    icon.classList.remove('fa-regular');
    icon.classList.add('fa-solid');
    likedText.style.display = 'inline';
    localStorage.setItem(`liked-${id}`, 'true');
  } else {
    icon.classList.remove('fa-solid');
    icon.classList.add('fa-regular');
    likedText.style.display = 'none';
    localStorage.setItem(`liked-${id}`, 'false');
  }
}

// Ajouter au panier
function addToCart(id, fromDetails = false, detailsProduct = null) {
  let cart = getCart();
  let product;

  if (fromDetails && detailsProduct) {
    product = detailsProduct;
  } else {
    product = products.find(p => p.id === id);
    if (!product) return;
  }

  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name || product.title,
      price: product.price,
      image: product.image || product.img,
      quantity: 1
    });
  }

  saveCart(cart);
  updateCartCount();
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem('cart')) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cart-count');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  }
}

// 🔥 Filtrer les produits par catégorie
function filterByCategory(category) {
  if (!products || products.length === 0) return;

  if (category === 'all' || category === '') {
    displayProducts(products);
  } else {
    const filtered = products.filter(p => p.category === category);
    displayProducts(filtered);
  }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  updateCartCount();

  const categoryFilter = document.getElementById('category-filter');
  if (categoryFilter) {
    categoryFilter.addEventListener('change', () => {
      const selected = categoryFilter.value;
      filterByCategory(selected);
    });
  }
});
