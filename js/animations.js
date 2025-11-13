/**
 * Animations and hover effects using GSAP
 * Handles card hover effects, text animations, and parallax
 */

const initAnimations = () => {
  // Check if GSAP is loaded
  if (typeof gsap === 'undefined') {
    console.warn('GSAP is not loaded');
    return;
  }
  
  // Register GSAP plugins
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
  // Initialize AOS
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100,
      disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });
  }

  // Enhanced card hover effects with GSAP
  const cards = document.querySelectorAll('.card-hover');
  cards.forEach((card) => {
    const img = card.querySelector('img');
    const cardContent = card.querySelector('div:last-child');
    
    // Check if image is in aspect-ratio container
    const parent = img?.parentElement;
    const isAspectImage = parent && (
      parent.className.includes('aspect-[3/2]') || 
      parent.className.includes('aspect-[4/3]')
    );
    
    // Set initial scale for images to prevent gaps
    if (isAspectImage) {
      gsap.set(img, { scale: 1.2 });
    }
    
    // Hover animation
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -8,
        scale: 1.02,
        boxShadow: '0 25px 50px rgba(18, 18, 18, 0.15)',
        borderColor: 'var(--accent)',
        duration: 0.4,
        ease: 'power2.out'
      });
      
      if (img) {
        const baseScale = isAspectImage ? 1.2 : 1;
        gsap.to(img, {
          scale: baseScale * 1.1,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
      
      if (cardContent) {
        gsap.to(cardContent, {
          y: -2,
          duration: 0.4,
          ease: 'power2.out'
        });
      }
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        boxShadow: '0 20px 45px rgba(18, 18, 18, 0.12)',
        borderColor: 'var(--line)',
        duration: 0.4,
        ease: 'power2.out'
      });
      
      if (img) {
        const baseScale = isAspectImage ? 1.2 : 1;
        gsap.to(img, {
          scale: baseScale,
          duration: 0.6,
          ease: 'power2.out'
        });
      }
      
      if (cardContent) {
        gsap.to(cardContent, {
          y: 0,
          duration: 0.4,
          ease: 'power2.out'
        });
      }
    });
  });

  // CTA button hover effects
  const ctaButtons = document.querySelectorAll('.cta');
  ctaButtons.forEach((button) => {
    button.addEventListener('mouseenter', () => {
      gsap.to(button, {
        y: -3,
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    
    // Ripple effect on click
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        transform: scale(0);
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      gsap.to(ripple, {
        scale: 2,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => ripple.remove()
      });
    });
  });

  // Hero text animation on load
  const heroTitle = document.querySelector('#hero-title');
  if (heroTitle) {
    // Simple fade-in animation instead of letter-by-letter to avoid layout issues
    gsap.from(heroTitle, {
      opacity: 0,
      y: 30,
      duration: 1,
      delay: 0.2,
      ease: 'power2.out'
    });
  }

  // Hero subtitle animation
  const heroSubtitle = document.querySelector('#hero p.text-base, #hero p.text-lg, #hero .space-y-10 p');
  if (heroSubtitle) {
    gsap.from(heroSubtitle, {
      opacity: 0,
      y: 30,
      duration: 1,
      delay: 0.8,
      ease: 'power2.out'
    });
  }

  // Hero image - no parallax, just static

  // Parallax for card images on scroll
  const cardImages = document.querySelectorAll('.card-hover img, article img');
  cardImages.forEach((img) => {
    if (img.closest('#hero')) return; // Skip hero image
    
    gsap.to(img, {
      y: -30,
      scrollTrigger: {
        trigger: img,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });
  });

  // Animate counters in insights section
  const counters = document.querySelectorAll('#insights .text-2xl');
  counters.forEach((counter) => {
    const target = counter.textContent;
    const isNumber = /[\d.]+/.test(target);
    
    if (isNumber) {
      const numValue = parseFloat(target.replace(/[^\d.]/g, ''));
      const suffix = target.replace(/[\d.]/g, '');
      
      gsap.fromTo(
        { value: 0 },
        {
          value: numValue,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: counter,
            start: 'top 80%',
            toggleActions: 'play none none none'
          },
          onUpdate: function() {
            counter.textContent = this.targets()[0].value.toFixed(suffix.includes('%') ? 0 : 1) + suffix;
          }
        }
      );
    }
  });

  // Stagger animation for lists
  const lists = document.querySelectorAll('ul.space-y-3, ul.space-y-2');
  lists.forEach((list) => {
    const items = list.querySelectorAll('li');
    if (items.length > 0) {
      gsap.from(items, {
        opacity: 0,
        x: -20,
        duration: 0.5,
        stagger: 0.1,
        scrollTrigger: {
          trigger: list,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }
  });
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}

