// Format currency in XOF using French locale
function formatXOF(value) {
  return 'XOF ' + new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Render cart items and total on checkout page
function updateCartSummary() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('total-price');

  if (!cartItemsContainer || !cartTotal) return;

  cartItemsContainer.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="text-muted">Your cart is empty.</p>';
    cartTotal.textContent = formatXOF(0);
    return;
  }

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const itemHTML = `
      <div class="row mb-3 border-bottom pb-2">
        <div class="col-md-8">
          <h6 class="mb-1">${item.name} <span class="text-muted">x${item.quantity}</span></h6>
          <p class="mb-0 small">${formatXOF(itemTotal)}</p>
        </div>
      </div>
    `;
    cartItemsContainer.insertAdjacentHTML('beforeend', itemHTML);
  });

  cartTotal.textContent = formatXOF(total);
}

// Toggle form field visual validation state
function toggleValidity(input, isValid) {
  input.classList.toggle('is-valid', isValid);
  input.classList.toggle('is-invalid', !isValid);
}

// Validate all checkout form fields
function validatePaymentForm() {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  const name = form.elements['full-name'];
  const email = form.elements['email'];
  const cardNumber = form.elements['card-number'];
  const expiry = form.elements['expiry'];
  const cvv = form.elements['cvv'];

  const nameValid = name.checkValidity();
  const emailValid = email.checkValidity();
  const cardValid = /^\d{13,19}$/.test(cardNumber.value.replace(/\s+/g, ''));
  const expiryValid = /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiry.value.trim());
  const cvvValid = /^\d{3,4}$/.test(cvv.value.trim());

  toggleValidity(name, nameValid);
  toggleValidity(email, emailValid);
  toggleValidity(cardNumber, cardValid);
  toggleValidity(expiry, expiryValid);
  toggleValidity(cvv, cvvValid);

  const isValid = nameValid && emailValid && cardValid && expiryValid && cvvValid;

  const placeOrderBtn = document.getElementById('place-order-btn');
  if (placeOrderBtn) {
    placeOrderBtn.disabled = !isValid;
    placeOrderBtn.setAttribute('aria-disabled', String(!isValid));
  }

  return isValid;
}

// Submit order handler
function handlePlaceOrder(event) {
  event.preventDefault();

  if (!validatePaymentForm()) {
    const firstInvalid = document.querySelector('.is-invalid');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  // Proceed with order submission
  alert('Thank you for your order! Redirecting to confirmation page...');
  localStorage.removeItem('cart');
  window.location.href = 'thank-you.html';
}

// Initialization on DOM load
document.addEventListener('DOMContentLoaded', () => {
  updateCartSummary();
  validatePaymentForm();

  // Live validation on input change
  document.querySelectorAll('#checkout-form input').forEach(input => {
    input.addEventListener('input', validatePaymentForm);
  });

  const placeOrderBtn = document.getElementById('place-order-btn');
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', handlePlaceOrder);
  }
});
