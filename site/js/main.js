/* ============================================
   THE GOLD STANDARD — Main JavaScript
   GSAP ScrollTrigger + Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Register GSAP ScrollTrigger --- */
  gsap.registerPlugin(ScrollTrigger);

  /* --- Check reduced motion preference --- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --- Navigation scroll behavior --- */
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  /* --- Mobile menu --- */
  const toggle = document.querySelector('.nav__toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.querySelector('.mobile-menu__close');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  if (toggle && mobileMenu) {
    const openMenu = () => {
      mobileMenu.classList.add('active');
      document.body.style.overflow = 'hidden';
      mobileClose.focus();
    };

    toggle.addEventListener('click', openMenu);
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openMenu();
      }
    });

    mobileClose.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Smooth scroll for nav links --- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* --- GSAP Scroll Animations (skip if reduced motion) --- */
  if (!prefersReducedMotion) {

    // Reveal elements on scroll
    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true
          }
        }
      );
    });

    gsap.utils.toArray('.reveal-left').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: -50 },
        {
          opacity: 1, x: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true
          }
        }
      );
    });

    gsap.utils.toArray('.reveal-right').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: 50 },
        {
          opacity: 1, x: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once: true
          }
        }
      );
    });

    // Stagger children in grids
    gsap.utils.toArray('.stagger-children').forEach(parent => {
      const children = parent.children;
      gsap.fromTo(children,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: parent,
            start: 'top 80%',
            once: true
          }
        }
      );
    });

    // Parallax on images
    gsap.utils.toArray('.parallax').forEach(el => {
      gsap.to(el, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1
        }
      });
    });

    // Counter animations
    gsap.utils.toArray('.counter').forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        },
        onUpdate: () => {
          el.textContent = Math.round(obj.val);
        }
      });
    });

    // Hero text entrance
    const heroText = document.querySelector('.hero__text');
    if (heroText) {
      gsap.fromTo(heroText,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.3 }
      );
    }

    const heroImage = document.querySelector('.hero__image');
    if (heroImage) {
      gsap.fromTo(heroImage,
        { opacity: 0, x: 80, scale: 0.95 },
        { opacity: 1, x: 0, scale: 1, duration: 1.4, ease: 'power3.out', delay: 0.5 }
      );
    }

    // Credential bar slide in
    const credentials = document.querySelectorAll('.credential');
    if (credentials.length) {
      gsap.fromTo(credentials,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.credentials',
            start: 'top 90%',
            once: true
          }
        }
      );
    }

  } else {
    // Reduced motion: make everything visible
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
  }

  /* --- Curriculum Tabs --- */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(target).classList.add('active');
    });
  });

  /* --- Accordion (Curriculum + FAQ) --- */
  document.querySelectorAll('.curriculum__item-header, .faq__question').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isOpen = item.classList.contains('open');

      // Close siblings
      const siblings = item.parentElement.querySelectorAll('.curriculum__item.open, .faq__item.open');
      siblings.forEach(s => s.classList.remove('open'));

      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  /* --- Checkout Button ---
     Wire #checkout-btn to your payment processor:
     - Stripe Checkout: redirect to Stripe session URL
     - Stripe Payment Links: set href to your payment link
     - Gumroad / Lemon Squeezy / etc: set href or open modal
     Example: document.getElementById('checkout-btn').href = 'https://buy.stripe.com/your-link';
  */

});
