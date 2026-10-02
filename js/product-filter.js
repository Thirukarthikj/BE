/**
 * BRIGHT ENGINEERING - Product Search & Filter Module
 * Handles: Search input, category filters, tab chips, quick search, URL query parsing
 */

import { showToast } from './toast.js';

export function initProductFilter() {
  const searchInput = document.getElementById('partSearchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const brandFilter = document.getElementById('brandFilter');
  const categoryTabBtns = document.querySelectorAll('.category-tab-btn');
  let currentActiveCategory = 'All';

  // Global Filter Function
  function filterProducts() {
    const featuredCards = document.querySelectorAll('.featured-card');
    if (!featuredCards.length) return;

    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedCat = categoryFilter ? categoryFilter.value.toLowerCase().trim() : '';
    const selectedBrand = brandFilter ? brandFilter.value.toLowerCase().trim() : '';

    let matchedCount = 0;

    featuredCards.forEach(card => {
      const title = (card.querySelector('.featured-title')?.textContent || '').toLowerCase();
      const tag = (card.querySelector('.featured-tag')?.textContent || '').toLowerCase();
      const partNo = (card.querySelector('.featured-part-no')?.textContent || '').toLowerCase();
      const cardCat = (card.getAttribute('data-category') || '').toLowerCase();
      const cardBrand = (card.getAttribute('data-brand') || '').toLowerCase();
      const cardCompat = (card.querySelector('.product-compat-info')?.textContent || '').toLowerCase();
      const allText = `${title} ${tag} ${partNo} ${cardCat} ${cardBrand} ${cardCompat}`;

      // Tab filter check
      let matchesTab = true;
      if (currentActiveCategory && currentActiveCategory !== 'All') {
        const targetTab = currentActiveCategory.toLowerCase();
        matchesTab = cardCat.includes(targetTab) || cardBrand.includes(targetTab) || allText.includes(targetTab);
      }

      const matchesQuery = !query || allText.includes(query);
      const matchesDropdownCat = !selectedCat || cardCat.includes(selectedCat) || allText.includes(selectedCat);
      const matchesDropdownBrand = !selectedBrand || cardBrand.includes(selectedBrand) || allText.includes(selectedBrand);

      if (matchesTab && matchesQuery && matchesDropdownCat && matchesDropdownBrand) {
        card.style.display = 'flex';
        matchedCount++;
      } else {
        card.style.display = 'none';
      }
    });

    const searchCountEl = document.getElementById('searchCountBadge');
    if (searchCountEl) {
      if (query || selectedCat || selectedBrand || currentActiveCategory !== 'All') {
        searchCountEl.textContent = `Showing ${matchedCount} component${matchedCount === 1 ? '' : 's'}`;
        searchCountEl.style.display = 'inline-block';
      } else {
        searchCountEl.style.display = 'none';
      }
    }

    const catalogCountBadge = document.getElementById('catalogCountBadge');
    if (catalogCountBadge) {
      catalogCountBadge.textContent = `${matchedCount} Parts Available`;
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterProducts);
  }
  if (categoryFilter) {
    categoryFilter.addEventListener('change', () => {
      currentActiveCategory = categoryFilter.value || 'All';
      syncActiveTab(currentActiveCategory);
      filterProducts();
    });
  }
  if (brandFilter) {
    brandFilter.addEventListener('change', filterProducts);
  }

  function syncActiveTab(catName) {
    categoryTabBtns.forEach(btn => {
      const btnCat = btn.getAttribute('data-category') || 'All';
      if (btnCat.toLowerCase() === catName.toLowerCase() || (catName === '' && btnCat === 'All')) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Category Tab Click Handler
  window.filterByCategoryTab = function(catName) {
    currentActiveCategory = catName;
    syncActiveTab(catName);

    if (categoryFilter) {
      categoryFilter.value = catName === 'All' ? '' : catName;
    }

    filterProducts();
    showToast(catName === 'All' ? 'Showing all components' : `Category: ${catName}`);
  };

  // Global Category filter (works on products.html or redirects from other pages)
  window.filterByCategory = function(catName) {
    const isProductsPage = window.location.pathname.toLowerCase().endsWith('products.html') || document.querySelector('.featured-card');

    if (isProductsPage) {
      currentActiveCategory = catName;
      syncActiveTab(catName);

      if (categoryFilter) {
        let found = false;
        for (let i = 0; i < categoryFilter.options.length; i++) {
          if (categoryFilter.options[i].text.toLowerCase().includes(catName.toLowerCase()) || 
              categoryFilter.options[i].value.toLowerCase().includes(catName.toLowerCase())) {
            categoryFilter.selectedIndex = i;
            found = true;
            break;
          }
        }
        if (!found) {
          categoryFilter.value = '';
        }
      }

      filterProducts();

      // Smooth scroll to catalog section
      const catalogSection = document.getElementById('products-catalog') || document.getElementById('products');
      if (catalogSection) {
        const headerOffset = 80;
        const elementPosition = catalogSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }

      showToast(`Category: ${catName}`);
    } else {
      // Redirect to products.html with query parameter
      window.location.href = `products.html?category=${encodeURIComponent(catName)}`;
    }
  };

  window.quickSearch = function(term) {
    const isProductsPage = window.location.pathname.toLowerCase().endsWith('products.html') || document.querySelector('.featured-card');
    if (isProductsPage) {
      if (searchInput) {
        searchInput.value = term;
        filterProducts();
        searchInput.focus();
        showToast(`Searching for: ${term}`);
      }
    } else {
      window.location.href = `products.html?search=${encodeURIComponent(term)}`;
    }
  };

  // --- PARSE URL SEARCH PARAMS ON PAGE LOAD ---
  const urlParams = new URLSearchParams(window.location.search);
  const paramCategory = urlParams.get('category');
  const paramSearch = urlParams.get('search');
  const paramBrand = urlParams.get('brand');

  if (paramCategory) {
    setTimeout(() => {
      window.filterByCategory(paramCategory);
    }, 50);
  } else if (paramSearch) {
    setTimeout(() => {
      window.quickSearch(paramSearch);
    }, 50);
  } else if (paramBrand) {
    if (brandFilter) {
      brandFilter.value = paramBrand;
      filterProducts();
    }
  }
}
