import { getUser, setUser, setToken, clearToken, register, login, getOrders } from './api.js';
import { updateUserGreetings } from './greeting.js';
import { refreshCart } from './cart.js';
import gsap from 'gsap';

export function initProfile() {
  const authBtn = document.getElementById('nav-auth-btn');
  const modal = document.getElementById('auth-modal');
  const closeBtn = document.getElementById('auth-modal-close-btn');
  const submitBtn = document.getElementById('auth-submit-btn');
  const switchBtn = document.getElementById('auth-switch-btn');
  const logoutBtn = document.getElementById('auth-logout-btn');

  if (authBtn) {
    authBtn.addEventListener('click', () => openAuthModal());
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeAuthModal());
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAuthModal();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
      closeAuthModal();
    }
  });

  if (switchBtn) {
    switchBtn.addEventListener('click', () => {
      document.getElementById('auth-logged-in-view').style.display = 'none';
      document.getElementById('auth-login-form-view').style.display = 'block';
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      clearToken();
      localStorage.removeItem('brevita_user');
      window.location.reload();
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', handleAuthSubmit);
  }
}

export async function openAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;

  const user = getUser();
  const loggedInView = document.getElementById('auth-logged-in-view');
  const loginFormView = document.getElementById('auth-login-form-view');

  if (user && user.name && user.name !== 'Guest') {
    loggedInView.style.display = 'block';
    loginFormView.style.display = 'none';
    loadRecentOrders();
  } else {
    loggedInView.style.display = 'none';
    loginFormView.style.display = 'block';
  }

  updateUserGreetings();

  modal.style.display = 'flex';
  gsap.fromTo(modal.querySelector('.modal-content'),
    { scale: 0.85, opacity: 0, y: 20 },
    { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
  );
}

export function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;

  gsap.to(modal.querySelector('.modal-content'), {
    scale: 0.9, opacity: 0, y: 15, duration: 0.25, ease: 'power2.in',
    onComplete: () => {
      modal.style.display = 'none';
    }
  });
}

async function handleAuthSubmit() {
  const nameInput = document.getElementById('auth-input-name');
  const phoneInput = document.getElementById('auth-input-phone');
  const errorEl = document.getElementById('auth-error-msg');
  const submitBtn = document.getElementById('auth-submit-btn');

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();

  if (!name || !phone) {
    if (errorEl) errorEl.textContent = 'Please enter both your name and mobile number.';
    return;
  }

  if (errorEl) errorEl.textContent = '';
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';
  }

  try {
    let result;
    try {
      result = await register(name, phone);
    } catch (regErr) {
      // If already registered, login
      result = await login(phone);
    }

    if (result && result.token) {
      setToken(result.token);
      setUser(result.user || { name, phone });
      updateUserGreetings();
      await refreshCart();
      closeAuthModal();
      
      // Update name input on intro screen too if it exists
      const introName = document.getElementById('user-name');
      const introPhone = document.getElementById('user-phone');
      if (introName) introName.value = name;
      if (introPhone) introPhone.value = phone;
    }
  } catch (err) {
    console.error('Auth error:', err);
    if (errorEl) errorEl.textContent = 'Authentication failed. Please check your credentials.';
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In / Continue →';
    }
  }
}

async function loadRecentOrders() {
  const list = document.getElementById('auth-orders-list');
  if (!list) return;

  list.innerHTML = '<p style="color:var(--text-muted); font-size:0.85rem;">Loading orders...</p>';

  try {
    const orders = await getOrders();
    if (!orders || orders.length === 0) {
      list.innerHTML = '<p style="color:var(--text-muted); font-size:0.85rem;">No previous orders found. Explore our menu to place your first order!</p>';
      return;
    }

    list.innerHTML = '';
    orders.slice(0, 4).forEach(ord => {
      const card = document.createElement('div');
      card.className = 'auth-order-card';
      const itemsText = (ord.items || []).map(i => `${i.quantity}x ${i.name}`).join(', ');
      
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; margin-bottom:0.2rem;">
          <span style="color:var(--gold-accent); font-weight:500; font-size:0.85rem;">#${ord.order_number || ord.id}</span>
          <span style="color:var(--success, #2ecc71); font-size:0.75rem; text-transform:uppercase;">${ord.status}</span>
        </div>
        <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:0.3rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
          ${itemsText || 'Order details'}
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted);">
          <span>${ord.type === 'dine-in' ? 'Dine In' : 'Takeaway'} • ${ord.payment_method?.toUpperCase()}</span>
          <span style="color:var(--text-primary); font-weight:600;">$${Number(ord.total).toFixed(2)}</span>
        </div>
      `;
      list.appendChild(card);
    });
  } catch (e) {
    list.innerHTML = '<p style="color:var(--text-muted); font-size:0.85rem;">Could not load past orders.</p>';
  }
}
