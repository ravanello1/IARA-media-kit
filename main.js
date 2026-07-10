/* ============================================================
   IARA MEDIA KIT — Interaction Layer
   ============================================================
   - Lenis smooth scroll initialization
   - Intersection Observer reveal system
   - Navigation scroll state
   - Hero load animation trigger
   ============================================================ */


(function () {
  'use strict';


  /* ----------------------------------------------------------
     1. LENIS SMOOTH SCROLL
     Buttery smooth scroll with native-feeling physics.
     Falls back to CSS scroll-behavior if Lenis is unavailable.
     ---------------------------------------------------------- */
  function initSmoothScroll() {
    if (typeof Lenis === 'undefined') {
      console.info('[IARA] Lenis not loaded — falling back to native smooth scroll.');
      return null;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Allow anchor links to work with Lenis
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        e.preventDefault();
        var target = document.querySelector(targetId);
        if (target) {
          lenis.scrollTo(target, { offset: -80 });
        }
      });
    });

    return lenis;
  }

  /* ----------------------------------------------------------
     1.5. MOBILE NAVIGATION TOGGLE
     ---------------------------------------------------------- */
  function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const navLinksItems = document.querySelectorAll('.nav__link');

    if (!navToggle || !navLinks) return;

    navToggle.addEventListener('click', function () {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('is-active');
      navLinks.classList.toggle('is-open');
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = !isExpanded ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navLinksItems.forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('is-active');
        navLinks.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }


  /* ----------------------------------------------------------
     2. INTERSECTION OBSERVER — Viewport Reveal System
     Elements with class `.reveal` animate in when scrolled
     into view. Supports directional and staggered variants.
     ---------------------------------------------------------- */
  function initRevealObserver() {
    var revealElements = document.querySelectorAll('.reveal');

    if (!revealElements.length) return;

    var observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12,
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Unobserve after reveal — one-time animation
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }


  /* ----------------------------------------------------------
     3. NAVIGATION — Scroll-aware state management
     Adds glass-morphism background when user scrolls past
     the initial viewport threshold.
     ---------------------------------------------------------- */
  function initNavScroll() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    var scrollThreshold = 80;
    var ticking = false;

    function updateNav() {
      if (window.scrollY > scrollThreshold) {
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateNav);
        ticking = true;
      }
    }, { passive: true });

    // Run on load in case page is already scrolled
    updateNav();
  }


  /* ----------------------------------------------------------
     4. HERO LOAD ANIMATION
     Triggers the staggered text reveal and fade-in elements
     once the page has fully loaded.
     ---------------------------------------------------------- */
  function initHeroAnimation() {
    var hero = document.querySelector('.hero');
    if (!hero) return;

    // Small delay ensures fonts are rendered before animating
    setTimeout(function () {
      hero.classList.add('is-loaded');
    }, 150);
  }


  /* ----------------------------------------------------------
     5. PERFORMANCE — Passive image loading observer
     Adds a soft fade-in when lazy-loaded images complete.
     ---------------------------------------------------------- */
  function initImageLoadEffects() {
    var images = document.querySelectorAll('img[loading="lazy"]');

    images.forEach(function (img) {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)';

      function onLoad() {
        img.style.opacity = '1';
        img.removeEventListener('load', onLoad);
      }

      if (img.complete) {
        img.style.opacity = '1';
      } else {
        img.addEventListener('load', onLoad);
      }
    });
  }


  /* ----------------------------------------------------------
     INITIALIZATION
     ---------------------------------------------------------- */
  function init() {
    initSmoothScroll();
    initMobileNav();
    initNavScroll();
    initHeroAnimation();
    initRevealObserver();
    initImageLoadEffects();
  }

  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
