export function getToken() { return localStorage.getItem('brevita_token'); }
export function setToken(token) { localStorage.setItem('brevita_token', token); }
export function clearToken() { localStorage.removeItem('brevita_token'); }

export function getUser() { 
  const user = localStorage.getItem('brevita_user');
  return user ? JSON.parse(user) : null;
}
export function setUser(user) { localStorage.setItem('brevita_user', JSON.stringify(user)); }

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

export const register = (name, phone) => apiRequest('auth/register', { method: 'POST', body: { name, phone } });
export const login = (phone) => apiRequest('auth/login', { method: 'POST', body: { phone } });
export const getProfile = () => apiRequest('auth/profile');
export const getMenuItems = (category) => apiRequest(`menu${category && category !== 'all' ? `?category=${category}` : ''}`);
export const getMenuItem = (id) => apiRequest(`menu/${id}`);
export const getItemPairings = (id) => apiRequest(`menu/${id}/pairings`);
export const getCart = () => apiRequest('cart');
export const addToCart = (itemId, quantity) => apiRequest('cart', { method: 'POST', body: { itemId, quantity } });
export const updateCartItem = (id, quantity) => apiRequest(`cart/${id}`, { method: 'PUT', body: { quantity } });
export const removeCartItem = (id) => apiRequest(`cart/${id}`, { method: 'DELETE' });
export const clearCart = () => apiRequest('cart', { method: 'DELETE' });
export const getCartSuggestions = () => apiRequest('cart/suggestions');
export const placeOrder = (type, paymentMethod) => apiRequest('orders', { method: 'POST', body: { type, paymentMethod } });
export const getOrders = () => apiRequest('orders');
export const getOrder = (id) => apiRequest(`orders/${id}`);
export const cancelOrder = (id) => apiRequest(`orders/${id}/cancel`, { method: 'PUT' });
export const sendSupportMessage = (message) => apiRequest('support/messages', { method: 'POST', body: { message } });
export const getSupportMessages = () => apiRequest('support/messages');
