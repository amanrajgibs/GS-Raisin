/* ============================================================
   KEEPSY — Main JavaScript
   js/main.js  |  All interactive behaviour
   ============================================================ */

/* ────────────────────────────────────────────────────────────
   STATE
──────────────────────────────────────────────────────────── */
const state = {
  cart: [],
  currentPage: 'home',
  currentProduct: null,
};

/* ────────────────────────────────────────────────────────────
   PAGE NAVIGATION
──────────────────────────────────────────────────────────── */
function navigateTo(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  // Show target page
  const target = document.getElementById(pageId);
  if (target) target.classList.add('active');
  // Update nav links
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === pageId);
  });
  state.currentPage = pageId;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  closeMobileMenu();
  // Re-run animations for new page
  setTimeout(observeAnimations, 100);
}

/* Nav link clicks */
document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const page = el.dataset.page;
    if (page === 'product-bracelet') openProduct('bracelet');
    else if (page === 'product-earring') openProduct('earring');
    else navigateTo(page);
  });
});

/* ────────────────────────────────────────────────────────────
   NAVBAR SCROLL
──────────────────────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar');
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

/* ────────────────────────────────────────────────────────────
   MOBILE MENU
──────────────────────────────────────────────────────────── */
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

hamburger?.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMobileMenu() {
  mobileMenu?.classList.remove('open');
}

/* ────────────────────────────────────────────────────────────
   SCROLL ANIMATIONS
──────────────────────────────────────────────────────────── */
function observeAnimations() {
  const els = document.querySelectorAll('.animate-up:not(.in-view)');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => observer.observe(el));
}
observeAnimations();

/* ────────────────────────────────────────────────────────────
   PRODUCT DATA
──────────────────────────────────────────────────────────── */
const products = {
  bracelet: {
    id: 'bracelet',
    name: 'Memory Bracelet',
    subtitle: 'Handcrafted Resin · Personalised',
    desc: 'Wear your story on your wrist. Our Memory Bracelets are lovingly handcrafted from premium resin, capturing a name, date, or moment that means the world to you. Each piece is unique — because your memory is.',
    price: 899,
    original: 1199,
    image: 'images/bracelet.jpeg',
    badge: 'Bestseller',
    category: 'bracelet',
  },
  earring: {
    id: 'earring',
    name: 'Keepsake Earrings',
    subtitle: 'Resin Drops · Personalised Pair',
    desc: 'Delicate, luminous, and entirely yours. Our Keepsake Earrings translate your favourite dates and initials into wearable art. Lightweight resin, rich in colour and character — perfect for gifting.',
    price: 749,
    original: 999,
    image: 'images/Earring.jpeg',
    badge: 'New',
    category: 'earring',
  },
};

/* ────────────────────────────────────────────────────────────
   OPEN PRODUCT PAGE
──────────────────────────────────────────────────────────── */
function openProduct(id) {
  const p = products[id];
  if (!p) return;
  state.currentProduct = p;

  // Populate product page
  document.getElementById('prod-img').src = p.image;
  document.getElementById('prod-img').alt = p.name;
  document.getElementById('prod-badge').textContent = p.badge;
  document.getElementById('prod-name').textContent = p.name;
  document.getElementById('prod-desc').textContent = p.desc;
  document.getElementById('prod-price').textContent = '₹' + p.price;
  document.getElementById('prod-original').textContent = '₹' + p.original;
  const save = Math.round((1 - p.price / p.original) * 100);
  document.getElementById('prod-save').textContent = save + '% off';

  // Reset form
  document.getElementById('prod-name-field').value = '';
  document.getElementById('prod-date-field').value = '';
  document.getElementById('prod-msg-field').value = '';
  document.getElementById('qty-display').textContent = '1';

  navigateTo('product');
}

/* Product card clicks */
document.querySelectorAll('[data-product]').forEach(el => {
  el.addEventListener('click', () => openProduct(el.dataset.product));
});

/* ────────────────────────────────────────────────────────────
   QUANTITY CONTROL
──────────────────────────────────────────────────────────── */
let qty = 1;
document.querySelector('.qty-btn.minus')?.addEventListener('click', () => {
  if (qty > 1) { qty--; document.getElementById('qty-display').textContent = qty; }
});
document.querySelector('.qty-btn.plus')?.addEventListener('click', () => {
  qty++;
  document.getElementById('qty-display').textContent = qty;
});

/* ────────────────────────────────────────────────────────────
   CART
──────────────────────────────────────────────────────────── */
function addToCart(product, customisation, quantity) {
  const item = {
    ...product,
    qty: quantity,
    customisation,
    lineId: Date.now(),
  };
  state.cart.push(item);
  updateCartUI();
  showToast('✨ Added to your cart!');
}

function removeFromCart(lineId) {
  state.cart = state.cart.filter(i => i.lineId !== lineId);
  updateCartUI();
}

function updateCartUI() {
  const count = state.cart.reduce((acc, i) => acc + i.qty, 0);
  document.querySelector('.cart-count').textContent = count;
  document.querySelector('.cart-count').style.display = count > 0 ? 'flex' : 'none';

  const cartItems = document.getElementById('cart-items-list');
  const cartEmpty = document.getElementById('cart-empty');
  const cartTotal = document.getElementById('cart-total-price');
  const total = state.cart.reduce((acc, i) => acc + i.price * i.qty, 0);

  if (state.cart.length === 0) {
    cartEmpty.style.display = 'block';
    cartItems.innerHTML = '';
  } else {
    cartEmpty.style.display = 'none';
    cartItems.innerHTML = state.cart.map(item => `
      <div class="cart-item">
        <img class="cart-item-img" src="${item.image}" alt="${item.name}">
        <div style="flex:1">
          <div class="cart-item-name">${item.name} × ${item.qty}</div>
          <div class="cart-item-custom">${item.customisation || ''}</div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:.4rem">
            <span class="cart-item-price">₹${(item.price * item.qty).toLocaleString()}</span>
            <button class="cart-item-remove" onclick="removeFromCart(${item.lineId})">Remove</button>
          </div>
        </div>
      </div>
    `).join('');
  }
  if (cartTotal) cartTotal.textContent = '₹' + total.toLocaleString();
}

/* Add to cart button */
document.getElementById('add-to-cart-btn')?.addEventListener('click', () => {
  if (!state.currentProduct) return;
  const name = document.getElementById('prod-name-field').value.trim();
  const date = document.getElementById('prod-date-field').value;
  const msg  = document.getElementById('prod-msg-field').value.trim();
  const custom = [name && `Name: ${name}`, date && `Date: ${date}`, msg && `"${msg}"`].filter(Boolean).join(' · ');
  addToCart(state.currentProduct, custom, qty);
  qty = 1;
  document.getElementById('qty-display').textContent = '1';
});

/* Buy now */
document.getElementById('buy-now-btn')?.addEventListener('click', () => {
  document.getElementById('add-to-cart-btn')?.click();
  openCart();
  setTimeout(() => {
    closeCart();
    navigateTo('checkout');
  }, 800);
});

/* Cart sidebar open/close */
function openCart() {
  document.querySelector('.cart-overlay').classList.add('show');
  document.querySelector('.cart-sidebar').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.querySelector('.cart-overlay').classList.remove('show');
  document.querySelector('.cart-sidebar').classList.remove('show');
  document.body.style.overflow = '';
}

document.querySelector('.cart-btn')?.addEventListener('click', openCart);
document.querySelector('.cart-overlay')?.addEventListener('click', closeCart);
document.querySelector('.cart-close')?.addEventListener('click', closeCart);
document.querySelector('.cart-checkout-btn')?.addEventListener('click', () => {
  closeCart();
  navigateTo('checkout');
});

/* ────────────────────────────────────────────────────────────
   SHOP FILTERS
──────────────────────────────────────────────────────────── */
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const group = chip.closest('.filter-group');
    group.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    filterProducts(chip.dataset.filter);
  });
});

function filterProducts(filter) {
  document.querySelectorAll('.shop-grid .product-card').forEach(card => {
    const cat = card.dataset.category;
    if (!filter || filter === 'all') {
      card.style.display = 'block';
    } else {
      card.style.display = cat === filter ? 'block' : 'none';
    }
  });
}

/* ────────────────────────────────────────────────────────────
   PAYMENT OPTIONS
──────────────────────────────────────────────────────────── */
document.querySelectorAll('.payment-option').forEach(opt => {
  opt.addEventListener('click', () => {
    // Mark selected
    document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    opt.querySelector('input[type="radio"]').checked = true;

    // Hide all panels
    document.querySelectorAll('.upi-panel,.razorpay-panel,.cod-panel').forEach(p => p.classList.remove('show'));

    // Show relevant panel
    const method = opt.dataset.method;
    if (method === 'upi') document.querySelector('.upi-panel')?.classList.add('show');
    if (method === 'razorpay') document.querySelector('.razorpay-panel')?.classList.add('show');
    if (method === 'cod') document.querySelector('.cod-panel')?.classList.add('show');
  });
});

/* UPI copy */
document.getElementById('copy-upi')?.addEventListener('click', () => {
  navigator.clipboard.writeText('8083675985@upi').then(() => showToast('📋 UPI ID copied!'));
});

/* Razorpay mock buttons */
document.querySelectorAll('.rzp-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    showToast('💳 Redirecting to payment gateway…');
    setTimeout(() => showToast('✅ This is a demo — integrate Razorpay key to go live!'), 2000);
  });
});

/* Place order */
document.getElementById('place-order-btn')?.addEventListener('click', () => {
  const method = document.querySelector('.payment-option.selected')?.dataset.method;
  if (!method) { showToast('⚠️ Please select a payment method'); return; }
  showToast('🎉 Order placed! We\'ll confirm via WhatsApp shortly.');
  state.cart = [];
  updateCartUI();
  setTimeout(() => navigateTo('home'), 2500);
});

/* ────────────────────────────────────────────────────────────
   FORMS
──────────────────────────────────────────────────────────── */
/* Custom order form */
document.getElementById('custom-order-form')?.addEventListener('submit', e => {
  e.preventDefault();
  showToast('✨ Custom order received! We\'ll contact you soon.');
  e.target.reset();
});

/* Contact form */
document.getElementById('contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  showToast('💌 Message sent! We\'ll reply within 24 hours.');
  e.target.reset();
});

/* ────────────────────────────────────────────────────────────
   FILE UPLOAD PREVIEW
──────────────────────────────────────────────────────────── */
document.getElementById('img-upload')?.addEventListener('change', function() {
  const file = this.files[0];
  if (file) {
    const uploadText = document.querySelector('.upload-text');
    if (uploadText) uploadText.innerHTML = `<strong>${file.name}</strong> — ready to upload`;
  }
});

/* ────────────────────────────────────────────────────────────
   TOAST NOTIFICATION
──────────────────────────────────────────────────────────── */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

/* ────────────────────────────────────────────────────────────
   CHECKOUT — populate order summary from cart
──────────────────────────────────────────────────────────── */
function populateCheckout() {
  const summaryList = document.getElementById('checkout-items');
  if (!summaryList) return;

  if (state.cart.length === 0) {
    summaryList.innerHTML = '<p style="color:var(--warm-gray);font-size:.83rem">Your cart is empty.</p>';
  } else {
    const subtotal = state.cart.reduce((acc, i) => acc + i.price * i.qty, 0);
    const shipping = 0;
    summaryList.innerHTML = state.cart.map(item => `
      <div class="summary-item">
        <img class="summary-item-img" src="${item.image}" alt="${item.name}">
        <div>
          <div class="summary-item-name">${item.name} × ${item.qty}</div>
          <div class="summary-item-sub">${item.customisation || 'No customisation'}</div>
        </div>
        <div class="summary-item-price">₹${(item.price * item.qty).toLocaleString()}</div>
      </div>
    `).join('');
    document.getElementById('checkout-subtotal').textContent = '₹' + subtotal.toLocaleString();
    document.getElementById('checkout-shipping').textContent = shipping === 0 ? 'Free' : '₹' + shipping;
    document.getElementById('checkout-total').textContent = '₹' + (subtotal + shipping).toLocaleString();
  }
}

// Repopulate every time checkout page is shown
const checkoutObserver = new MutationObserver(() => {
  if (document.getElementById('checkout')?.classList.contains('active')) populateCheckout();
});
const checkoutEl = document.getElementById('checkout');
if (checkoutEl) checkoutObserver.observe(checkoutEl, { attributes: true, attributeFilter: ['class'] });

/* ────────────────────────────────────────────────────────────
   SMOOTH HERO CTA
──────────────────────────────────────────────────────────── */
document.getElementById('hero-shop-btn')?.addEventListener('click', () => navigateTo('shop'));
document.getElementById('hero-custom-btn')?.addEventListener('click', () => navigateTo('custom'));

/* ────────────────────────────────────────────────────────────
   INIT
──────────────────────────────────────────────────────────── */
updateCartUI();
navigateTo('home');
