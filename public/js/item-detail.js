import { getMenuItem, getItemPairings } from './api.js';
import gsap from 'gsap';
import { addItemToCart } from './cart.js';

let currentItem = null;
let currentQuantity = 1;

export function initItemDetail() {
  window.showItemDetail = showItemDetail;
  
  const modal = document.getElementById('item-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeItemDetail();
    });
  }
  
  if (closeBtn) closeBtn.addEventListener('click', closeItemDetail);
  
  document.getElementById('modal-qty-plus')?.addEventListener('click', () => updateQuantity(1));
  document.getElementById('modal-qty-minus')?.addEventListener('click', () => updateQuantity(-1));
  document.getElementById('modal-add-btn')?.addEventListener('click', handleAddToCart);

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
      closeItemDetail();
    }
  });
}

export async function showItemDetail(itemId) {
  try {
    const item = await getMenuItem(itemId);
    if (!item) return;
    
    currentItem = item;
    currentQuantity = 1;
    updateQuantityDisplay();
    
    // Set Item info
    const nameEl = document.getElementById('modal-item-name');
    const descEl = document.getElementById('modal-item-desc');
    const priceEl = document.getElementById('modal-price');
    const calEl = document.getElementById('modal-cal');
    const catEl = document.getElementById('modal-category');
    const imgEl = document.getElementById('modal-img');

    if (nameEl) nameEl.textContent = item.name;
    if (descEl) descEl.textContent = item.description;
    if (priceEl) priceEl.textContent = `$${Number(item.price).toFixed(2)}`;
    if (calEl) calEl.textContent = item.calories;
    if (catEl) catEl.textContent = item.category.replace(/-/g, ' ');
    
    const cuisineEl = document.getElementById('modal-cuisine');
    if (cuisineEl) cuisineEl.textContent = item.cuisine || 'Global';

    const dietaryEl = document.getElementById('modal-dietary-badge');
    if (dietaryEl) {
      const isVeg = (item.dietary || 'veg').toLowerCase() === 'veg';
      dietaryEl.className = `modal-dietary-badge ${isVeg ? 'veg' : 'non-veg'}`;
      dietaryEl.innerHTML = `<span class="dietary-symbol ${isVeg ? 'veg' : 'non-veg'}"></span> ${isVeg ? 'Pure Veg' : 'Non-Veg'}`;
    }

    const defaultImg = 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&auto=format&fit=crop&q=80';
    if (imgEl) {
      imgEl.src = item.image || defaultImg;
      imgEl.onerror = () => { imgEl.src = defaultImg; };
    }

    // Ingredients pills
    const ingredientsContainer = document.getElementById('modal-ingredients');
    if (ingredientsContainer) {
      ingredientsContainer.innerHTML = '';
      if (item.ingredients && item.ingredients.length > 0) {
        item.ingredients.forEach(ing => {
          const pill = document.createElement('span');
          pill.className = 'ingredient-pill';
          pill.textContent = ing;
          ingredientsContainer.appendChild(pill);
        });
      } else {
        ingredientsContainer.innerHTML = '<span class="ingredient-pill">Master Roaster Blend</span>';
      }
    }

    // Pairings section
    const pairingsSec = document.getElementById('modal-pairings-section');
    const pairingsContainer = document.getElementById('modal-pairings');
    if (pairingsSec && pairingsContainer) {
      try {
        const pairings = await getItemPairings(itemId);
        if (pairings && pairings.length > 0) {
          pairingsContainer.innerHTML = '';
          pairings.forEach(p => {
            const card = document.createElement('div');
            card.className = 'pairing-card-mini';
            card.innerHTML = `
              <img src="${p.image || defaultImg}" alt="${p.name}" class="pairing-img-mini" onerror="this.src='${defaultImg}'">
              <div>
                <div class="pairing-name-mini">${p.name}</div>
                <div class="pairing-price-mini">$${p.price.toFixed(2)}</div>
              </div>
            `;
            card.addEventListener('click', () => showItemDetail(p.id));
            pairingsContainer.appendChild(card);
          });
          pairingsSec.style.display = 'block';
        } else {
          pairingsSec.style.display = 'none';
        }
      } catch (err) {
        pairingsSec.style.display = 'none';
      }
    }
    
    const modal = document.getElementById('item-modal');
    if (modal) {
      modal.style.display = 'flex';
      gsap.fromTo(modal.querySelector('.modal-content'), 
        { scale: 0.85, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
      );
    }
    
  } catch (error) {
    console.error('Error fetching item details:', error);
  }
}

function closeItemDetail() {
  const modal = document.getElementById('item-modal');
  if (!modal) return;

  gsap.to(modal.querySelector('.modal-content'), {
    scale: 0.9, opacity: 0, y: 15, duration: 0.25, ease: 'power2.in',
    onComplete: () => {
      modal.style.display = 'none';
      currentItem = null;
    }
  });
}

function updateQuantity(change) {
  currentQuantity += change;
  if (currentQuantity < 1) currentQuantity = 1;
  if (currentQuantity > 20) currentQuantity = 20;
  updateQuantityDisplay();
}

function updateQuantityDisplay() {
  const display = document.getElementById('modal-qty');
  if (display) display.textContent = currentQuantity;

  const totalBtnPrice = document.getElementById('modal-total-btn-price');
  if (totalBtnPrice && currentItem) {
    totalBtnPrice.textContent = `$${(currentItem.price * currentQuantity).toFixed(2)}`;
  }
}

async function handleAddToCart() {
  if (!currentItem) return;
  const btn = document.getElementById('modal-add-btn');
  if (btn) {
    const origText = btn.innerHTML;
    btn.innerHTML = '✓ Added to Cart!';
    btn.style.background = 'var(--success, #27ae60)';
    setTimeout(() => {
      btn.innerHTML = origText;
      btn.style.background = '';
    }, 1200);
  }
  
  await addItemToCart(currentItem.id, currentQuantity);
  closeItemDetail();
}
