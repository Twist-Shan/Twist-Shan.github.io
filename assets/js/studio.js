(() => {
  const root = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');

  const syncThemeButton = () => {
    if (!themeToggle) return;
    const dark = root.dataset.theme === 'dark';
    themeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    themeToggle.setAttribute('aria-pressed', String(dark));
  };

  if (themeToggle) {
    syncThemeButton();
    themeToggle.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('liang-theme', next); } catch (_) {}
      syncThemeButton();
    });
  }

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });
  }

  const filters = document.querySelector('.blog-filters');
  if (filters) {
    const buttons = [...filters.querySelectorAll('[data-blog-filter]')];
    const posts = [...document.querySelectorAll('.post-row[data-blog-category]')];
    const empty = document.querySelector('.blog-filter-empty');
    filters.hidden = false;
    buttons.forEach((button) => button.addEventListener('click', () => {
      const category = button.dataset.blogFilter;
      buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      let visible = 0;
      posts.forEach((post) => {
        post.hidden = category !== 'all' && post.dataset.blogCategory !== category;
        if (!post.hidden) visible += 1;
      });
      if (empty) empty.hidden = visible > 0 || posts.length === 0;
    }));
  }

  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach((item) => observer.observe(item));
})();
