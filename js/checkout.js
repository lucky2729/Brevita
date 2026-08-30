import { getCart, placeOrder } from './api.js';
import { closeCart, refreshCart } from './cart.js';
import { showOrderConfirmation } from './order.js';
import { fadeIn, fadeOut } from './transitions.js';

let selectedType = null;
let selectedPayment = null;
let currentCart = [];

export function initCheckout() {
  document.querySelectorAll('.type-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.type-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedType = card.dataset.type;
    });
  });
  
  document.querySelectorAll('.payment-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedPayment = card.dataset.method;
    });
  });
  
  document.getElementById('place-order-btn')?.addEventListener('click', validateAndPlaceOrder);
  document.getElementById('close-checkout-btn')?.addEventListener('click', hideCheckout);
}

export async function showCheckout() {
  closeCart();
  const res = await getCart();
  const items = Array.isArray(res) ? res : (res?.items || []);
  
  if (!items || items.length === 0) {
    alert('Your cart is empty! Please add some dishes from the menu first.');
    return;
  }

  currentCart = items;
  selectedType = null;
  selectedPayment = null;
  document.querySelectorAll('.type-card, .payment-card').forEach(c => c.classList.remove('selected'));
  
  renderBillingReceipt();
  
  const section = document.getElementById('checkout-section');
  if (section) {
    section.style.display = 'block';
    fadeIn(section);
  }
}

export function hideCheckout() {
  const section = document.getElementById('checkout-section');
  if (section) {
    fadeOut(section, {
      onComplete: () => {
        section.style.display = 'none';
      }
    });
  }
}

function renderBillingReceipt() {
  const billingContainer = document.getElementById('billing-details');
  if (!billingContainer) return;
  
  let subtotal = 0;
  let itemsHtml = '';

  currentCart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    const isVeg = (item.dietary || 'veg').toLowerCase() === 'veg';
    itemsHtml += `
      <div class="billing-item" style="display:flex; justify-content:space-between; align-items:center; padding:0.4rem 0; font-size:0.92rem;">
        <span class="billing-label" style="color:var(--text-secondary); display:flex; align-items:center; gap:6px;">
          <span class="dietary-symbol ${isVeg ? 'veg' : 'non-veg'}"></span>
          ${item.quantity}x ${item.name}
        </span>
        <span class="billing-value" style="color:var(--text-primary); font-weight:500;">$${itemTotal.toFixed(2)}</span>
      </div>
    `;
  });
  
  const cgst = subtotal * 0.09;
  const sgst = subtotal * 0.09;
  const total = subtotal + cgst + sgst;
  
  billingContainer.innerHTML = `
    <div class="billing-receipt" style="background:rgba(255,255,255,0.03); border:1px solid rgba(212,175,55,0.15); border-radius:16px; padding:1.4rem; margin:1rem 0;">
      <div class="billing-items-list" style="margin-bottom:1rem;">
        ${itemsHtml}
      </div>
      <div style="border-top:1px dashed rgba(212,175,55,0.2); margin:0.8rem 0;"></div>
      <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem; font-size:0.88rem; color:var(--text-secondary);">
        <span>Subtotal</span>
        <span>$${subtotal.toFixed(2)}</span>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:0.3rem; font-size:0.88rem; color:var(--text-secondary);">
        <span>CGST (9%)</span>
        <span>$${cgst.toFixed(2)}</span>
      </div>
      <div style="display:flex; justify-content:space-between; margin-bottom:0.8rem; font-size:0.88rem; color:var(--text-secondary);">
        <span>SGST (9%)</span>
        <span>$${sgst.toFixed(2)}</span>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:1.2rem; font-weight:600; color:var(--gold-accent); border-top:1px solid rgba(212,175,55,0.25); padding-top:0.6rem;">
        <span>Total Amount</span>
        <span>$${total.toFixed(2)}</span>
      </div>
    </div>
  `;
}

async function validateAndPlaceOrder() {
  if (!selectedType || !selectedPayment) {
    alert('Please select both your order type (Dine-In or Takeaway) and your payment method.');
    return;
  }
  
  const btn = document.getElementById('place-order-btn');
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Processing Order...';
  }
  
  try {
    const result = await placeOrder(selectedType, selectedPayment);
    if (result.success) {
      const confirmedCart = [...currentCart];
      hideCheckout();
      await refreshCart();
      showOrderConfirmation({
        id: result.orderNumber || (result.orderId ? `BRV-${result.orderId}` : 'BRV-98721'),
        type: selectedType,
        totalAmount: result.total,
        items: confirmedCart
      });
    }
  } catch (error) {
    console.error('Order failed:', error);
    alert('Failed to place order: ' + (error.message || 'Please try again.'));
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Place Order →';
    }
  }
}
