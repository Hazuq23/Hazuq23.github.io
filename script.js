(() => {
  const header = document.querySelector('[data-header]');
  const navToggle = document.querySelector('[data-nav-toggle]');
  const navMenu = document.querySelector('[data-nav-menu]');

  const setHeader = () => header?.classList.toggle('scrolled', window.scrollY > 18);
  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true });

  navToggle?.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }));

  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 })
    : null;
  document.querySelectorAll('.reveal').forEach(el => observer ? observer.observe(el) : el.classList.add('visible'));

  const filters = document.querySelectorAll('[data-filter]');
  const projects = document.querySelectorAll('[data-category]');
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    projects.forEach(project => {
      const categories = project.dataset.category.split(' ');
      project.classList.toggle('hidden', filter !== 'all' && !categories.includes(filter));
    });
  }));

  const dialog = document.querySelector('[data-lightbox-dialog]');
  const dialogImage = document.querySelector('[data-lightbox-image]');
  const dialogCaption = document.querySelector('[data-lightbox-caption]');
  const dialogCount = document.querySelector('[data-lightbox-count]');
  const previousButton = document.querySelector('[data-lightbox-prev]');
  const nextButton = document.querySelector('[data-lightbox-next]');
  const lightboxTriggers = [...document.querySelectorAll('[data-lightbox]')];
  let activeGallery = [];
  let activeImageIndex = 0;

  const renderLightboxImage = () => {
    const trigger = activeGallery[activeImageIndex];
    if (!trigger) return;
    dialogImage.src = trigger.dataset.lightbox;
    dialogImage.alt = trigger.dataset.caption || 'Project image';
    dialogCaption.textContent = trigger.dataset.caption || '';
    dialogCount.textContent = activeGallery.length > 1
      ? `${activeImageIndex + 1} / ${activeGallery.length}`
      : '';
    previousButton.hidden = activeGallery.length < 2;
    nextButton.hidden = activeGallery.length < 2;
  };

  const moveLightbox = direction => {
    if (activeGallery.length < 2) return;
    activeImageIndex = (activeImageIndex + direction + activeGallery.length) % activeGallery.length;
    renderLightboxImage();
  };

  let lightboxScrollY = 0;

  const openLightbox = (trigger, event) => {
    event?.preventDefault();
    event?.stopPropagation();

    lightboxScrollY = window.scrollY;
    const galleryName = trigger.dataset.gallery;
    activeGallery = galleryName
      ? lightboxTriggers.filter(item => item.dataset.gallery === galleryName)
      : [trigger];
    activeImageIndex = Math.max(0, activeGallery.indexOf(trigger));
    renderLightboxImage();

    if (typeof dialog?.showModal === 'function') {
      dialog.showModal();
      document.documentElement.classList.add('lightbox-open');
      dialog.focus({ preventScroll: true });
      requestAnimationFrame(() => window.scrollTo({ top: lightboxScrollY, left: 0, behavior: 'auto' }));
    }
  };

  const closeLightbox = () => {
    if (dialog?.open) dialog.close();
  };

  lightboxTriggers.forEach(trigger => trigger.addEventListener('click', event => openLightbox(trigger, event)));
  previousButton?.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    moveLightbox(-1);
  });
  nextButton?.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    moveLightbox(1);
  });
  document.querySelector('[data-lightbox-close]')?.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    closeLightbox();
  });
  dialog?.addEventListener('click', event => {
    if (event.target === dialog) closeLightbox();
  });
  dialog?.addEventListener('close', () => {
    document.documentElement.classList.remove('lightbox-open');
    requestAnimationFrame(() => window.scrollTo({ top: lightboxScrollY, left: 0, behavior: 'auto' }));
  });
  document.addEventListener('keydown', event => {
    if (!dialog?.open) return;
    if (event.key === 'Escape') dialog.close();
    if (event.key === 'ArrowLeft') moveLightbox(-1);
    if (event.key === 'ArrowRight') moveLightbox(1);
  });

  const toast = document.querySelector('[data-toast]');
  document.querySelector('[data-copy-email]')?.addEventListener('click', async () => {
    const email = document.querySelector('[data-copy-email]')?.dataset.email || 'haziqmunir923@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
    } catch (_) {
      const input = document.createElement('textarea');
      input.value = email;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      input.remove();
    }
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 1800);
  });

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
