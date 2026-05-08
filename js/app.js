// ===== PRODUCT DATA =====
const products = [
  { id: 1, name: "Silk Dress Shirt", category: "Apparel", price: 4999, original: 6999, emoji: "👔", badge: "sale", bg: "linear-gradient(135deg,#e8d5a3,#c9a96e)" },
  { id: 2, name: "Leather Watch", category: "Accessories", price: 12999, original: null, emoji: "⌚", badge: "new", bg: "linear-gradient(135deg,#1a1a2e,#16213e)" },
  { id: 3, name: "Suede Chelsea Boot", category: "Footwear", price: 8499, original: 10999, emoji: "👢", badge: "sale", bg: "linear-gradient(135deg,#2c1810,#6b3a2a)" },
  { id: 4, name: "Cashmere Sweater", category: "Apparel", price: 7299, original: null, emoji: "🧥", badge: "hot", bg: "linear-gradient(135deg,#1e3a5f,#2980b9)" },
  { id: 5, name: "Gold Hoop Earrings", category: "Accessories", price: 2499, original: null, emoji: "💛", badge: "new", bg: "linear-gradient(135deg,#c9a96e,#8b6914)" },
  { id: 6, name: "Serum Collection", category: "Beauty", price: 3299, original: 4299, emoji: "✨", badge: "sale", bg: "linear-gradient(135deg,#3d0c02,#9c2727)" },
  { id: 7, name: "Linen Trousers", category: "Apparel", price: 3799, original: null, emoji: "👖", badge: null, bg: "linear-gradient(135deg,#e8e0d0,#d4c5a9)" },
  { id: 8, name: "Sneaker – White", category: "Footwear", price: 5999, original: null, emoji: "👟", badge: "new", bg: "linear-gradient(135deg,#f0f0f0,#d0d0d0)" },
  { id: 9, name: "Satin Blazer", category: "Apparel", price: 9999, original: 13999, emoji: "🧣", badge: "sale", bg: "linear-gradient(135deg,#0d0d0d,#3a3a3a)" },
  { id: 10, name: "Parfum Noir", category: "Beauty", price: 6499, original: null, emoji: "🖤", badge: "hot", bg: "linear-gradient(135deg,#1a0a00,#4a2000)" },
  { id: 11, name: "Pearl Necklace", category: "Accessories", price: 4299, original: null, emoji: "🪨", badge: null, bg: "linear-gradient(135deg,#f5f0e8,#e0d6c4)" },
  { id: 12, name: "Canvas Tote Bag", category: "Accessories", price: 1799, original: null, emoji: "👜", badge: null, bg: "linear-gradient(135deg,#c9a96e,#a07850)" },
];

let cart = [];
let filteredProducts = [...products];

// ===== RENDER =====
function renderProducts(list) {
  const grid = document.getElementById('productGrid');
  if (!list.length) {
    grid.innerHTML = '<p style="color:var(--mid);font-family:var(--font-serif);font-size:22px;grid-column:1/-1;text-align:center;padding:60px 0">No products found.</p>';
    return;
  }
  grid.innerHTML = list.map((p, i) => `
    <div class="product-card" style="animation-delay:${i * 0.07}s">
      <div class="product-thumb" style="background:${p.bg}">
        <span>${p.emoji}</span>
        ${p.badge ? `<span class="product-badge badge-${p.badge}">${p.badge}</span>` : ''}
      </div>
      <div class="product-info">
        <p class="product-category">${p.category}</p>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-footer">
          <div class="product-price">
            ₹${p.price.toLocaleString()}
            ${p.original ? `<span class="original">₹${p.original.toLocaleString()}</span>` : ''}
          </div>
          <button class="add-btn" onclick="addToCart(${p.id})">Add</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ===== CART =====
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCart();
  showToast(`${product.emoji} ${product.name} added to cart`);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCart();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else updateCart();
}

function updateCart() {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartBadge').textContent = count;
  document.getElementById('cartTotal').textContent = `₹${total.toLocaleString()}`;

  const itemsEl = document.getElementById('cartItems');
  if (!cart.length) {
    itemsEl.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
    return;
  }
  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-thumb" style="background:${item.bg};border-radius:4px">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
        <div class="cart-item-controls">
          <button onclick="changeQty(${item.id},-1)">−</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${item.id},1)">+</button>
        </div>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})">✕</button>
    </div>
  `).join('');
}

function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

function checkout() {
  if (!cart.length) { showToast('Your cart is empty!'); return; }
  showToast('🎉 Order placed successfully!');
  cart = [];
  updateCart();
  setTimeout(() => toggleCart(), 800);
}

// ===== SEARCH =====
function toggleSearch() {
  document.getElementById('searchBar').classList.toggle('open');
  if (document.getElementById('searchBar').classList.contains('open')) {
    document.getElementById('searchInput').focus();
  }
}

function filterProducts() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const base = currentCategory
    ? products.filter(p => p.category === currentCategory)
    : products;
  filteredProducts = base.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  );
  renderProducts(filteredProducts);
}

// ===== FILTER BY CATEGORY =====
let currentCategory = '';
function filterByCategory(cat) {
  currentCategory = cat;
  const q = document.getElementById('searchInput').value.toLowerCase();
  let base = cat ? products.filter(p => p.category === cat) : products;
  filteredProducts = q ? base.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) : base;
  renderProducts(filteredProducts);
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

// ===== SORT =====
function sortProducts(val) {
  let list = [...filteredProducts];
  if (val === 'price-asc') list.sort((a,b) => a.price - b.price);
  else if (val === 'price-desc') list.sort((a,b) => b.price - a.price);
  else if (val === 'name') list.sort((a,b) => a.name.localeCompare(b.name));
  renderProducts(list);
}

// ===== CONTACT =====
function submitForm(e) {
  e.preventDefault();
  showToast('✉️ Message sent! We\'ll be in touch soon.');
  e.target.reset();
}

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ===== INIT =====
renderProducts(products);
updateCart();
