/**
 * BRIGHT ENGINEERING - Main Entry Point
 * Pure Vanilla JavaScript Architecture (Zero Dependencies)
 * 
 * Imports and initializes navigation, product filtering, and enquiry systems.
 */

import { initNavigation } from './navigation.js';
import { initProductFilter } from './product-filter.js';
import { initEnquiry } from './enquiry.js';

function init() {
  initNavigation();
  initProductFilter();
  initEnquiry();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Support componentsLoaded event for backward compatibility
document.addEventListener('componentsLoaded', init);
