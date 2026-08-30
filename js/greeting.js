import { getUser } from './api.js';

export function initGreeting() {
  updateUserGreetings();
}

export function updateUserGreetings() {
  const hour = new Date().getHours();
  let greeting = 'Good Night 🌙';
  if (hour < 12) greeting = 'Good Morning ☀️';
  else if (hour < 17) greeting = 'Good Afternoon 🌤️';
  else if (hour < 21) greeting = 'Good Evening 🌅';
  
  const user = getUser() || { name: 'Guest', phone: '' };
  
  // Center main page hero greeting
  const heroGreetingEl = document.getElementById('hero-greeting-text');
  if (heroGreetingEl) {
    heroGreetingEl.textContent = `Hi, ${user.name}! ${greeting}`;
  }

  // Navbar greeting & user label
  const navGreetingEl = document.getElementById('nav-greeting-text');
  if (navGreetingEl) {
    navGreetingEl.textContent = `Hi, ${user.name}! ${greeting}`;
  }

  const navUserLabel = document.getElementById('nav-user-label');
  if (navUserLabel) {
    navUserLabel.textContent = user.name && user.name !== 'Guest' ? user.name : 'Sign In / Account';
  }

  // Auth modal profile elements
  const authUserName = document.getElementById('auth-user-name');
  if (authUserName) authUserName.textContent = `Welcome back, ${user.name}`;

  const authUserPhone = document.getElementById('auth-user-phone');
  if (authUserPhone) authUserPhone.textContent = user.phone ? `📱 ${user.phone}` : '';

  const authAvatarLarge = document.getElementById('auth-avatar-large');
  if (authAvatarLarge && user.name) {
    const parts = user.name.trim().split(' ');
    let initials = parts[0][0];
    if (parts.length > 1) initials += parts[parts.length - 1][0];
    authAvatarLarge.textContent = initials.toUpperCase();
  }
}
