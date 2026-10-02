/**
 * BRIGHT ENGINEERING - Enquiry Module
 * Handles: Part quote requests, WhatsApp links, multi-page redirects, URL param autofill, form submission
 */

import { showToast } from './toast.js';

export function initEnquiry() {

  // --- 1. DYNAMIC ENQUIRY & MULTI-PAGE REDIRECT HELPERS ---
  window.requestPartQuote = function(partName, brandCategory, partNumber) {
    const isContactPage = window.location.pathname.toLowerCase().endsWith('contact.html') || document.getElementById('formPartNumber');

    if (isContactPage) {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }

      setTimeout(() => {
        const machineInput = document.getElementById('formMachineBrand');
        const partInput = document.getElementById('formPartNumber');
        const reqInput = document.getElementById('formRequirement');

        if (partInput && partNumber) partInput.value = partNumber;
        if (machineInput && brandCategory) machineInput.value = brandCategory;
        if (reqInput) {
          reqInput.value = `Requesting quotation, availability and delivery timeline for ${partName}${partNumber ? ' (' + partNumber + ')' : ''}.`;
        }

        const nameInput = document.getElementById('formName');
        if (nameInput) nameInput.focus();
        showToast(`Selected part: ${partName}`);
      }, 300);
    } else {
      // Redirect to contact.html with prefill parameters
      const params = new URLSearchParams({
        part: partName || '',
        brand: brandCategory || '',
        partNumber: partNumber || ''
      });
      window.location.href = `contact.html?${params.toString()}`;
    }
  };

  window.openPartWhatsApp = function(partName, brandCategory, partNumber) {
    const phone = "18004827440";
    const partDetails = `${partName}${partNumber ? ' (Part #' + partNumber + ')' : ''}${brandCategory ? ' - ' + brandCategory : ''}`;
    const message = encodeURIComponent(`Hello Bright Engineering, I would like to inquire about price and availability for: ${partDetails}.`);
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  window.inquireCategory = function(catName) {
    const isContactPage = window.location.pathname.toLowerCase().endsWith('contact.html') || document.getElementById('formPartNumber');
    if (isContactPage) {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
      setTimeout(() => {
        const reqInput = document.getElementById('formRequirement');
        if (reqInput) {
          reqInput.value = `Inquiry regarding category: ${catName}. Please share product catalog and available component stock.`;
        }
        const nameInput = document.getElementById('formName');
        if (nameInput) nameInput.focus();
        showToast(`Category: ${catName}`);
      }, 300);
    } else {
      window.location.href = `contact.html?req=${encodeURIComponent('Inquiry regarding category: ' + catName + '. Please share catalog and component stock.')}`;
    }
  };

  window.inquireBrand = function(brandName) {
    const isContactPage = window.location.pathname.toLowerCase().endsWith('contact.html') || document.getElementById('formMachineBrand');
    if (isContactPage) {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
      setTimeout(() => {
        const machineInput = document.getElementById('formMachineBrand');
        const reqInput = document.getElementById('formRequirement');
        if (machineInput) machineInput.value = brandName;
        if (reqInput) {
          reqInput.value = `Looking for spare parts compatible with ${brandName} machinery.`;
        }
        const nameInput = document.getElementById('formName');
        if (nameInput) nameInput.focus();
        showToast(`Brand selected: ${brandName}`);
      }, 300);
    } else {
      window.location.href = `contact.html?brand=${encodeURIComponent(brandName)}&req=${encodeURIComponent('Looking for spare parts compatible with ' + brandName + ' machinery.')}`;
    }
  };

  window.selectMachineType = function(typeName, brands) {
    const isContactPage = window.location.pathname.toLowerCase().endsWith('contact.html') || document.getElementById('formMachineBrand');
    if (isContactPage) {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
      setTimeout(() => {
        const machineInput = document.getElementById('formMachineBrand');
        const reqInput = document.getElementById('formRequirement');
        if (machineInput) machineInput.value = brands.split(' / ')[0];
        if (reqInput) {
          reqInput.value = `Requirement for ${typeName} machinery (${brands}).`;
        }
        const nameInput = document.getElementById('formName');
        if (nameInput) nameInput.focus();
        showToast(`Selected: ${typeName}`);
      }, 300);
    } else {
      window.location.href = `contact.html?brand=${encodeURIComponent(brands.split(' / ')[0])}&req=${encodeURIComponent('Requirement for ' + typeName + ' machinery (' + brands + ').')}`;
    }
  };

  window.quickEnquiryFocus = function() {
    const isContactPage = window.location.pathname.toLowerCase().endsWith('contact.html') || document.getElementById('formName');
    if (isContactPage) {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
      const nameInput = document.getElementById('formName');
      if (nameInput) {
        setTimeout(() => nameInput.focus(), 300);
      }
    } else {
      window.location.href = 'contact.html';
    }
  };

  // --- 2. URL QUERY AUTOFILL ON CONTACT PAGE LOAD ---
  const urlParams = new URLSearchParams(window.location.search);
  const paramPart = urlParams.get('part');
  const paramBrand = urlParams.get('brand');
  const paramPartNumber = urlParams.get('partNumber');
  const paramReq = urlParams.get('req');

  if (paramPart || paramBrand || paramPartNumber || paramReq) {
    setTimeout(() => {
      const machineInput = document.getElementById('formMachineBrand');
      const partInput = document.getElementById('formPartNumber');
      const reqInput = document.getElementById('formRequirement');

      if (partInput && paramPartNumber) partInput.value = paramPartNumber;
      if (machineInput && paramBrand) machineInput.value = paramBrand;
      if (reqInput) {
        if (paramReq) {
          reqInput.value = paramReq;
        } else if (paramPart) {
          reqInput.value = `Requesting quotation, availability and delivery timeline for ${paramPart}${paramPartNumber ? ' (' + paramPartNumber + ')' : ''}.`;
        }
      }

      const nameInput = document.getElementById('formName');
      if (nameInput) nameInput.focus();

      if (paramPart) {
        showToast(`Quotation inquiry for: ${paramPart}`);
      } else if (paramBrand) {
        showToast(`Inquiry for: ${paramBrand}`);
      }
    }, 150);
  }

  // --- 3. FORM SUBMISSION ---
  const enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('formName')?.value.trim();
      const phone = document.getElementById('formPhone')?.value.trim();
      const email = document.getElementById('formEmail')?.value.trim();
      const machine = document.getElementById('formMachineBrand')?.value.trim();
      const partNo = document.getElementById('formPartNumber')?.value.trim();
      const req = document.getElementById('formRequirement')?.value.trim();

      if (!name || !phone) {
        showToast('Please fill in your name and phone number.', 'error');
        return;
      }

      const submitBtn = enquiryForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span class="material-symbols-outlined spin-loader text-[18px]">progress_activity</span>
          <span>Transmitting RFQ...</span>
        `;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
        enquiryForm.reset();

        showToast('Thank you! Your quotation request has been submitted. Our engineering team will contact you within 2 hours.', 'success');
      }, 1200);
    });
  }
}
