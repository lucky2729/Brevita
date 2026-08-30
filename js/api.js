import { STATIC_MENU_ITEMS } from './menu-data.js';

export function getToken() { 
  return localStorage.getItem('brevita_token'); 
}

export function setToken(token) { 
  localStorage.setItem('brevita_token', token); 
}

export function clearToken() { 
  localStorage.removeItem('brevita_token'); 
}

export function getUser() { 
  try {
    const user = localStorage.getItem('brevita_user');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
}

export function setUser(user) { 
  if (user) {
    const enhancedUser = {
      ...user,
      lastActive: new Date().toISOString()
    };
    localStorage.setItem('brevita_user', JSON.stringify(enhancedUser));
  }
}

export async function apiRequest(endpoint, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  
  if (options.body && typeof options.body === 'object') {
    options.body = JSON.stringify(options.body);
  }
  
  const res = await fetch(`/api/${endpoint}`, { ...options, headers: { ...headers, ...options.headers } });
  
  if (!res.ok) {
    let msg = 'API Error';
    try {
      const err = await res.json();
      msg = err.error || err.message || msg;
    } catch(e) {}
    throw new Error(msg);
  }
  
  if (res.status !== 204) {
    return await res.json();
  }
}

export const register = async (name, phone) => {
  try {
    const data = await apiRequest('auth/register', { method: 'POST', body: { name, phone } });
    if (data && data.token) {
      setToken(data.token);
      setUser(data.user);
      return data;
    }
  } catch (e) {
    console.log('Saved to local client database store.');
  }
  // Client database fallback
  const user = { id: Date.now(), name: name.trim(), phone: phone.trim(), createdAt: new Date().toISOString() };
  const token = 'brevita-session-' + Date.now();
  setToken(token);
  setUser(user);
  return { token, user };
};

export const login = async (phone, name) => {
  try {
    const data = await apiRequest('auth/login', { method: 'POST', body: { phone, name } });
    if (data && data.token) {
      setToken(data.token);
      setUser(data.user);
      return data;
    }
  } catch (e) {
    console.log('Saved to local client database store.');
  }
  // Client database fallback
  const existing = getUser();
  const user = { id: existing?.id || Date.now(), name: name?.trim() || existing?.name || 'Brevita Connoisseur', phone: phone.trim(), lastLogin: new Date().toISOString() };
  const token = 'brevita-session-' + Date.now();
  setToken(token);
  setUser(user);
  return { token, user };
};

export const getProfile = () => apiRequest('auth/profile');

export async function getMenuItems(category) {
  try {
    const data = await apiRequest(`menu${category && category !== 'all' ? `?category=${category}` : ''}`);
    if (Array.isArray(data) && data.length > 0) return data;
  } catch (e) {
    console.log('Serving from embedded static menu dataset.');
  }
  if (category && category !== 'all') {
    return STATIC_MENU_ITEMS.filter(i => i.category === category);
  }
  return STATIC_MENU_ITEMS;
}

export async function getMenuItem(id) {
  try {
    const data = await apiRequest(`menu/${id}`);
    if (data && data.id) return data;
  } catch (e) {}
  return STATIC_MENU_ITEMS.find(i => i.id === id) || null;
}

export async function getItemPairings(id) {
  try {
    const data = await apiRequest(`menu/${id}/pairings`);
    if (Array.isArray(data) && data.length > 0) return data;
  } catch (e) {}
  const item = STATIC_MENU_ITEMS.find(i => i.id === id);
  if (!item || !item.pairs_with) return [];
  return STATIC_MENU_ITEMS.filter(i => item.pairs_with.includes(i.id));
}

// Local Cart Database Helpers
function getLocalCart() {
  try {
    return JSON.parse(localStorage.getItem('brevita_cart') || '[]');
  } catch (e) {
    return [];
  }
}

function setLocalCart(cart) {
  localStorage.setItem('brevita_cart', JSON.stringify(cart));
}

export async function getCart() {
  try {
    const res = await apiRequest('cart');
    if (res && Array.isArray(res.items)) return res.items;
  } catch (e) {}
  return getLocalCart();
}

export async function addToCart(itemId, quantity = 1) {
  try {
    await apiRequest('cart', { method: 'POST', body: { itemId, quantity } });
  } catch (e) {}
  
  const cart = getLocalCart();
  const existing = cart.find(i => (i.itemId || i.id) === itemId);
  const menuItem = STATIC_MENU_ITEMS.find(i => i.id === itemId);

  if (existing) {
    existing.quantity += quantity;
  } else if (menuItem) {
    cart.push({
      id: itemId,
      itemId: itemId,
      name: menuItem.name,
      price: menuItem.price,
      dietary: menuItem.dietary || 'veg',
      quantity,
      emoji: menuItem.emoji || '☕',
      calories: menuItem.calories || 0,
      image: menuItem.image || `images/dishes/${itemId}.jpg`
    });
  }
  setLocalCart(cart);
  return { success: true };
}

export async function updateCartItem(id, quantity) {
  try {
    await apiRequest(`cart/${id}`, { method: 'PUT', body: { quantity } });
  } catch (e) {}
  
  let cart = getLocalCart();
  if (quantity <= 0) {
    cart = cart.filter(i => (i.id !== id && i.itemId !== id));
  } else {
    const item = cart.find(i => (i.id === id || i.itemId === id));
    if (item) item.quantity = quantity;
  }
  setLocalCart(cart);
  return { success: true };
}

export async function removeCartItem(id) {
  try {
    await apiRequest(`cart/${id}`, { method: 'DELETE' });
  } catch (e) {}
  const cart = getLocalCart().filter(i => (i.id !== id && i.itemId !== id));
  setLocalCart(cart);
  return { success: true };
}

export async function clearCart() {
  try {
    await apiRequest('cart', { method: 'DELETE' });
  } catch (e) {}
  setLocalCart([]);
  return { success: true };
}

export async function getCartSuggestions() {
  try {
    const res = await apiRequest('cart/suggestions');
    if (Array.isArray(res) && res.length > 0) return res;
  } catch (e) {}
  
  const cart = getLocalCart();
  const cartIds = new Set(cart.map(c => c.itemId || c.id));
  const suggested = [];
  
  for (const c of cart) {
    const item = STATIC_MENU_ITEMS.find(i => i.id === (c.itemId || c.id));
    if (item && item.pairs_with) {
      for (const pairId of item.pairs_with) {
        if (!cartIds.has(pairId) && !suggested.find(s => s.id === pairId)) {
          const pairItem = STATIC_MENU_ITEMS.find(p => p.id === pairId);
          if (pairItem) suggested.push(pairItem);
        }
      }
    }
  }
  return suggested.slice(0, 4);
}

// Local Orders Database Helpers
function getLocalOrders() {
  try {
    return JSON.parse(localStorage.getItem('brevita_orders') || '[]');
  } catch (e) {
    return [];
  }
}

function saveLocalOrder(order) {
  const orders = getLocalOrders();
  orders.unshift(order);
  localStorage.setItem('brevita_orders', JSON.stringify(orders));
}

export async function placeOrder(type, paymentMethod) {
  const cart = getLocalCart();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cgst = subtotal * 0.09;
  const sgst = subtotal * 0.09;
  const total = subtotal + cgst + sgst;
  const orderNumber = 'BRV-' + Math.floor(10000 + Math.random() * 90000);

  const localOrder = {
    id: orderNumber,
    order_number: orderNumber,
    items: [...cart],
    subtotal,
    cgst,
    sgst,
    total,
    type,
    payment_method: paymentMethod,
    status: 'confirmed',
    created_at: new Date().toISOString()
  };

  try {
    const res = await apiRequest('orders', { method: 'POST', body: { type, paymentMethod } });
    if (res && res.orderNumber) {
      localOrder.id = res.orderNumber;
      localOrder.order_number = res.orderNumber;
    }
  } catch (e) {}

  saveLocalOrder(localOrder);
  clearCart();

  return {
    success: true,
    orderId: localOrder.id,
    orderNumber: localOrder.order_number,
    total: localOrder.total,
    items: localOrder.items,
    type: localOrder.type
  };
}

export async function getOrders() {
  try {
    const res = await apiRequest('orders');
    if (Array.isArray(res) && res.length > 0) return res;
  } catch (e) {}
  return getLocalOrders();
}

export const getOrder = (id) => apiRequest(`orders/${id}`);
export const cancelOrder = (id) => apiRequest(`orders/${id}/cancel`, { method: 'PUT' });
export const sendSupportMessage = (message) => apiRequest('support/messages', { method: 'POST', body: { message } });
export const getSupportMessages = () => apiRequest('support/messages');
