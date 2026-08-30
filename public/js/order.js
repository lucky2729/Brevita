import gsap from 'gsap';

export function initOrder() {
  document.getElementById('back-to-menu-btn')?.addEventListener('click', hideOrderConfirmation);
}

export function showOrderConfirmation(orderData) {
  const section = document.getElementById('order-confirmation');
  if (!section) return;
  
  section.style.display = 'flex';
  
  const numEl = document.getElementById('order-number');
  const etaEl = document.getElementById('order-eta');
  const summaryMini = document.getElementById('order-summary-mini');

  if (numEl) numEl.textContent = `Order #${orderData.id || 'BRV-10293'}`;
  if (etaEl) etaEl.textContent = `Estimated ${orderData.type === 'dine-in' ? 'served tableside' : 'ready for pickup'} in 15-20 minutes`;
  
  if (summaryMini && orderData.items && orderData.items.length > 0) {
    let itemsHtml = orderData.items.map(item => `
      <div style="display:flex; justify-content:space-between; padding:0.3rem 0; font-size:0.9rem; color:var(--text-secondary);">
        <span>${item.quantity}x ${item.name}</span>
        <span style="color:var(--text-primary);">$${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `).join('');

    summaryMini.innerHTML = `
      <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(212,175,55,0.2); border-radius:16px; padding:1.2rem; margin:1.5rem 0; text-align:left;">
        <div style="margin-bottom:0.8rem;">${itemsHtml}</div>
        <div style="border-top:1px dashed rgba(212,175,55,0.2); margin:0.6rem 0;"></div>
        <div style="display:flex; justify-content:space-between; font-weight:600; color:var(--gold-accent); font-size:1.1rem;">
          <span>Total Paid</span>
          <span>$${(orderData.totalAmount || 0).toFixed(2)}</span>
        </div>
      </div>
    `;
  }
  
  gsap.fromTo(section, 
    { opacity: 0 }, 
    { opacity: 1, duration: 0.4 }
  );
  
  gsap.fromTo('.confirmation-container',
    { y: 30, opacity: 0, scale: 0.95 },
    { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)' }
  );
}

function hideOrderConfirmation() {
  const section = document.getElementById('order-confirmation');
  if (!section) return;

  gsap.to(section, {
    opacity: 0,
    duration: 0.3,
    onComplete: () => {
      section.style.display = 'none';
      const menuSec = document.getElementById('menu-section');
      if (menuSec) {
        menuSec.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
}
