/* ============================================================
   ANDENES — Main JavaScript Module
   Handles: navigation, scroll effects, reveal animations,
            hamburger menu, form handling, gallery lightbox
   ============================================================ */

'use strict';

// ── DOM Ready ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollReveal();
  initHamburgerMenu();
  initContactForm();
  initGalleryLightbox();
  initActiveNavLink();
  initDiscoAccordion();
  initShowFilters();
  initEasterEgg();
  initAnnouncementBar();
  initBackToTop();
  initVideoModal();
  initLyricsModal();
  initMemberModal();
  initCalendarActions();
  initEpkCopy();
  initSmoothScroll();
  initQuickStatsCounter();
  initCountdownTimer();
  initNoviembreCountdown();
  initShareButtons();
});


// ══════════════════════════════════════════════════════════════
// NAVIGATION — Scroll Effect & Active States
// ══════════════════════════════════════════════════════════════

function initNavigation() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    const currentScroll = window.scrollY;
    const threshold = window.innerWidth <= 768 ? 10 : 60;

    // Add/remove scrolled class
    if (currentScroll > threshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  // Throttle scroll event
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });
}


// ══════════════════════════════════════════════════════════════
// ACTIVE NAV LINK — Intersection Observer based
// ══════════════════════════════════════════════════════════════

function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));
}


// ══════════════════════════════════════════════════════════════
// HAMBURGER MENU — Mobile Navigation Toggle
// ══════════════════════════════════════════════════════════════

function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-menu a');

  if (!hamburger || !mobileMenu) return;

  const closeMenu = () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    document.documentElement.classList.remove('menu-open');
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    hamburger.classList.add('active');
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    document.documentElement.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
  };

  const toggleMenu = () => {
    if (mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  hamburger.addEventListener('click', toggleMenu);

  // Close on link click
  mobileLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}


// ══════════════════════════════════════════════════════════════
// SCROLL REVEAL — Intersection Observer Animations
// ══════════════════════════════════════════════════════════════

function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale'
  );

  if (!revealElements.length) return;

  // Respect reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    revealElements.forEach((el) => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}


// ══════════════════════════════════════════════════════════════
// TOAST NOTIFICATIONS — Modern Non-Intrusive Feedback
// ══════════════════════════════════════════════════════════════

function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'error') icon = '⚠️';

  toast.innerHTML = `
    <span style="font-size: 1.15rem; line-height: 1; flex-shrink: 0;">${icon}</span>
    <span style="flex-grow: 1; line-height: 1.4;">${message}</span>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('is-visible');
  });

  setTimeout(() => {
    toast.classList.remove('is-visible');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration);
}


// ══════════════════════════════════════════════════════════════
// CONTACT FORM — Validation, In-Card Alerts & Fallbacks
// ══════════════════════════════════════════════════════════════

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const alertBox = document.getElementById('formAlert');
  const alertClose = document.getElementById('formAlertClose');
  const alertTitle = document.getElementById('formAlertTitle');
  const alertText = document.getElementById('formAlertText');
  const alertActions = document.getElementById('formAlertActions');
  const formSuccess = document.getElementById('formSuccess');
  const resetBtn = document.getElementById('btnResetForm');

  function showAlert({ title, text, mailtoUrl, canRetry }) {
    if (!alertBox) return;
    if (alertTitle) alertTitle.textContent = title;
    if (alertText) alertText.textContent = text;
    if (alertActions) {
      alertActions.innerHTML = '';

      if (mailtoUrl) {
        const mailBtn = document.createElement('a');
        mailBtn.href = mailtoUrl;
        mailBtn.className = 'form-alert-btn form-alert-btn-primary';
        mailBtn.innerHTML = '✉️ Enviar directo por Mail / Gmail';
        mailBtn.target = '_blank';
        mailBtn.rel = 'noopener noreferrer';
        alertActions.appendChild(mailBtn);
      }

      if (canRetry) {
        const retryBtn = document.createElement('button');
        retryBtn.type = 'button';
        retryBtn.className = 'form-alert-btn form-alert-btn-secondary';
        retryBtn.innerHTML = '🔄 Reintentar';
        retryBtn.addEventListener('click', () => {
          hideAlert();
          if (typeof form.requestSubmit === 'function') {
            form.requestSubmit();
          } else {
            form.dispatchEvent(new Event('submit', { cancelable: true }));
          }
        });
        alertActions.appendChild(retryBtn);
      }

      const messageField = form.querySelector('#contactMessage');
      if (messageField && messageField.value.trim()) {
        const copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'form-alert-btn form-alert-btn-secondary';
        copyBtn.innerHTML = '📋 Copiar mensaje';
        copyBtn.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(messageField.value.trim());
            showToast('Mensaje copiado al portapapeles', 'success');
          } catch (_) {
            showToast('Seleccioná el texto para copiarlo', 'info');
          }
        });
        alertActions.appendChild(copyBtn);
      }
    }

    alertBox.classList.add('is-visible');
    alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideAlert() {
    if (alertBox) {
      alertBox.classList.remove('is-visible');
    }
  }

  if (alertClose) {
    alertClose.addEventListener('click', hideAlert);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'block';
      if (formSuccess) formSuccess.classList.remove('show');
      hideAlert();
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlert();

    const name = form.querySelector('#contactName');
    const email = form.querySelector('#contactEmail');
    const subject = form.querySelector('#contactSubject');
    const message = form.querySelector('#contactMessage');
    const submitBtn = form.querySelector('button[type="submit"]');

    let isValid = true;

    [name, email, message].forEach((field) => {
      if (!field.value.trim()) {
        field.style.borderColor = 'var(--clr-danger)';
        isValid = false;
      } else {
        field.style.borderColor = 'var(--clr-border)';
      }
    });

    const emailVal = email ? email.value.trim() : '';
    if (emailVal) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVal)) {
        email.style.borderColor = 'var(--clr-danger)';
        isValid = false;
        showToast('Por favor ingresá un email válido', 'error');
        return;
      }
    }

    if (!isValid) {
      showToast('Por favor completá los campos obligatorios', 'error');
      return;
    }

    const rawSubj = subject && subject.value.trim() ? subject.value.trim() : 'Mensaje desde la web';
    const rawName = name.value.trim();
    const rawMsg = message.value.trim();
    const mailtoSubject = encodeURIComponent(`[Web Andenes] ${rawSubj}`);
    const mailtoBody = encodeURIComponent(
      `Hola Andenes!\n\nNombre: ${rawName}\nEmail: ${emailVal}\nAsunto: ${rawSubj}\n\nMensaje:\n${rawMsg}\n`
    );
    const directMailtoUrl = `mailto:andenesbanda@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

    // Check if running on local file:// protocol
    if (window.location.protocol === 'file:') {
      showAlert({
        title: 'Modo de prueba local (file://)',
        text: 'Para enviar en vivo necesitás abrir la web con un servidor local o desde internet. FormSubmit no acepta envíos directos desde archivos abiertos con doble clic (file://).',
        mailtoUrl: directMailtoUrl,
        canRetry: false
      });
      return;
    }

    // Visual feedback - sending
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <span style="display:inline-flex; align-items:center; justify-content:center; gap:8px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 1s linear infinite;"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10"></path></svg>
        Enviando...
      </span>
    `;
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.75';

    let sentSuccessfully = false;

    // Timeout con AbortController de 9s para evitar esperas eternas en redes con filtros (ej: colegios)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    try {
      const response = await fetch('https://formsubmit.co/ajax/andenesbanda@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: controller.signal,
        body: JSON.stringify({
          Nombre: rawName,
          email: emailVal,
          Asunto: rawSubj,
          Mensaje: rawMsg,
          _subject: `Nuevo mensaje de ${rawName} - Web Andenes`
        })
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        if (data.success !== 'false' && data.success !== false) {
          sentSuccessfully = true;
        }
      }
    } catch (err) {
      clearTimeout(timeoutId);
      // Falla por red escolar, adblocker o timeout
    }

    // Fallback: Si FormSubmit falló por bloqueo de red externa, intentamos Netlify Forms
    if (!sentSuccessfully) {
      try {
        const formData = new FormData(form);
        formData.set('form-name', 'contacto');
        const netlifyResponse = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        });
        if (netlifyResponse.ok) {
          sentSuccessfully = true;
        }
      } catch (_) {
        // Fallback secundario omitido
      }
    }

    if (sentSuccessfully) {
      form.style.display = 'none';
      if (formSuccess) {
        const successMsg = formSuccess.querySelector('#formSuccessMsg');
        if (successMsg) {
          successMsg.innerHTML = `Gracias por escribirnos. Te vamos a responder a la brevedad a <strong>${emailVal}</strong>.`;
        }
        formSuccess.classList.add('show');
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      showToast('¡Mensaje enviado con éxito!', 'success');
    } else {
      // Alerta visual moderna integrada en la tarjeta sin alerts nativos
      showAlert({
        title: 'No pudimos conectar con el servidor de envío',
        text: 'Las redes de colegios o bloqueadores de anuncios suelen filtrar conexiones a servidores de formularios externos. Podés enviarlo directo con tu correo (Gmail/Mail) o reintentar sin perder lo que escribiste.',
        mailtoUrl: directMailtoUrl,
        canRetry: true
      });
      submitBtn.innerHTML = originalBtnContent;
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }
  });

  // Limpiar bordes de error al escribir
  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('input', () => {
      field.style.borderColor = 'var(--clr-accent)';
      hideAlert();
    });
    field.addEventListener('focus', () => {
      field.style.borderColor = 'var(--clr-accent)';
    });
    field.addEventListener('blur', () => {
      field.style.borderColor = 'var(--clr-border)';
    });
  });
}


// ══════════════════════════════════════════════════════════════
// GALLERY LIGHTBOX — Simple Fullscreen Image Viewer
// ══════════════════════════════════════════════════════════════

function initGalleryLightbox() {
  const modal = document.getElementById('lightboxModal');
  const imgEl = document.getElementById('lightboxImg');
  const captionEl = document.getElementById('lightboxCaption');
  const counterEl = document.getElementById('lightboxCounter');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  const backdrop = modal ? modal.querySelector('.lightbox-backdrop') : null;
  const items = Array.from(document.querySelectorAll('.gallery-item'));

  if (!modal || !items.length) return;

  const photos = items.map((item) => {
    const src = item.getAttribute('data-gallery-src') || (item.querySelector('img') ? item.querySelector('img').src : '');
    const caption = item.getAttribute('data-gallery-caption') || (item.querySelector('.gallery-caption') ? item.querySelector('.gallery-caption').textContent : '');
    return { src, caption };
  });

  let currentIndex = 0;

  const renderPhoto = (idx) => {
    currentIndex = (idx + photos.length) % photos.length;
    const photo = photos[currentIndex];
    if (imgEl) {
      imgEl.style.opacity = '0';
      setTimeout(() => {
        imgEl.src = photo.src;
        imgEl.alt = photo.caption || 'Foto de Andenes';
        imgEl.style.opacity = '1';
      }, 120);
    }
    if (captionEl) captionEl.textContent = photo.caption;
    if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${photos.length}`;
  };

  const openLightbox = (index) => {
    renderPhoto(index);
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  items.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); renderPhoto(currentIndex - 1); });
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); renderPhoto(currentIndex + 1); });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') renderPhoto(currentIndex - 1);
    if (e.key === 'ArrowRight') renderPhoto(currentIndex + 1);
  });

  // Mobile Touch Swipe support
  let touchStartX = 0;
  modal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) renderPhoto(currentIndex - 1);
      else renderPhoto(currentIndex + 1);
    }
  }, { passive: true });
}


// ══════════════════════════════════════════════════════════════
// PARALLAX HERO — Subtle Background Movement
// ══════════════════════════════════════════════════════════════


// ══════════════════════════════════════════════════════════════
// SMOOTH SCROLL — Enhanced for Safari Compatibility
// ══════════════════════════════════════════════════════════════

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}


// ══════════════════════════════════════════════════════════════
// DISCOGRAPHY — Accordion & Sub-sections Toggle ("Ver más", Canciones, Plataformas)
// ══════════════════════════════════════════════════════════════

function initDiscoAccordion() {
  // 1. Main card toggles ("Ver más" / "Ver menos")
  const moreToggles = document.querySelectorAll('.disco-more-toggle, .disco-tracks-toggle');
  
  moreToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      const targetId = toggle.getAttribute('aria-controls');
      const targetWrapper = targetId ? document.getElementById(targetId) : toggle.nextElementSibling;
      const textSpan = toggle.querySelector('.disco-more-toggle-text');
      const textOpen = toggle.getAttribute('data-text-open') || 'Ver menos';
      const textClosed = toggle.getAttribute('data-text-closed') || 'Ver más';

      if (!targetWrapper) return;

      if (isExpanded) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('is-active');
        if (textSpan) textSpan.textContent = textClosed;

        // Animate from current height down to 0
        targetWrapper.style.overflow = 'hidden';
        targetWrapper.style.maxHeight = targetWrapper.scrollHeight + 'px';
        targetWrapper.offsetHeight; // force reflow
        targetWrapper.style.maxHeight = '0px';
        targetWrapper.classList.remove('is-open');
      } else {
        toggle.setAttribute('aria-expanded', 'true');
        toggle.classList.add('is-active');
        if (textSpan) textSpan.textContent = textOpen;

        targetWrapper.classList.add('is-open');
        targetWrapper.style.overflow = 'hidden';
        targetWrapper.style.maxHeight = targetWrapper.scrollHeight + 'px';

        const onTransitionEnd = (e) => {
          if (e.target === targetWrapper && targetWrapper.classList.contains('is-open')) {
            targetWrapper.style.maxHeight = 'none';
            targetWrapper.style.overflow = 'visible';
            targetWrapper.removeEventListener('transitionend', onTransitionEnd);
          }
        };
        targetWrapper.addEventListener('transitionend', onTransitionEnd);
      }
    });
  });

  // 2. Inner sub-toggles ("Canciones" and "Plataformas")
  const subToggles = document.querySelectorAll('.disco-sub-toggle');

  subToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      const targetId = toggle.getAttribute('aria-controls');
      const targetWrapper = targetId ? document.getElementById(targetId) : toggle.nextElementSibling;
      const parentWrapper = toggle.closest('.disco-details-wrapper');

      if (!targetWrapper) return;

      // Ensure parent container doesn't constrain child height
      if (parentWrapper && parentWrapper.classList.contains('is-open')) {
        parentWrapper.style.maxHeight = 'none';
        parentWrapper.style.overflow = 'visible';
      }

      if (isExpanded) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('is-active');
        targetWrapper.style.overflow = 'hidden';
        targetWrapper.style.maxHeight = targetWrapper.scrollHeight + 'px';
        targetWrapper.offsetHeight; // force reflow
        targetWrapper.style.maxHeight = '0px';
        targetWrapper.classList.remove('is-open');
      } else {
        toggle.setAttribute('aria-expanded', 'true');
        toggle.classList.add('is-active');
        targetWrapper.classList.add('is-open');
        targetWrapper.style.overflow = 'hidden';
        targetWrapper.style.maxHeight = targetWrapper.scrollHeight + 'px';

        const onSubEnd = (e) => {
          if (e.target === targetWrapper && targetWrapper.classList.contains('is-open')) {
            targetWrapper.style.maxHeight = 'none';
            targetWrapper.style.overflow = 'visible';
            targetWrapper.removeEventListener('transitionend', onSubEnd);
          }
        };
        targetWrapper.addEventListener('transitionend', onSubEnd);
      }
    });
  });
}


// ══════════════════════════════════════════════════════════════
// SHOWS & TOUR DATES — Filter by Year & Upcoming
// ══════════════════════════════════════════════════════════════

function initShowFilters() {
  const filterBtns = document.querySelectorAll('.show-filter-btn');
  const showItems = Array.from(document.querySelectorAll('.show-item'));
  const expandWrap = document.getElementById('showsExpandWrap');
  const expandBtn = document.getElementById('btnToggleShowsExpand');
  const expandText = document.getElementById('showsExpandText');
  if (!filterBtns.length || !showItems.length) return;

  const INITIAL_VISIBLE_COUNT = 5;
  let currentFilter = 'all';
  let isExpanded = false;

  const updateShowsVisibility = () => {
    // 1. Filtrar los shows según la pestaña seleccionada
    const matchingItems = showItems.filter((item) => {
      const itemYear = item.dataset.year;
      const itemStatus = item.dataset.status;
      if (currentFilter === 'all') return true;
      if (currentFilter === 'upcoming') return itemStatus === 'upcoming';
      if (currentFilter === itemYear) return true;
      return false;
    });

    const totalMatching = matchingItems.length;
    const shouldShowExpand = totalMatching > INITIAL_VISIBLE_COUNT;

    // 2. Controlar la barra y texto del botón de expansión
    if (expandWrap) {
      expandWrap.style.display = shouldShowExpand ? 'flex' : 'none';
    }

    if (expandText) {
      if (isExpanded) {
        expandText.textContent = 'Mostrar menos fechas';
      } else {
        if (currentFilter === 'all') {
          expandText.textContent = `Ver todas las fechas (${totalMatching} shows)`;
        } else if (currentFilter === '2026') {
          expandText.textContent = `Ver todas las fechas de 2026 (${totalMatching} shows)`;
        } else {
          expandText.textContent = `Ver más fechas (${totalMatching} shows)`;
        }
      }
    }

    if (expandBtn) {
      expandBtn.classList.toggle('is-expanded', isExpanded);
      expandBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    }

    // 3. Aplicar visibilidad a cada item
    let visibleCount = 0;
    showItems.forEach((item) => {
      const isMatch = matchingItems.includes(item);
      if (!isMatch) {
        item.style.display = 'none';
        return;
      }

      if (!isExpanded && visibleCount >= INITIAL_VISIBLE_COUNT) {
        item.style.display = 'none';
      } else {
        item.style.display = '';
        item.classList.add('revealed');
      }
      visibleCount++;
    });
  };

  // Click en filtros
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      isExpanded = false; // Resetear expansión al cambiar pestaña
      updateShowsVisibility();
    });
  });

  // Click en botón desplegar / colapsar
  if (expandBtn) {
    expandBtn.addEventListener('click', () => {
      isExpanded = !isExpanded;
      updateShowsVisibility();
      if (!isExpanded) {
        const showsSection = document.getElementById('shows');
        if (showsSection) {
          showsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  // Inicializar estado al cargar
  updateShowsVisibility();
}


// ══════════════════════════════════════════════════════════════
// EASTER EGG — Cartel Original "Andén sin salida"
// ══════════════════════════════════════════════════════════════

function initEasterEgg() {
  const modal = document.getElementById('easterEggModal');
  const triggers = document.querySelectorAll('.easter-egg-trigger');
  const closeBtn = document.getElementById('easterEggClose');

  if (!modal || !triggers.length) return;

  let easterEggTriggered = false;
  let closeTimeout = null;

  function playEasterEggSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Master volume control
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.28, now);
      masterGain.connect(ctx.destination);

      // Station chime chord (D4, A4, D5 harmonic tones)
      const freqs = [293.66, 440.0, 587.33];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        oscGain.gain.setValueAtTime(0, now + idx * 0.07);
        oscGain.gain.linearRampToValueAtTime(0.18 / (idx + 1), now + idx * 0.07 + 0.03);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.07 + 2.2);

        osc.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 2.4);
      });

      // Deep train track rail resonance drone
      const drone = ctx.createOscillator();
      const droneGain = ctx.createGain();
      drone.type = 'triangle';
      drone.frequency.setValueAtTime(73.42, now); // D2

      droneGain.gain.setValueAtTime(0.0001, now);
      droneGain.gain.linearRampToValueAtTime(0.14, now + 0.15);
      droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

      drone.connect(droneGain);
      droneGain.connect(masterGain);

      drone.start(now);
      drone.stop(now + 3.0);

      // Cleanup context
      setTimeout(() => {
        try { ctx.close(); } catch (err) {}
      }, 3500);
    } catch (err) {
      // Gracefully ignore if audio is disabled
    }
  }

  function closeEasterEgg() {
    if (!modal.classList.contains('is-active')) return;

    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }

    modal.classList.remove('is-active');
    modal.classList.add('is-closing');
    modal.setAttribute('aria-hidden', 'true');

    // Remove is-closing class after transition completes
    setTimeout(() => {
      modal.classList.remove('is-closing');
    }, 850);
  }

  function triggerEasterEgg(e) {
    // Allow users to highlight and copy text without triggering the Easter Egg
    const selection = window.getSelection ? window.getSelection().toString() : '';
    if (selection && selection.trim().length > 0) return;

    if (easterEggTriggered) return;

    easterEggTriggered = true;

    // Play subtle atmospheric chime
    playEasterEggSound();

    // Disable triggers for the rest of this session (until reload)
    triggers.forEach((trig) => {
      trig.classList.add('is-disabled');
      trig.style.cursor = 'default';
      trig.removeAttribute('title');
    });

    modal.classList.remove('is-closing');
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');

    // Automatic fade out after 4 seconds
    closeTimeout = setTimeout(() => {
      closeEasterEgg();
    }, 4000);
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', triggerEasterEgg);
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        triggerEasterEgg(e);
      }
    });
  });

  // Close button
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeEasterEgg();
    });
  }

  // Clicking backdrop closes modal early
  const backdrop = modal.querySelector('.easter-egg-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      closeEasterEgg();
    });
  }

  // Pressing Escape closes it
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeEasterEgg();
    }
  });
}


// ══════════════════════════════════════════════════════════════
// TOP ANNOUNCEMENT BAR & HEADER HEIGHT SYNC
// ══════════════════════════════════════════════════════════════

function updateHeaderHeight() {
  const header = document.getElementById('siteHeader');
  if (header) {
    const height = header.offsetHeight;
    if (height > 0) {
      document.documentElement.style.setProperty('--header-height', `${height}px`);
    }
  }
}

function initAnnouncementBar() {
  const bar = document.getElementById('announcementBar');
  const closeBtn = document.getElementById('announcementClose');
  if (!bar) return;

  // Siempre mostrar al cargar la página y sincronizar altura de cabecera
  bar.classList.add('is-visible');
  updateHeaderHeight();

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      bar.classList.remove('is-visible');
      const themeMeta = document.getElementById('themeColorMeta') || document.querySelector('meta[name="theme-color"]');
      if (themeMeta) {
        themeMeta.setAttribute('content', '#0a0a0a');
      }
      requestAnimationFrame(() => {
        updateHeaderHeight();
      });
    });
  }

  window.addEventListener('load', updateHeaderHeight, { passive: true });
  window.addEventListener('resize', updateHeaderHeight, { passive: true });
  window.addEventListener('orientationchange', updateHeaderHeight, { passive: true });

  const header = document.getElementById('siteHeader');
  if (window.ResizeObserver && header) {
    const ro = new ResizeObserver(() => {
      updateHeaderHeight();
    });
    ro.observe(header);
  }
}


// ══════════════════════════════════════════════════════════════
// BACK TO TOP
// ══════════════════════════════════════════════════════════════

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}


// ══════════════════════════════════════════════════════════════
// VIDEO LIGHTBOX MODAL
// ══════════════════════════════════════════════════════════════

function initVideoModal() {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoModalFrame');
  const titleEl = document.getElementById('videoModalTitle');
  const directLink = document.getElementById('videoModalDirect');
  const closeBtn = document.getElementById('videoModalClose');
  const backdrop = modal ? modal.querySelector('.video-modal-backdrop') : null;
  const videoCards = document.querySelectorAll('.video-card');

  if (!modal || !iframe || !videoCards.length) return;

  const extractYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const openVideo = (url, title) => {
    const videoId = extractYouTubeId(url);
    if (!videoId) return;

    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
    if (titleEl) titleEl.textContent = title || 'Show en vivo — Andenes';
    if (directLink) directLink.href = url;

    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  };

  const closeVideo = () => {
    modal.classList.remove('is-active');
    iframe.src = '';
    document.body.style.overflow = '';
  };

  videoCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.ctrlKey || e.metaKey || e.shiftKey) return;
      e.preventDefault();
      const href = card.getAttribute('href');
      const title = card.querySelector('.video-title') ? card.querySelector('.video-title').textContent : 'Show en vivo';
      openVideo(href, title);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeVideo);
  if (backdrop) backdrop.addEventListener('click', closeVideo);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeVideo();
    }
  });
}


// ══════════════════════════════════════════════════════════════
// LYRICS MODAL
// ══════════════════════════════════════════════════════════════

const SONG_LYRICS = {
  'amor-interminable': {
    title: 'Amor Interminable',
    meta: 'Single · Lanzamiento 6 de Septiembre de 2026 · 2:47 min',
    credits: 'Música y letra: Andenes · Grabado de manera independiente.',
    lyrics: `Oh
Sigue viviendo
Sigue viviendo de este amor interminable

Oh
Sigue viviendo
Sigue viviendo de este amor interminable

Oh
Sigue viviendo
Sigue viviendo de este amor interminable

Tienes que saber
Lo que pasa cuando estás cerca de mí

Pretendes mucho más
Miles de caminos sin salida al mar

Oh
Sigue viviendo
Sigue viviendo de este amor interminable

Oh
Sigue viviendo
Sigue viviendo de este amor interminable

Oh
Sigue viviendo
Sigue viviendo de este amor interminable

Oh
Sigue viviendo
Sigue viviendo de este amor interminable`
  },
  'por-el-sueldo': {
    title: 'Por El Sueldo',
    meta: 'EP Para Ser Libre (Track 01) · 2:36 min',
    credits: 'Música y letra: Andenes · Grabado de manera independiente.',
    lyrics: `Nos dijeron estudiá, que el futuro es seguro
Pero el alma se oxida en un banco oscuro
Te enseñan a contar, pero no a sentir
Y al final del camino, ¿quién te enseña a vivir?

Todos corren por el sueldo, sin mirar atrás
Se olvidaron del fuego que los hacía soñar

Prometen futuro, pero venden rutina
Te cambian los sueños por una oficina
Seguí la carrera, que ahí está el poder
Y el arte se muere sin nadie que lo quiera ver

Todos corren por el sueldo, sin mirar atrás
Se olvidaron del fuego que los hacía soñar

¡Ey!`
  },
  'luz-de-madrugada': {
    title: 'Luz De Madrugada',
    meta: 'EP Para Ser Libre (Track 02) · 4:23 min',
    credits: 'Música y letra: Andenes · Grabado de manera independiente.',
    lyrics: `Anoche vi tus pasos
Girando entre las sombras
La luna te guiñaba
Y vos seguías sola

Las bocas susurraban
La vida va corriendo
El viento te despeina
Donde el alma se libera

¡Luz de madrugada!
Prendo fuego el corazón
Que las calles bailan
Al ritmo de tu voz
¡Luz de madrugada!
No pares de brillar
Que en cada latido
La noche empieza a cantar

Las luces van bailando
Historias que se cruzan
Tu risa desafía la tormenta
Sos llama que no apaga

¡Luz de madrugada!
Prendo fuego el corazón
Que las calles bailan
Al ritmo de tu voz
¡Luz de madrugada!
No pares de brillar
Que en cada latido
La noche empieza a cantar

Aunque el tiempo apure su reloj
Vos seguís tu esencia y tu color
Como un tren sin freno
Tu destino es ritmo, es rock and roll

¡Luz de madrugada!
Prendo fuego el corazón
Que las calles bailan
Al ritmo de tu voz
¡Luz de madrugada!
No pares de brillar
Que en cada latido
La noche empieza a cantar`
  },
  'desde-lo-lejos': {
    title: 'Desde Lo Lejos',
    meta: 'EP Para Ser Libre (Track 03) · 3:22 min',
    credits: 'Música y letra: Andenes · Grabado de manera independiente.',
    lyrics: `Búscame desde lo lejos de tu corazón
Quiéreme como nunca antes te he querido, mi amor
Llévame donde tus sueños no tengan dolor

Si te vas, no digas adiós
Solo deja un poco de vos
Yo sabré cómo seguir
Aunque no estés junto a mí

Mírame aunque el tiempo nos diga que no
Piénsame cuando el cielo se apague en tu voz
Guárdame en el rincón que aún te deja el amor

Si te vas, no digas adiós
Solo deja un poco de vos
Yo sabré cómo seguir
Aunque no estés junto a mí`
  },
  'para-ser-libre': {
    title: 'Para Ser Libre',
    meta: 'EP Para Ser Libre (Track 04 - Homónimo) · 3:44 min',
    credits: 'Música y letra: Andenes · Grabado de manera independiente.',
    lyrics: `Todo vuelve a empezar
No puedo mirarte igual
No siento lo que sentía
Cada luna es sombría

Extraño esos momentos
Compartidos con vos

Quiero despertar
De esta pesadilla
Tienes que abandonar
Para ser libre

Tu llegada me inspiró
Pero el sol se ocultó
Las flores no se abren
Tu corazón se cerró

Déjame vivir
Ese momento`
  }
};

function initLyricsModal() {
  const modal = document.getElementById('lyricsModal');
  const titleEl = document.getElementById('lyricsModalTitle');
  const metaEl = document.getElementById('lyricsModalMeta');
  const bodyEl = document.getElementById('lyricsModalBody');
  const creditsEl = document.getElementById('lyricsModalCredits');
  const closeBtn = document.getElementById('lyricsModalClose');
  const copyBtn = document.getElementById('btnCopyLyrics');
  const backdrop = modal ? modal.querySelector('.lyrics-modal-backdrop') : null;
  const triggers = document.querySelectorAll('.btn-track-lyrics');

  if (!modal || !triggers.length) return;

  let currentLyrics = '';

  const openLyrics = (trackId) => {
    const data = SONG_LYRICS[trackId];
    if (!data) return;

    currentLyrics = `${data.title} — Andenes\n\n${data.lyrics}\n\n${data.credits}`;

    if (titleEl) titleEl.textContent = data.title;
    if (metaEl) metaEl.textContent = data.meta;
    if (bodyEl) bodyEl.textContent = data.lyrics;
    if (creditsEl) creditsEl.textContent = data.credits;

    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  };

  const closeLyrics = () => {
    modal.classList.remove('is-active');
    document.body.style.overflow = '';
  };

  triggers.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const trackId = btn.getAttribute('data-track-id');
      openLyrics(trackId);
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(currentLyrics);
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '¡Copiada!';
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2200);
      } catch (err) {
        showToast('No se pudo copiar automáticamente. Podés seleccionarla y copiarla manualmente.', 'info');
      }
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLyrics);
  if (backdrop) backdrop.addEventListener('click', closeLyrics);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeLyrics();
    }
  });
}


// ══════════════════════════════════════════════════════════════
// MEMBER DOSSIER MODAL
// ══════════════════════════════════════════════════════════════

const MEMBER_DOSSIERS = {
  'luca': {
    idTag: 'AND-01',
    name: 'Luca Bonamaison Marconi',
    role: 'Co-Fundador · Voz Líder & Guitarras',
    instrumentBadge: 'Voz & Guitarra',
    img: 'assets/img/luca.jpg',
    pills: ['Voz Líder', 'Composición', 'Riffs', 'Guitarras'],
    specs: [
      { label: 'Instrumento Principal', value: 'Guitarra Eléctrica / Criolla & Voz Principal' },
      { label: 'Rol en Escena', value: 'Voz al frente, guitarras rítmicas y conexión con el público' },
      { label: 'En Andenes', value: 'Desde 2025 · Miembro Fundador' },
      { label: 'Micrófono / Canal', value: 'Shure SM58 en pie frontal (Ch 1 consola)' }
    ],
    bio: 'Co-fundador y cantante principal de Andenes. La banda comenzó a gestarse cuando Luca y Mateo empezaron a juntarse a ensayar en un parque con dos guitarras criollas preparando canciones para un festival escolar. Poco después Luca convocó a Santiago en batería para darle pulso firme al proyecto. Luca está a cargo de las letras, la composición melódica y la energía visceral al frente del escenario, combinando rítmicas sólidas con una voz cargada de actitud y mensaje.',
    gear: [
      'Guitarra eléctrica versátil configurada para ritmos con amplio ataque y definición armónica',
      'Guitarra criolla tradicional utilizada en la composición acústica de los temas',
      'Cadena de pedales en piso: Overdrive / Crunch para empuje, Chorus analógico y afinador cromático (requiere 220V al frente)',
      'Micrófono Shure SM58 dinámico para tomas de voz de alta fidelidad en vivo'
    ],
    influencias: ['Los Piojos', 'Divididos', 'Las Pelotas', 'Bersuit Vergarabat', 'Andrés Calamaro', 'Luis Miguel'],
    highlights: [
      'Compositor y voz líder en el EP debut "Para Ser Libre" (2026)',
      'Voz principal en el single "Amor Interminable" (2026)',
      'Frontman en más de 13 shows en vivo (Rock in Cuba, El Emergente, Fragata Fest)'
    ]
  },
  'mateo': {
    idTag: 'AND-02',
    name: 'Mateo Ezequiel Morales',
    role: 'Co-Fundador · Guitarra Líder & Voces',
    instrumentBadge: 'Guitarra & Voz',
    img: 'assets/img/mateo.jpg',
    pills: ['Lead Guitar', 'Solos', 'Armonías', 'Arreglos'],
    specs: [
      { label: 'Instrumento Principal', value: 'Guitarra Eléctrica Solista & Segundas Voces' },
      { label: 'Rol en Escena', value: 'Solos principales, arreglos melódicos y armonías vocales' },
      { label: 'En Andenes', value: 'Desde 2025 · Miembro Fundador' },
      { label: 'Micrófono / Canal', value: 'Shure SM58 en pie frontal (Ch 2 consola)' }
    ],
    bio: 'Co-fundador de la banda. Desde aquellos primeros ensayos acústicos en el parque junto a Luca, Mateo aportó la impronta melódica y el vuelo solista que caracteriza a Andenes. Su destreza en solos punzantes, arreglos de guitarra y segundas voces enriquece los estribillos y le da a la banda un sonido en vivo contundente, vibrante y lleno de matices.',
    gear: [
      'Guitarra eléctrica seteada para solos con sustain prolongado y rápida respuesta dinámica',
      'Pedalera de piso con Lead Overdrive / Distorsión, Boost solista, Wah dinámico y Delay ambiental',
      'Amplificador microfoneado con Shure SM57 o Sennheiser e609 en festivales y salas',
      'Micrófono frontal para coros y segundas voces melódicas'
    ],
    influencias: ['Airbag', 'Soda Stereo', 'Luis Alberto Spinetta', 'Rata Blanca', 'Los Piojos', 'Oasis'],
    highlights: [
      'Solos expresivos en "Desde Lo Lejos" y "Para Ser Libre"',
      'Riffs y contrapuntos eléctricos en "Por El Sueldo"',
      'Arreglos melódicos de guitarras en "Amor Interminable"'
    ]
  },
  'florian': {
    idTag: 'AND-03',
    name: 'Florián Mayol',
    role: 'Bajista · Base & Coros',
    instrumentBadge: 'Bajo & Coros',
    img: 'assets/img/florian.jpg',
    pills: ['Bajo', 'Low-End', 'Groove', 'Coros'],
    specs: [
      { label: 'Instrumento Principal', value: 'Bajo Eléctrico de 4 Cuerdas & Micrófono' },
      { label: 'Rol en Escena', value: 'Líneas de bajo, sostén rítmico, peso sonoro y coros' },
      { label: 'En Andenes', value: 'Desde 2026 · Formación Oficial Definitiva' },
      { label: 'Micrófono / Conexión', value: 'Shure SM58 en pie jirafa (Ch 3) + DI activa balanceada' }
    ],
    bio: 'Se incorporó a la banda en 2026 tras la salida del single "Amor Interminable", completando la alineación definitiva con la que Andenes compone, graba y se presenta en vivo actualmente. Florián ensambla el groove junto a la batería de Santiago, sumando un soporte armónico sólido y líneas de bajo con cuerpo que amalgaman la potencia de las dos guitarras.',
    gear: [
      'Bajo eléctrico de 4 cuerdas calibrado para graves contundentes y medios definidos',
      'Caja directa activa (DI balanceada) para envío limpio hacia la consola de sala',
      'Amplificador propio de bajo para referencia de escenario con pegada inmediata',
      'Micrófono dinámico Shure SM58 en pie jirafa para coros en vivo'
    ],
    influencias: ['Los Piojos', 'Patricio Rey y sus Redonditos de Ricota', 'Divididos', 'Las Pelotas', 'Los Abuelos de la Nada', 'Virus'],
    highlights: [
      'Líneas de bajo en vivo y consolidación de la formación oficial 2026',
      'Empuje de graves en shows destacados (El Emergente, Fragata Fest)',
      'Coros de apoyo y ensamble con la base rítmica'
    ]
  },
  'santiago': {
    idTag: 'AND-04',
    name: 'Santiago Ezequiel Levin',
    role: 'Co-Fundador · Batería & Pulso',
    instrumentBadge: 'Batería',
    img: 'assets/img/santiago.jpg',
    pills: ['Batería', 'Tempo', 'Potencia', 'Dinámica'],
    specs: [
      { label: 'Instrumento Principal', value: 'Batería Acústica Completa' },
      { label: 'Rol en Escena', value: 'Pulso, tempo, cambios de dinámica y fuerza motriz' },
      { label: 'En Andenes', value: 'Desde 2025 · Miembro Fundador' },
      { label: 'Monitoreo en Escenario', value: 'Vía 4 independiente exclusiva de batería' }
    ],
    bio: 'Miembro co-fundador convocado por Luca en los inicios del proyecto en 2025. Santiago se sumó de inmediato para darle motor y batería real a los temas. Es el pulso vital sobre el escenario: maneja los crescendos, quiebres y tiempos con precisión milimétrica, inyectando la fuerza cruda y la energía arrolladora del rock en cada recital.',
    gear: [
      'Batería acústica completa: Bombo con pegada profunda, redoblante con filo seco y toms balanceados',
      'Set de platillos: Hi-Hat nítido, Crash de corte explosivo y Ride con campana brillante',
      'Microfoneo estándar: Shure Beta 52 / AKG D112 en bombo, SM57 en caja y micrófonos overhead',
      'Palillos 5A clásicos y apagadores para control dinámico en salas acústicas'
    ],
    influencias: ['Catupecu Machu', 'Sumo', 'Cabezones', 'Intoxicados', 'Él Mató a un Policía Motorizado', 'Luis Alberto Spinetta'],
    highlights: [
      'Base rítmica grabada en el EP "Para Ser Libre" (2026)',
      'Batería y tempo en el single "Amor Interminable" (2026)',
      'Precisión y potencia en las más de 13 fechas en vivo'
    ]
  }
};

function initMemberModal() {
  const modal = document.getElementById('memberModal');
  if (!modal) return;

  const tagEl = document.getElementById('memberModalTag');
  const imgEl = document.getElementById('memberModalImg');
  const badgeEl = document.getElementById('memberModalBadge');
  const nameEl = document.getElementById('memberModalName');
  const roleEl = document.getElementById('memberModalRole');
  const pillsEl = document.getElementById('memberModalPills');
  const specsEl = document.getElementById('memberModalSpecs');
  const bioEl = document.getElementById('memberModalBio');
  const gearEl = document.getElementById('memberModalGear');
  const influencesEl = document.getElementById('memberModalInfluences');
  const highlightsEl = document.getElementById('memberModalHighlights');
  const counterEl = document.getElementById('memberModalCounter');
  const prevBtn = document.getElementById('memberModalPrev');
  const nextBtn = document.getElementById('memberModalNext');
  const closeBtn = document.getElementById('memberModalClose');
  const backdrop = document.getElementById('memberModalBackdrop');
  const cards = document.querySelectorAll('.member-card[data-member-id]');

  if (!cards.length) return;

  const memberKeys = ['luca', 'mateo', 'florian', 'santiago'];
  let currentIndex = 0;

  const renderMember = (index) => {
    currentIndex = (index + memberKeys.length) % memberKeys.length;
    const key = memberKeys[currentIndex];
    const data = MEMBER_DOSSIERS[key];
    if (!data) return;

    if (tagEl) tagEl.textContent = data.idTag;
    if (imgEl) {
      imgEl.src = data.img;
      imgEl.alt = `${data.name} — ${data.role}`;
    }
    if (badgeEl) badgeEl.textContent = data.instrumentBadge;
    if (nameEl) nameEl.textContent = data.name;
    if (roleEl) roleEl.textContent = data.role;

    if (pillsEl) {
      pillsEl.innerHTML = data.pills
        .map(pill => `<span class="member-modal-pill">${pill}</span>`)
        .join('');
    }

    if (specsEl) {
      specsEl.innerHTML = data.specs
        .map(spec => `
          <div class="member-modal-spec-cell">
            <span class="member-modal-spec-lbl">${spec.label}</span>
            <span class="member-modal-spec-val">${spec.value}</span>
          </div>
        `).join('');
    }

    if (bioEl) bioEl.textContent = data.bio;

    if (gearEl) {
      gearEl.innerHTML = data.gear
        .map(item => `
          <li class="member-modal-gear-item">
            <span class="gear-bullet">⚡</span>
            <span>${item}</span>
          </li>
        `).join('');
    }

    if (influencesEl) {
      influencesEl.innerHTML = data.influencias
        .map(inf => `<span class="member-modal-chip">${inf}</span>`)
        .join('');
    }

    if (highlightsEl) {
      highlightsEl.innerHTML = data.highlights
        .map(hl => `<li class="member-modal-highlight-item">${hl}</li>`)
        .join('');
    }

    if (counterEl) {
      counterEl.textContent = `${currentIndex + 1} / ${memberKeys.length}`;
    }
  };

  const openMemberModal = (memberId) => {
    const idx = memberKeys.indexOf(memberId);
    renderMember(idx >= 0 ? idx : 0);
    modal.classList.add('is-active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  };

  const closeMemberModal = () => {
    modal.classList.remove('is-active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  cards.forEach((card) => {
    const memberId = card.getAttribute('data-member-id');

    card.addEventListener('click', () => {
      openMemberModal(memberId);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openMemberModal(memberId);
      }
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      renderMember(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      renderMember(currentIndex + 1);
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeMemberModal);
  if (backdrop) backdrop.addEventListener('click', closeMemberModal);

  // Touch Swipe navigation on mobile
  let touchStartX = 0;
  let touchStartY = 0;

  modal.addEventListener('touchstart', (e) => {
    if (!e.changedTouches.length) return;
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  modal.addEventListener('touchend', (e) => {
    if (!e.changedTouches.length) return;
    const diffX = e.changedTouches[0].screenX - touchStartX;
    const diffY = e.changedTouches[0].screenY - touchStartY;
    // Trigger swipe if horizontal movement is dominant and > 50px
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY) * 1.4) {
      if (diffX < 0) {
        renderMember(currentIndex + 1); // Swipe left -> next
      } else {
        renderMember(currentIndex - 1); // Swipe right -> prev
      }
    }
  }, { passive: true });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-active')) return;

    if (e.key === 'Escape') {
      closeMemberModal();
    } else if (e.key === 'ArrowLeft') {
      renderMember(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      renderMember(currentIndex + 1);
    }
  });
}


// ══════════════════════════════════════════════════════════════
// CALENDAR & SHOW ACTIONS
// ══════════════════════════════════════════════════════════════

function initCalendarActions() {
  const toggleBtn = document.getElementById('btnCalendarToggle');
  const menu = document.getElementById('calendarMenu');
  const gcalBtn = document.getElementById('btnGoogleCalendar');
  const icalBtn = document.getElementById('btnIcalDownload');

  if (!toggleBtn || !menu) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('is-open');
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== toggleBtn) {
      menu.classList.remove('is-open');
    }
  });

  if (gcalBtn) {
    gcalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const gcalUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
        '&text=' + encodeURIComponent('Andenes en Vivo — Rock in Cuba') +
        '&dates=20261024T163000/20261024T170000' +
        '&details=' + encodeURIComponent('Recital en vivo de Andenes en Rock in Cuba (16:30 a 17:00 hs). Rock argentino independiente.\nEntradas: https://docs.google.com/forms/d/e/1FAIpQLSembxRCFsCMFyN0d6ycwtZPGDBohC66F0IJUyjNQHf_GH1oiA/viewform\nhttps://andenesbanda.com') +
        '&location=' + encodeURIComponent('Rock in Cuba, Buenos Aires, Argentina');
      window.open(gcalUrl, '_blank');
      menu.classList.remove('is-open');
    });
  }

  if (icalBtn) {
    icalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Andenes//Recital Rock in Cuba//ES',
        'CALSCALE:GREGORIAN',
        'BEGIN:VEVENT',
        'DTSTART:20261024T163000',
        'DTEND:20261024T170000',
        'SUMMARY:Andenes en Vivo — Rock in Cuba',
        'DESCRIPTION:Recital de Andenes en vivo en Rock in Cuba (16:30 a 17:00 hs). Entradas: https://docs.google.com/forms/d/e/1FAIpQLSembxRCFsCMFyN0d6ycwtZPGDBohC66F0IJUyjNQHf_GH1oiA/viewform',
        'LOCATION:Rock in Cuba, Buenos Aires, Argentina',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'andenes-rock-in-cuba-2026.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      menu.classList.remove('is-open');
    });
  }
}




// ══════════════════════════════════════════════════════════════
// EPK / PRESS KIT & RIDER TÉCNICO (DUAL FORMAT)
// ══════════════════════════════════════════════════════════════

function initEpkCopy() {
  // 1. Gacetilla Copy
  const copyBioBtn = document.getElementById('btnCopyEpkBio');
  const bioEl = document.getElementById('epkBioText');
  if (copyBioBtn && bioEl) {
    copyBioBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(bioEl.textContent.trim());
        const originalText = copyBioBtn.innerHTML;
        copyBioBtn.innerHTML = '✅ ¡Gacetilla Copiada!';
        setTimeout(() => {
          copyBioBtn.innerHTML = originalText;
        }, 2500);
      } catch (err) {
        showToast('Seleccioná el texto para copiarlo.', 'info');
      }
    });
  }

  // 2. Rider Tabs Switcher
  const tabs = document.querySelectorAll('.epk-tab');
  const badge = document.getElementById('epkRiderBadge');
  const tabReducido = document.getElementById('riderTabReducido');
  const tabCompleto = document.getElementById('riderTabCompleto');
  const copyRiderBtn = document.getElementById('btnCopyRider');

  let currentRider = 'reducido';

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.rider;
      currentRider = mode;

      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      if (mode === 'reducido') {
        if (badge) badge.textContent = 'Setup Bares & Colegios';
        if (tabReducido) tabReducido.classList.add('active');
        if (tabCompleto) tabCompleto.classList.remove('active');
      } else {
        if (badge) badge.textContent = 'Setup Festivales & Salas';
        if (tabReducido) tabReducido.classList.remove('active');
        if (tabCompleto) tabCompleto.classList.add('active');
      }
    });
  });

  // 3. Rider Copy Buttons (Bares & Colegios + Festivales & Salas Grandes)
  const copyRiderBaresBtn = document.getElementById('btnCopyRiderBares');
  const copyRiderFestivalesBtn = document.getElementById('btnCopyRiderFestivales');

  const riderBaresText = [
    'RIDER TÉCNICO — ANDENES (Formato Bares & Colegios / Reducido)',
    '------------------------------------------------------------',
    '• Integrantes: 4 músicos (Rock Argentino Independiente).',
    '• Voces (3 micrófonos con pie): 2 micrófonos principales al frente para guitarras/voz (Luca y Mateo) + 1 micrófono con pie jirafa para Florián (apoyo de coros en temas seleccionados). Salidas XLR a la PA del lugar.',
    '• Guitarras (2): Luca y Mateo con pedaleras propias a amplificadores de escenario (no requiere microfonear en espacios chicos).',
    '• Bajo: Florián con amplificador propio o línea directa (DI).',
    '• Batería: Santiago con kit acústico estándar (sonido acústico natural / 1 mic en bombo opcional).',
    '• Electricidad: Mínimo 2 o 3 tomas 220V al frente para pedaleras y afinadores.',
    '• Monitoreo: 1 a 2 retornos de piso para voces (adaptable).',
    '• Contacto & Bookings: andenesbanda@gmail.com'
  ].join('\n');

  const riderFestivalesText = [
    'RIDER TÉCNICO — ANDENES (Formato Festivales, Salas Grandes & Teatros / Completo)',
    '------------------------------------------------------------------------------',
    '• Integrantes: 4 músicos (Rock Argentino Independiente).',
    '• Input List (Canales de consola):',
    '  Ch 1: Bombo (Beta 52 / AKG D112)',
    '  Ch 2: Redoblante / Caja (Shure SM57)',
    '  Ch 3: Hi-Hat / Overheads',
    '  Ch 4: Bajo Eléctrico (Caja Directa DI activa balanceada)',
    '  Ch 5: Guitarra 1 Luca (Mic SM57 a amplificador, pedalera propia en piso)',
    '  Ch 6: Guitarra 2 Mateo (Mic SM57 a amplificador, pedalera propia en piso)',
    '  Ch 7: Voz 1 Luca (Shure SM58 en pie)',
    '  Ch 8: Voz 2 Mateo (Shure SM58 en pie)',
    '  Ch 9: Voz 3 Florián (Shure SM58 en pie - Coros en temas seleccionados)',
    '• Monitoreo de Escenario: 3 a 4 vías independientes (Luca, Mateo, Florián, Santiago).',
    '• Electricidad: 220V al frente para pedaleras y en fondo de escenario.',
    '• Escenario mínimo: 4m x 3m (tarima firme).',
    '• Contacto & Bookings: andenesbanda@gmail.com'
  ].join('\n');

  const copyRiderWithFeedback = async (btn, text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      const originalText = btn.innerHTML;
      btn.innerHTML = '¡Copiado!';
      showToast(`${label} copiado con éxito`, 'success');
      setTimeout(() => {
        btn.innerHTML = originalText;
      }, 2500);
    } catch (err) {
      showToast('No se pudo copiar automáticamente. Por favor seleccioná el texto.', 'info');
    }
  };

  if (copyRiderBaresBtn) {
    copyRiderBaresBtn.addEventListener('click', () => {
      copyRiderWithFeedback(copyRiderBaresBtn, riderBaresText, 'Rider Bares & Colegios');
    });
  }

  if (copyRiderFestivalesBtn) {
    copyRiderFestivalesBtn.addEventListener('click', () => {
      copyRiderWithFeedback(copyRiderFestivalesBtn, riderFestivalesText, 'Rider Festivales & Salas');
    });
  }

  if (copyRiderBtn) {
    copyRiderBtn.addEventListener('click', () => {
      const fullText = (currentRider === 'completo') ? riderFestivalesText : riderBaresText;
      copyRiderWithFeedback(copyRiderBtn, fullText, 'Rider Técnico');
    });
  }
}


// ══════════════════════════════════════════════════════════════
// QUICK STATS COUNTER — Smooth animated count-up
// ══════════════════════════════════════════════════════════════

function initQuickStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-count[data-target]');
  if (!statNumbers.length) return;

  let animated = false;

  const runCounter = () => {
    if (animated) return;
    animated = true;

    statNumbers.forEach((el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      const duration = 1600;
      const startTime = performance.now();

      const update = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Smooth cubic ease-out
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(ease * target);

        el.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target;
        }
      };

      requestAnimationFrame(update);
    });
  };

  const container = document.querySelector('.hero-stats-container');
  if (container && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCounter();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(container);
  } else {
    setTimeout(runCounter, 300);
  }
}


// ══════════════════════════════════════════════════════════════
// VIDEO LIGHTBOX MODAL — In-site YouTube Playback
// ══════════════════════════════════════════════════════════════

function initVideoModal() {
  const modal = document.getElementById('videoModal');
  const frame = document.getElementById('videoModalFrame');
  const titleEl = document.getElementById('videoModalTitle');
  const directLink = document.getElementById('videoModalDirect');
  const closeBtn = document.getElementById('videoModalClose');
  const backdrop = modal ? modal.querySelector('.video-modal-backdrop') : null;
  const videoCards = document.querySelectorAll('.video-card[data-video-id]');

  if (!modal || !frame || !videoCards.length) return;

  const openVideo = (videoId, title) => {
    // Si se prueba en local como file:/// (sin servidor web http/https),
    // YouTube bloquea la inserción con Error 153 por falta de Referer HTTP.
    // En local se abre directamente en YouTube para evitar el bloqueo:
    if (window.location.protocol === 'file:') {
      window.open(`https://youtu.be/${videoId}`, '_blank', 'noopener,noreferrer');
      return;
    }

    const origin = (window.location.origin && window.location.origin !== 'null') 
      ? window.location.origin 
      : 'https://andenes.vercel.app';

    frame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1&origin=${encodeURIComponent(origin)}`;
    if (titleEl) titleEl.textContent = title || 'Show en vivo — Andenes';
    if (directLink) directLink.href = `https://youtu.be/${videoId}`;
    modal.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  };

  const closeVideo = () => {
    modal.classList.remove('is-active');
    frame.src = '';
    document.body.style.overflow = '';
  };

  videoCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      // Allow user to middle-click or Ctrl-click to open YouTube tab if they want
      if (e.metaKey || e.ctrlKey || e.button === 1) return;
      e.preventDefault();
      const videoId = card.getAttribute('data-video-id');
      const title = card.getAttribute('data-video-title');
      openVideo(videoId, title);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeVideo);
  if (backdrop) backdrop.addEventListener('click', closeVideo);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-active')) {
      closeVideo();
    }
  });
}


// ══════════════════════════════════════════════════════════════
// COUNTDOWN TIMER — Live countdown for next show (24 Octubre)
// ══════════════════════════════════════════════════════════════

function initCountdownTimer() {
  const showDate = new Date('2026-10-24T16:30:00-03:00').getTime();
  const announcementEl = document.getElementById('announcementCountdown');
  const timerEl = document.getElementById('showCountdownTimer');

  if (!announcementEl && !timerEl) return;

  const update = () => {
    const now = Date.now();
    const distance = showDate - now;

    if (distance <= 0) {
      if (announcementEl) announcementEl.textContent = '· ⚡ ¡Hoy es el show!';
      if (timerEl) timerEl.textContent = '¡Hoy es el show!';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');

    if (announcementEl) {
      announcementEl.textContent = `· ⏳ Faltan ${days}d ${hours}h`;
    }

    if (timerEl) {
      timerEl.textContent = `${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
    }
  };

  update();
  setInterval(update, 1000);
}


// ══════════════════════════════════════════════════════════════
// SHARE BUTTONS — Web Share API with Clipboard Fallback
// ══════════════════════════════════════════════════════════════

function initShareButtons() {
  const shareButtons = document.querySelectorAll('.btn-share-action');
  if (!shareButtons.length) return;

  shareButtons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const title = btn.getAttribute('data-share-title') || 'Andenes — Rock Argentino';
      const text = btn.getAttribute('data-share-text') || '¡Escuchá Andenes! 🛤️';
      const url = btn.getAttribute('data-share-url') || window.location.href;

      if (navigator.share) {
        try {
          await navigator.share({ title, text, url });
          return;
        } catch (err) {
          if (err.name === 'AbortError') return;
        }
      }

      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        showToast('¡Enlace copiado al portapapeles! 🛤️', 'success');
      } catch (err) {
        showToast('Copiá el enlace: ' + url, 'info');
      }
    });
  });
}


// ══════════════════════════════════════════════════════════════
// CUENTA REGRESIVA SHOW NOVIEMBRE 2026
// ══════════════════════════════════════════════════════════════

function initNoviembreCountdown() {
  const timerEl = document.getElementById('noviembreCountdownTimer');
  if (!timerEl) return;

  // Fecha tentativa editable: Sábado 21 de Noviembre de 2026 a las 21:00 hs (UTC-3)
  const targetDate = new Date('2026-11-21T21:00:00-03:00').getTime();

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      timerEl.textContent = '¡HOY EN VIVO!';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    timerEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);
}




