/**
 * Main JavaScript file for Premium Remont website
 * Handles mobile menu, form submission, and analytics
 */

const onReady = (callback) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true });
  } else {
    callback();
  }
};

onReady(() => {
  const $ = (id) => document.getElementById(id);

  // Mobile menu toggle
  const menuBtn = $('menuBtn');
  const mobileNav = $('mobileNav');
  if (menuBtn && mobileNav) {
    const setMenuState = (open) => {
      menuBtn.setAttribute('aria-expanded', String(open));
      mobileNav.hidden = !open;
    };
    menuBtn.addEventListener('click', () => setMenuState(mobileNav.hidden));
    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuState(false));
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        setMenuState(false);
      }
    });
  }

  // Update copyright year in footer
  const yearNode = $('year');
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  // Google Analytics 4 initialization
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  // Lead form handling
  const form = $('leadForm');
  const msg = $('formMessage');
  const proposalBtn = $('btnKP');
  let submitIntent = 'lead';

  const setMessage = (text, isSuccess = false) => {
    if (!msg) return;
    msg.textContent = text;
    msg.style.color = isSuccess ? '#16a34a' : 'var(--muted)';
  };

  const sendAnalytics = (eventName, payload) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, payload);
    }
  };

  const triggerSubmit = () => {
    if (!form) return;
    if (typeof form.requestSubmit === 'function') {
      form.requestSubmit();
    } else {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
  };

  if (proposalBtn) {
    proposalBtn.addEventListener('click', () => {
      submitIntent = 'proposal';
      triggerSubmit();
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        setMessage('Проверьте обязательные поля и согласие.');
        form.reportValidity();
        submitIntent = 'lead';
        return;
      }

      const formData = new FormData(form);
      formData.append('intent', submitIntent);
      const data = Object.fromEntries(formData.entries());

      // TODO: Send data to backend
      sendAnalytics('generate_lead', { form_id: 'leadForm', intent: submitIntent });
      sendAnalytics('form_submit', { form_id: 'leadForm', intent: submitIntent });

      setMessage('Заявка отправлена. Свяжемся для обсуждения деталей.', true);
      form.reset();
      submitIntent = 'lead';
    });
  }
});

