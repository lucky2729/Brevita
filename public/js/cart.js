import { getCart, addToCart, updateCartItem, removeCartItem, clearCart, getCartSuggestions } from './api.js';
import gsap from 'gsap';
import { showCheckout } from './checkout.js';

let cartItems = [];
let cartIsOpen = false;

export function initCart() {
  document.getElementById('cart-btn')?.addEventListener('click', toggleCart);
  document.getElementById('cart-close')?.addEventListener('click', closeCart);
  document.querySelector('.cart-overlay')?.addEventListener('click', closeCart);
  document.getElementById('checkout-btn')?.addEventListener('click', showCheckout);
  
  refreshCart();
}

function toggleCart() {
  cartIsOpen ? closeCart() : openCart();
}

function openCart() {
  cartIsOpen = true;
  document.querySelector('.cart-drawer')?.classList.add('open');
  document.querySelector('.cart-overlay')?.classList.add('active');
  refreshCart();
}

export function closeCart() {
  cartIsOpen = false;
  document.querySelector('.cart-drawer')?.classList.remove('open');
  document.querySelector('.cart-overlay')?.classList.remove('active');
}

export async function refreshCart() {
  try {
    const cart = await getCart();
    cartItems = Array.isArray(cart) ? cart : (cart?.items || []);
    renderCartItems();
    updateBadgeCount();
    
    const suggSec = document.querySelector('.suggestions-section');
    if (cartItems.length > 0) {
      const suggestions = await getCartSuggestions();
      renderSuggestions(suggestions);
    } else if (suggSec) {
      suggSec.style.display = 'none';
    }
  } catch (error) {
    console.error('Error refreshing cart:', error);
  }
}

function updateBadgeCount() {
  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

function renderCartItems() {
  const list = document.querySelector('.cart-items-list');
  const totalDisplay = document.getElementById('cart-subtotal');
  const checkoutBtn = document.getElementById('checkout-btn');
  if (!list) return;
  
  list.innerHTML = '';
  let subtotal = 0;
  
  if (cartItems.length === 0) {
    list.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>Your cart is empty</p>
        <span style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem; display: block;">Select culinary creations or coffees from the menu to get started.</span>
      </div>
    `;
    if (totalDisplay) totalDisplay.textContent = '$0.00';
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }
  
  if (checkoutBtn) checkoutBtn.disabled = false;
  
  const defaultImg = 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&auto=format&fit=crop&q=80';

  cartItems.forEach(item => {
    subtotal += item.price * item.quantity;
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    
    const itemId = item.itemId || item.id;
    const localImg = `images/dishes/${itemId}.jpg`;
    const cdnImg = `https://raw.githubusercontent.com/lucky2729/Brevita/main/public/images/dishes/${itemId}.jpg`;
    const fallbackFood = 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&auto=format&fit=crop&q=80';

    const isVeg = (item.dietary || 'veg').toLowerCase() === 'veg';

    itemEl.innerHTML = `
      <img src="${localImg}" alt="${item.name}" class="cart-item-img" onerror="if(this.src!=='${cdnImg}'){this.src='${cdnImg}';}else{this.src='${fallbackFood}';}">
      <div class="cart-item-info">
        <h4 class="cart-item-name"><span class="dietary-symbol ${isVeg ? 'veg' : 'non-veg'}" style="margin-right: 4px;"></span>${item.name}</h4>
        <div class="cart-item-qty">
          <button class="qty-btn minus" data-id="${item.itemId || item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn plus" data-id="${item.itemId || item.id}">+</button>
        </div>
      </div>
      <div style="text-align: right;">
        <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
        <button class="cart-item-remove" data-id="${item.itemId || item.id}" title="Remove item">×</button>
      </div>
    `;
    list.appendChild(itemEl);
  });
  
  if (totalDisplay) totalDisplay.textContent = `$${subtotal.toFixed(2)}`;
  
  // Attach events
  list.querySelectorAll('.qty-btn.minus').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      const item = cartItems.find(i => (i.itemId === id || i.id === id));
      if (!item) return;
      if (item.quantity > 1) {
        await updateCartItem(id, item.quantity - 1);
      } else {
        await removeCartItem(id);
      }
      refreshCart();
    });
  });
  
  list.querySelectorAll('.qty-btn.plus').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      const item = cartItems.find(i => (i.itemId === id || i.id === id));
      if (!item) return;
      await updateCartItem(id, item.quantity + 1);
      refreshCart();
    });
  });
  
  list.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      await removeCartItem(id);
      refreshCart();
    });
  });
}

function renderSuggestions(suggestions) {
  const section = document.querySelector('.suggestions-section');
  const scroll = document.querySelector('.suggestions-scroll');
  if (!section || !scroll) return;
  
  if (!suggestions || suggestions.length === 0) {
    section.style.display = 'none';
    return;
  }
  
  section.style.display = 'block';
  scroll.innerHTML = '';
  
  const defaultImg = 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&auto=format&fit=crop&q=80';

  suggestions.forEach(item => {
    const card = document.createElement('div');
    card.className = 'suggestion-card';
    card.style.cursor = 'pointer';
    card.innerHTML = `
      <img src="${item.image || defaultImg}" alt="${item.name}" style="width:100%; height:65px; object-fit:cover; border-radius:8px; margin-bottom:0.4rem;" onerror="this.src='${defaultImg}'">
      <h4 style="font-size:0.82rem; margin-bottom:0.2rem;">${item.name}</h4>
      <p style="color:var(--gold-accent); font-size:0.8rem; margin-bottom:0.4rem;">$${item.price.toFixed(2)}</p>
      <button class="suggestion-add-btn btn-gold" data-id="${item.id}" style="padding:0.3rem 0.8rem; font-size:0.75rem; width:100%;">+ Add</button>
    `;
    scroll.appendChild(card);
  });
  
  scroll.querySelectorAll('.suggestion-add-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = e.target.dataset.id;
      await addItemToCart(id, 1);
    });
  });
}

export async function addItemToCart(itemId, quantity = 1) {
  try {
    await addToCart(itemId, quantity);
    await refreshCart();
    
    // Animate badge
    const badge = document.querySelector('.cart-badge');
    if (badge) {
      gsap.fromTo(badge, 
        { scale: 1.6 }, 
        { scale: 1, duration: 0.4, ease: 'back.out(2)' }
      );
    }
  } catch (error) {
    console.error('Failed to add item to cart:', error);
  }
}
