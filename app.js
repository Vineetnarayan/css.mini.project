// Thala 7. Interactive Cart & Gallery Script
const DEFAULT_CART = [
  { id: 1, name: "Seven By M.S.Dhoni Women's Hogun Multi-Color Running Shoes", price: 1334, qty: 2, img: "images/shoe-side.jpg" },
  { id: 2, name: "Seven By M.S.Dhoni Hogun Pro Breathable Mesh Trainers", price: 1599, qty: 1, img: "images/shoe-front.jpg" }
];

function getCart() {
  try {
    const raw = localStorage.getItem('thala7_cart');
    return raw ? JSON.parse(raw) : DEFAULT_CART;
  } catch (e) { return DEFAULT_CART; }
}

function saveCart(cart) {
  try { localStorage.setItem('thala7_cart', JSON.stringify(cart)); } catch (e) {}
  updateHeaderBadge(cart);
}

function updateHeaderBadge(cart) {
  const badge = document.getElementById('header-cart-badge');
  if (badge) badge.textContent = cart.reduce((s, i) => s + i.qty, 0);
}

function switchGalleryImage(btn, src) {
  const main = document.getElementById('main-product-img');
  if (main) main.src = src;
  document.querySelectorAll('.gallery-thumb').forEach(el => el.classList.remove('active'));
  btn.classList.add('active');
}

function changeProductQty(delta) {
  const el = document.getElementById('product-qty-val');
  if (!el) return;
  const val = Math.max(1, parseInt(el.textContent, 10) + delta);
  el.textContent = val;
}

function addCurrentProductToCart() {
  const qtyEl = document.getElementById('product-qty-val');
  const qty = qtyEl ? parseInt(qtyEl.textContent, 10) : 1;
  const cart = getCart();
  const existing = cart.find(i => i.id === 1);
  if (existing) existing.qty += qty;
  else cart.push({ id: 1, name: "Seven By M.S.Dhoni Women's Hogun Multi-Color Running Shoes", price: 1334, qty, img: "images/shoe-side.jpg" });
  saveCart(cart);
  alert('Added ' + qty + ' item(s) to Shopping Cart!');
}

function renderSummary(cart) {
  const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = sub > 0 ? 100 : 0;
  let disc = 0;
  try { disc = parseInt(localStorage.getItem('thala7_discount') || '0', 10); } catch (e) {}
  const total = Math.max(0, sub + tax - Math.min(disc, sub));
  const fmt = n => '₹' + n.toLocaleString('en-IN');

  ['cart-subtotal', 'checkout-subtotal'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = fmt(sub); });
  ['cart-taxes', 'checkout-taxes'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = fmt(tax); });
  ['cart-discount', 'checkout-discount'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = fmt(disc); });
  ['cart-total', 'checkout-total', 'cart-pay-amount', 'checkout-pay-amount'].forEach(id => { const el = document.getElementById(id); if (el) el.textContent = fmt(total); });
}

function renderCartPage() {
  const tbody = document.getElementById('cart-tbody');
  const cart = getCart();
  updateHeaderBadge(cart);
  renderSummary(cart);
  if (!tbody) return;
  tbody.innerHTML = cart.map(item => `
    <tr>
      <td><div class="cart-item-info"><img src="${item.img}" alt="${item.name}"><span>${item.name}</span></div></td>
      <td>
        <div class="qty-select-box">
          <button type="button" onclick="updateCartQty(${item.id}, -1)">-</button>
          <span>${item.qty}</span>
          <button type="button" onclick="updateCartQty(${item.id}, 1)">+</button>
        </div>
      </td>
      <td><strong>₹${(item.price * item.qty).toLocaleString('en-IN')}</strong></td>
      <td><button class="remove-btn" type="button" onclick="removeCartItem(${item.id})">&times;</button></td>
    </tr>
  `).join('');
}

function updateCartQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) item.qty = Math.max(1, item.qty + delta);
  saveCart(cart);
  renderCartPage();
}

function removeCartItem(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  renderCartPage();
}

function applyCoupon(inputId) {
  const code = document.getElementById(inputId).value.trim().toUpperCase();
  const disc = (code === 'THALA7' || code === 'SAVE10') ? 250 : 0;
  try { localStorage.setItem('thala7_discount', String(disc)); } catch (e) {}
  renderSummary(getCart());
}

function selectPaymentMethod(btn, method) {
  document.querySelectorAll('.payment-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('payment-fields-cards').style.display = method === 'cards' ? 'block' : 'none';
  document.getElementById('payment-fields-crypto').style.display = method === 'crypto' ? 'block' : 'none';
  document.getElementById('payment-fields-bank').style.display = method === 'bank' ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', renderCartPage);
