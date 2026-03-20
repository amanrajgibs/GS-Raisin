/* ============================================================
   KEEPSY — Checkout JavaScript
   Payment selection, QR generation, order summary, place order
   ============================================================ */

// ---- PAYMENT SELECTION ----
let selectedPayment = null;

function selectPayment(type, el) {
  // Clear all
  document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
  document.querySelectorAll('.payment-detail').forEach(d => d.classList.remove('open'));

  // Select this one
  el.classList.add('selected');
  selectedPayment = type;

  // Show detail panel
  const detail = document.getElementById(`${type}-detail`);
  if (detail) detail.classList.add('open');
}

// ---- RAZORPAY TABS ----
function showCardForm() {
  hideRzpForms();
  document.getElementById('rzpCardForm').style.display = 'block';
  setActiveRzp('.rzp-card');
}
function showNBForm() {
  hideRzpForms();
  document.getElementById('rzpNBForm').style.display = 'block';
  setActiveRzp('.rzp-nb');
}
function showWalletForm() {
  hideRzpForms();
  document.getElementById('rzpWalletForm').style.display = 'block';
  setActiveRzp('.rzp-wallet');
}
function hideRzpForms() {
  ['rzpCardForm', 'rzpNBForm', 'rzpWalletForm'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
}
function setActiveRzp(sel) {
  document.querySelectorAll('.rzp-btn').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(sel);
  if (btn) btn.classList.add('active');
}

// ---- COPY UPI ----
function copyUPI() {
  const upiId = document.getElementById('upiIdText').textContent;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(upiId).then(() => showToast('UPI ID copied! ✦'));
  } else {
    const el = document.createElement('textarea');
    el.value = upiId;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToast('UPI ID copied! ✦');
  }
}

// ---- GENERATE QR PATTERN (decorative) ----
function generateQR() {
  const grid = document.getElementById('qrGrid');
  if (!grid) return;
  // Simple visual QR-like pattern
  const size = 10;
  // Corners always dark, random inside
  const pattern = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const isCorner = (
        (r < 3 && c < 3) ||
        (r < 3 && c >= size - 3) ||
        (r >= size - 3 && c < 3)
      );
      pattern.push(isCorner ? 1 : Math.random() > 0.5 ? 1 : 0);
    }
  }
  grid.innerHTML = pattern.map(v =>
    `<div style="background:${v ? '#2c2417' : '#fff'}; border-radius:1px;"></div>`
  ).join('');
}

// ---- ORDER SUMMARY ----
function buildOrderSummary() {
  const cart = JSON.parse(sessionStorage.getItem('keepsy_cart') || '[]');
  const container = document.getElementById('summaryItems');
  const subtotalEl = document.getElementById('summarySubtotal');
  const totalEl = document.getElementById('summaryTotal');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-summary">No items added yet.</p>';
    return;
  }

  let total = 0;
  container.innerHTML = cart.map(item => {
    const itemTotal = item.price * (item.qty || 1);
    total += itemTotal;
    return `
      <div class="summary-item">
        <span>${item.name} × ${item.qty || 1}</span>
        <span>₹ ${itemTotal.toLocaleString('en-IN')}</span>
      </div>
    `;
  }).join('');

  if (subtotalEl) subtotalEl.textContent = `₹ ${total.toLocaleString('en-IN')}`;
  if (totalEl) totalEl.textContent = `₹ ${total.toLocaleString('en-IN')}`;
}

// ---- WALLET OPTION SELECT ----
document.addEventListener('DOMContentLoaded', () => {
  // Wallet options toggle
  document.querySelectorAll('.wallet-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.wallet-opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  generateQR();
  buildOrderSummary();

  // Auto-select UPI on load
  const upiOption = document.querySelector('.payment-option');
  if (upiOption) selectPayment('upi', upiOption);
});

// ---- PLACE ORDER ----
function placeOrder() {
  // Validate fields
  const name = document.getElementById('co-name')?.value.trim();
  const phone = document.getElementById('co-phone')?.value.trim();
  const email = document.getElementById('co-email')?.value.trim();
  const address = document.getElementById('co-address')?.value.trim();
  const city = document.getElementById('co-city')?.value.trim();
  const pin = document.getElementById('co-pin')?.value.trim();

  if (!name || !phone || !email || !address || !city || !pin) {
    showToast('Please fill in all delivery details ✦');
    document.querySelector('.checkout-block').scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (!selectedPayment) {
    showToast('Please select a payment method ✦');
    return;
  }

  const cart = JSON.parse(sessionStorage.getItem('keepsy_cart') || '[]');
  if (cart.length === 0) {
    showToast('Your cart is empty ✦');
    return;
  }

  // Clear cart
  sessionStorage.removeItem('keepsy_cart');

  // Show confirmation
  document.getElementById('checkoutLayout').style.display = 'none';
  document.getElementById('orderConfirmed').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
