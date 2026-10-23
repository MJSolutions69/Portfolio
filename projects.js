document.addEventListener('DOMContentLoaded', () => {
  const filters = [...document.querySelectorAll('.toolbar .filter')];
  const cards = [...document.querySelectorAll('.all-projects .project-card')];
  const search = document.querySelector('#search');
  const empty = document.querySelector('#empty');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const themeButton = document.querySelector('.theme-toggle');
  const themeIcon = themeButton?.querySelector('.theme-toggle-icon');
  const themeLabel = themeButton?.querySelector('.theme-toggle-label');
  const countNumber = document.querySelector('.count-number');
  const countLabel = document.querySelector('.projects-count');
  let active = 'all';

  // Default to Night Mode on each fresh load, matching the home page.
  function applyTheme(theme) {
    const light = theme === 'light';
    document.body.dataset.theme = light ? 'light' : 'dark';
    document.documentElement.dataset.theme = light ? 'light' : 'dark';
    if (themeIcon) themeIcon.textContent = light ? '☾' : '☀';
    if (themeLabel) themeLabel.textContent = light ? 'Night mode' : 'Day mode';
    if (themeButton) {
      themeButton.setAttribute('aria-pressed', String(light));
      themeButton.setAttribute('aria-label', light ? 'Switch to night mode' : 'Switch to day mode');
      themeButton.title = light ? 'Switch to night mode' : 'Switch to day mode';
    }
  }
  applyTheme('dark');
  themeButton?.addEventListener('click', () => {
    const next = document.body.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(next);
    try { localStorage.setItem('mj-solution-theme', next); } catch {}
  });

  // Search/filter the full archive and keep the visible result count accurate.
  function render() {
    const q = (search?.value || '').toLowerCase().trim();
    let shown = 0;
    cards.forEach(card => {
      const category = (card.dataset.category || '').split(/\s+/);
      const searchable = ((card.dataset.name || '') + ' ' + (card.innerText || '')).toLowerCase();
      const visible = (active === 'all' || category.includes(active)) && (!q || searchable.includes(q));
      card.style.display = visible ? '' : 'none';
      if (visible) shown++;
    });
    if (empty) empty.style.display = shown ? 'none' : 'block';
    if (countNumber) countNumber.textContent = String(shown);
    if (countLabel) countLabel.textContent = shown === 1 ? 'Project Found' : 'Projects Found';
  }
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    active = button.dataset.filter || 'all';
    render();
  }));
  search?.addEventListener('input', render);

  // Mobile navigation matches the homepage interaction.
  menu?.addEventListener('click', () => {
    const open = nav?.classList.toggle('open') || false;
    menu.setAttribute('aria-expanded', String(open));
  });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
  }));

  // Keep the full archive visible independently of image loading and observers.
  cards.forEach(card => {
    card.classList.remove('project-reveal');
    card.classList.add('is-visible');
    card.style.transitionDelay = '';
  });

  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();
  window.updateProjectCount = render;
  render();
});
