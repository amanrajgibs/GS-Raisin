/* ============================================================
   KEEPSY — Shop Page JavaScript
   Filter & Sort functionality
   ============================================================ */

function filterProducts(category, btn) {
  // Update pill states
  document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');

  // Show/hide cards
  const cards = document.querySelectorAll('#shopGrid .product-card');
  cards.forEach(card => {
    const cat = card.dataset.category;
    if (category === 'all' || cat === category) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

function sortProducts() {
  const sort = document.getElementById('priceSort').value;
  const grid = document.getElementById('shopGrid');
  const cards = Array.from(grid.querySelectorAll('.product-card'));

  cards.sort((a, b) => {
    const pa = parseInt(a.dataset.price) || 0;
    const pb = parseInt(b.dataset.price) || 0;
    if (sort === 'low') return pa - pb;
    if (sort === 'high') return pb - pa;
    return 0;
  });

  cards.forEach(card => grid.appendChild(card));
}
