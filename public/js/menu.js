import { getMenuItems } from './api.js';

let allItems = [];
let currentCategory = 'all';
let currentGroup = 'all';
let currentCuisine = 'all';
let currentDietary = 'all';
let currentSearch = '';

const cuisineFlags = {
  'Japan': '🇯🇵 Japan',
  'Turkey': '🇹🇷 Turkey',
  'Korea': '🇰🇷 Korea',
  'Italy': '🇮🇹 Italy',
  'France': '🇫🇷 France',
  'Mexico & Spain': '🇲🇽 Mexico & Spain',
  'India': '🇮🇳 India',
  'Middle East': '🇱🇧 Middle East',
  'USA': '🇺🇸 USA & California',
  'UK': '🇬🇧 United Kingdom',
  'Global': '🌍 Global Cuisine'
};

const categoryMeta = {
  'all': { name: 'All Items', icon: '🍽️', group: 'all' },
  'signature-coffees': { name: 'Signature Coffees & Brews', icon: '☕', group: 'beverages' },
  'teas-infusions': { name: 'Teas, Infusions & Matcha', icon: '🫖', group: 'beverages' },
  'specialty-beverages': { name: 'Mocktails & Specialty Drinks', icon: '🍹', group: 'beverages' },
  'starters-small-plates': { name: 'Starters & Small Plates', icon: '🥑', group: 'food' },
  'sandwiches-wraps': { name: 'Sandwiches & Burgers', icon: '🥪', group: 'food' },
  'pasta-mains': { name: 'Pasta, Steaks & Global Mains', icon: '🍝', group: 'food' },
  'salads': { name: 'Fresh Salads & Bowls', icon: '🥗', group: 'food' },
  'flatbreads-pizzas': { name: 'Flatbreads & Pizzas', icon: '🍕', group: 'food' },
  'cheesecakes': { name: 'Legendary Cheesecakes', icon: '🍰', group: 'desserts' },
  'desserts': { name: 'Artisanal World Desserts', icon: '🍫', group: 'desserts' },
  'ice-cream-sundaes': { name: 'Sundaes, Gelato & Bingsu', icon: '🍨', group: 'desserts' }
};

export async function initMenu() {
  try {
    setupScrollButtons();
    setupFilterHandlers();

    allItems = await getMenuItems();
    
    renderCategoryTabs();
    applyFiltersAndRender();

  } catch (error) {
    console.error('Failed to load menu:', error);
  }
}

function setupScrollButtons() {
  const scrollToMenu = (e) => {
    if (e) e.preventDefault();
    const menuSection = document.getElementById('menu-section');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  document.getElementById('explore-menu-btn')?.addEventListener('click', scrollToMenu);
  document.getElementById('hero-explore-btn')?.addEventListener('click', scrollToMenu);
  document.getElementById('hero-takeaway-btn')?.addEventListener('click', scrollToMenu);
  document.getElementById('hero-scroll-btn')?.addEventListener('click', scrollToMenu);
}

function setupFilterHandlers() {
  // Search input
  const searchInput = document.getElementById('menu-search-input');
  const clearBtn = document.getElementById('clear-search-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim().toLowerCase();
      if (clearBtn) {
        clearBtn.style.display = currentSearch ? 'block' : 'none';
      }
      applyFiltersAndRender();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      currentSearch = '';
      clearBtn.style.display = 'none';
      applyFiltersAndRender();
    });
  }

  // Cuisine Tabs (World Countries)
  document.querySelectorAll('.cuisine-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.cuisine-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCuisine = tab.dataset.cuisine;
      applyFiltersAndRender();
    });
  });

  // Dietary Tabs (Veg / Non-Veg)
  document.querySelectorAll('.dietary-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.dietary-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentDietary = tab.dataset.dietary;
      applyFiltersAndRender();
    });
  });

  // Parent Course Group Tabs
  document.querySelectorAll('.group-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.group-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentGroup = tab.dataset.group;
      currentCategory = 'all';
      renderCategoryTabs();
      applyFiltersAndRender();
    });
  });
}

function renderCategoryTabs() {
  const tabsContainer = document.getElementById('category-tabs');
  if (!tabsContainer) return;
  tabsContainer.innerHTML = '';

  let availableCategories = ['all'];
  const allCatKeys = Object.keys(categoryMeta).filter(k => k !== 'all');

  if (currentGroup === 'all') {
    availableCategories.push(...allCatKeys);
  } else {
    availableCategories.push(...allCatKeys.filter(k => categoryMeta[k].group === currentGroup));
  }

  availableCategories.forEach(catKey => {
    const meta = categoryMeta[catKey] || { name: catKey, icon: '🍽️' };
    const btn = document.createElement('button');
    btn.className = `category-tab ${currentCategory === catKey ? 'active' : ''}`;
    btn.dataset.category = catKey;
    btn.innerHTML = `${meta.icon} ${meta.name}`;
    
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = catKey;
      applyFiltersAndRender();
    });

    tabsContainer.appendChild(btn);
  });
}

function applyFiltersAndRender() {
  let filtered = allItems;

  // Filter by World Cuisine
  if (currentCuisine !== 'all') {
    filtered = filtered.filter(item => item.cuisine === currentCuisine);
  }

  // Filter by Dietary Preference (Veg / Non-Veg)
  if (currentDietary !== 'all') {
    filtered = filtered.filter(item => (item.dietary || 'veg').toLowerCase() === currentDietary);
  }

  // Filter by Course Group if not 'all'
  if (currentGroup !== 'all') {
    filtered = filtered.filter(item => {
      const meta = categoryMeta[item.category];
      return meta && meta.group === currentGroup;
    });
  }

  // Filter by Subcategory if not 'all'
  if (currentCategory !== 'all') {
    filtered = filtered.filter(item => item.category === currentCategory);
  }

  // Filter by Search Query
  if (currentSearch) {
    filtered = filtered.filter(item => {
      const nameMatch = item.name.toLowerCase().includes(currentSearch);
      const descMatch = item.description.toLowerCase().includes(currentSearch);
      const cuisineMatch = (item.cuisine || '').toLowerCase().includes(currentSearch);
      const ingMatch = (item.ingredients || []).some(ing => ing.toLowerCase().includes(currentSearch));
      const tagMatch = (item.tags || []).some(tag => tag.toLowerCase().includes(currentSearch));
      return nameMatch || descMatch || cuisineMatch || ingMatch || tagMatch;
    });
  }

  // Update stats bar
  const countText = document.getElementById('menu-count-text');
  if (countText) {
    const cuisineLabel = currentCuisine === 'all' ? 'worldwide' : (cuisineFlags[currentCuisine] || currentCuisine);
    const dietLabel = currentDietary === 'all' ? '' : (currentDietary === 'veg' ? ' • Pure Veg 🟢' : ' • Non-Veg 🔴');
    countText.textContent = `Showing ${filtered.length} delicious item${filtered.length === 1 ? '' : 's'} from ${cuisineLabel}${dietLabel}`;
  }

  renderMenuGrid(filtered);
}

function renderMenuGrid(items) {
  const grid = document.getElementById('menu-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (items.length === 0) {
    grid.innerHTML = `
      <div class="no-results-msg glass-panel">
        <h3>No dishes found for this selection</h3>
        <p>Try switching dietary preferences, world cuisines, clearing search, or selecting another category.</p>
      </div>
    `;
    return;
  }

  const fragment = document.createDocumentFragment();

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.dataset.id = item.id;
    
    const localImg = `images/dishes/${item.id}.jpg`;
    const cdnImg = `https://raw.githubusercontent.com/lucky2729/Brevita/main/public/images/dishes/${item.id}.jpg`;
    const fallbackFood = 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&auto=format&fit=crop&q=80';
    
    const isVeg = (item.dietary || 'veg').toLowerCase() === 'veg';
    const catName = categoryMeta[item.category]?.name || item.category;
    const cuisineLabel = cuisineFlags[item.cuisine] || item.cuisine || 'Global';
    const desc = item.description.length > 90 ? item.description.substring(0, 90) + '...' : item.description;
    const tagsHtml = (item.tags || []).map(tag => `<span class="tag ${tag}">${tag}</span>`).join('');

    card.innerHTML = `
      <div class="menu-card-img-wrap">
        <img 
          src="${localImg}" 
          alt="${item.name}" 
          loading="lazy" 
          class="menu-card-img" 
          onerror="if(this.src!=='${cdnImg}'){this.src='${cdnImg}';}else{this.src='${fallbackFood}';}"
        >
        <div class="menu-card-img-gradient"></div>
        <span class="menu-card-category-tag">${catName}</span>
        <span class="menu-card-cuisine-tag">${cuisineLabel}</span>
        <span class="menu-card-dietary-tag ${isVeg ? 'veg' : 'non-veg'}" title="${isVeg ? 'Vegetarian' : 'Non-Vegetarian'}">
          <span class="dietary-symbol ${isVeg ? 'veg' : 'non-veg'}"></span>
          ${isVeg ? 'Veg' : 'Non-Veg'}
        </span>
        <span class="menu-card-cal-badge">🔥 ${item.calories} cal</span>
      </div>
      <div class="menu-card-body">
        <h3 class="menu-card-name">${item.name}</h3>
        <p class="menu-card-desc">${desc}</p>
        <div class="menu-card-tags">${tagsHtml}</div>
        <div class="menu-card-footer">
          <span class="menu-card-price">$${Number(item.price).toFixed(2)}</span>
          <button class="card-select-btn" type="button">Select Item →</button>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      if (window.showItemDetail) {
        window.showItemDetail(item.id);
      }
    });

    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
}
