/**
 * BRIGHT ENGINEERING - Component Loader
 * Loads HTML partial files from /components/ into their respective slots.
 * After all partials are loaded, dispatches 'componentsLoaded' event
 * so main.js can safely initialize interactive behaviors.
 */

(function () {
  'use strict';

  // Map of container ID -> partial file path
  const componentMap = [
    { id: 'component-header',       file: 'components/header.html' },
    { id: 'component-hero',         file: 'components/hero.html' },
    { id: 'component-trust-strip',  file: 'components/trust-strip.html' },
    { id: 'component-about',        file: 'components/about.html' },
    { id: 'component-search',       file: 'components/search.html' },
    { id: 'component-categories',   file: 'components/categories.html' },
    { id: 'component-products',     file: 'components/products.html' },
    { id: 'component-brands',       file: 'components/brands.html' },
    { id: 'component-machines',     file: 'components/machines.html' },
    { id: 'component-identify',     file: 'components/identify.html' },
    { id: 'component-why',          file: 'components/why.html' },
    { id: 'component-applications', file: 'components/applications.html' },
    { id: 'component-how-to-order', file: 'components/how-to-order.html' },
    { id: 'component-delivery',     file: 'components/delivery.html' },
    { id: 'component-cta',          file: 'components/cta.html' },
    { id: 'component-contact',      file: 'components/contact.html' },
    { id: 'component-footer',       file: 'components/footer.html' },
    { id: 'component-mobile-bar',   file: 'components/mobile-bar.html' },
  ];

  /**
   * Fetch a single HTML partial and inject it into the target container.
   * Returns a Promise that resolves when the content is loaded.
   */
  function loadComponent(id, filePath) {
    return fetch(filePath)
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Failed to load ' + filePath + ': ' + response.status);
        }
        return response.text();
      })
      .then(function (html) {
        var container = document.getElementById(id);
        if (container) {
          container.outerHTML = html;
        }
      })
      .catch(function (err) {
        console.error('[Loader]', err.message);
      });
  }

  /**
   * Load all components sequentially (preserving DOM order)
   * then fire the 'componentsLoaded' event.
   */
  function loadAllComponents() {
    // Use Promise.all for parallel loading (faster) since
    // DOM order is already set by the slot positions in index.html.
    var promises = componentMap.map(function (comp) {
      return loadComponent(comp.id, comp.file);
    });

    Promise.all(promises).then(function () {
      // Signal that all components are ready
      document.dispatchEvent(new Event('componentsLoaded'));
    });
  }

  // Start loading as soon as the DOM structure is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllComponents);
  } else {
    loadAllComponents();
  }
})();
