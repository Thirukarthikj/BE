/**
 * BRIGHT ENGINEERING - Navigation Module
 * Handles: Sticky header elevation, active page detection, mobile drawer, shop dropdown
 */

export function initNavigation() {
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');

  // --- 1. DETECT ACTIVE PAGE FOR MULTI-PAGE NAV ---
  function syncActiveNav() {
    const rawPath = window.location.pathname.toLowerCase();
    const cleanPath = decodeURIComponent(rawPath);
    
    // Normalize path to get the page file name (e.g. "products.html", "about.html", "index.html")
    let pageName = cleanPath.substring(cleanPath.lastIndexOf('/') + 1);
    if (!pageName || pageName === '' || pageName === 'index.html') {
      pageName = 'index.html';
    }

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const targetPage = href.split('?')[0].split('#')[0].toLowerCase();

      if (targetPage === pageName || (pageName === 'index.html' && (targetPage === 'index.html' || targetPage === ''))) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });

    mobileLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const targetPage = href.split('?')[0].split('#')[0].toLowerCase();

      if (targetPage === pageName || (pageName === 'index.html' && (targetPage === 'index.html' || targetPage === ''))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  syncActiveNav();

  // --- 2. SHOP DROPDOWN CLICK TOGGLE ---
  const shopDropdownBtn = document.getElementById('shopDropdownBtn');
  const shopDropdownItem = document.querySelector('.nav-dropdown-item');
  if (shopDropdownBtn && shopDropdownItem) {
    shopDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = shopDropdownItem.classList.contains('open');
      shopDropdownItem.classList.toggle('open');
      shopDropdownBtn.setAttribute('aria-expanded', !isOpen);
    });

    document.addEventListener('click', (e) => {
      if (!shopDropdownItem.contains(e.target)) {
        shopDropdownItem.classList.remove('open');
        shopDropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- 3. SCROLL LISTENER (Header shadow & Scroll-to-top button) ---
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header elevation on scroll
    if (header) {
      if (scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Scroll To Top Button visibility
    if (scrollToTopBtn) {
      if (scrollY > 400) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    }
  });

  // --- 4. MOBILE MENU DRAWER & SCROLL LOCK ---
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileNavDrawer');
  const hamburgerIcon = document.getElementById('hamburgerIcon');
  let mobileBackdrop = document.getElementById('mobileNavBackdrop');

  // Create backdrop if not already in DOM
  if (!mobileBackdrop && mobileDrawer) {
    mobileBackdrop = document.createElement('div');
    mobileBackdrop.id = 'mobileNavBackdrop';
    mobileBackdrop.className = 'mobile-nav-backdrop';
    mobileDrawer.parentNode.insertBefore(mobileBackdrop, mobileDrawer.nextSibling);
  }

  function openMobileMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    if (mobileBackdrop) mobileBackdrop.classList.add('open');
    document.body.classList.add('menu-open');
    document.documentElement.classList.add('menu-open');
    if (hamburgerIcon) hamburgerIcon.textContent = 'close';
    if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    if (mobileBackdrop) mobileBackdrop.classList.remove('open');
    document.body.classList.remove('menu-open');
    document.documentElement.classList.remove('menu-open');
    if (hamburgerIcon) hamburgerIcon.textContent = 'menu';
    if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
  }

  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    if (mobileBackdrop) {
      mobileBackdrop.addEventListener('click', () => {
        closeMobileMenu();
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMobileMenu();
      }
    });

    // Close if clicked outside drawer and hamburger
    document.addEventListener('click', (e) => {
      if (mobileDrawer.classList.contains('open') && 
          !mobileDrawer.contains(e.target) && 
          !hamburgerBtn.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Restore scroll and close drawer on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && mobileDrawer.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  window.closeShopDropdown = function() {
    if (shopDropdownItem) {
      shopDropdownItem.classList.remove('open');
    }
  };
}
