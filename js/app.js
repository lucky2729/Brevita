import gsap from 'gsap';

import { initScrollTimeline } from './scroll-timeline.js';
import { initIntro } from './intro.js';
import { initGreeting } from './greeting.js';

// Feature modules
import { initMenu } from './menu.js';
import { initItemDetail } from './item-detail.js';
import { initCart } from './cart.js';
import { initCheckout } from './checkout.js';
import { initOrder } from './order.js';
import { initSupport } from './support.js';
import { initLocations } from './locations.js';
import { initProfile } from './profile.js';

initIntro(() => {
  const mainApp = document.getElementById('main-app');
  if (mainApp) mainApp.style.display = 'block';
  
  // Initialize all modules
  initGreeting();
  initScrollTimeline();
  initMenu();
  initItemDetail();
  initCart();
  initCheckout();
  initOrder();
  initSupport();
  initLocations();
  initProfile();
  
  // Initialize Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  } else {
    setTimeout(() => { if (window.lucide) lucide.createIcons(); }, 300);
  }
});
