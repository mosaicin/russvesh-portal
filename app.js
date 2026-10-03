const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const sideNav = $('.side-nav');
const menuToggle = $('.menu-toggle');
menuToggle?.addEventListener('click', () => {
  const open = sideNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  menuToggle.innerHTML = open ? 'Закрыть <span>×</span>' : 'Меню <span>＋</span>';
});

$$('.nav-link').forEach((link) => link.addEventListener('click', () => {
  sideNav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Открыть меню');
  if (menuToggle) menuToggle.innerHTML = 'Меню <span>＋</span>';
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    $$('.nav-link').forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
  });
}, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
$$('main section[id]').forEach((section) => observer.observe(section));

$$('.volume-toggle').forEach((button) => button.addEventListener('click', () => {
  const details = button.closest('.volume-card').querySelector('.volume-details');
  const isOpen = !details.hasAttribute('hidden');
  if (isOpen) details.setAttribute('hidden', ''); else details.removeAttribute('hidden');
  button.setAttribute('aria-expanded', String(!isOpen));
  button.setAttribute('aria-controls', details.id);
  button.innerHTML = isOpen ? 'Смотреть ориентиры <span>＋</span>' : 'Скрыть ориентиры <span>−</span>';
}));

const languageStatus = $('#language-status-text');
const languageCopy = {
  all: 'Сейчас доступны русскоязычные материалы. Переводные версии — в подготовке.',
  uz: 'O‘zbekcha — узбекские аннотации и исследовательские заметки в подготовке.',
  tg: 'Тоҷикӣ — таджикские аннотации и исследовательские заметки в подготовке.',
  hy: 'Հայերեն — армянские аннотации и исследовательские заметки в подготовке.',
  ro: 'Română — материалы на румынском / молдавском в подготовке.',
  av: 'Авар мацӀ — материалы на аварском языке в подготовке.'
};
$$('.language-card').forEach((card) => card.addEventListener('click', () => {
  const selected = card.dataset.language;
  $$('.language-card').forEach((item) => {
    item.classList.toggle('selected', item === card);
    item.setAttribute('aria-pressed', String(item === card));
  });
  $$('.material-row').forEach((row) => row.classList.toggle('hidden', selected !== 'all' && row.dataset.materialLang !== selected));
  languageStatus.textContent = languageCopy[selected];
}));

const modal = $('#request-modal');
let lastTrigger = null;
const openModal = (event) => { lastTrigger = event?.currentTarget || document.activeElement; modal.hidden = false; document.body.classList.add('no-scroll'); $('input', modal)?.focus(); };
const closeModal = () => { modal.hidden = true; document.body.classList.remove('no-scroll'); lastTrigger?.focus?.(); };
$$('[data-open-request]').forEach((button) => button.addEventListener('click', openModal));
$$('[data-close-request]').forEach((button) => button.addEventListener('click', closeModal));
modal?.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modal.hidden) closeModal(); });

$('#permission-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const result = $('#form-result');
  const form = new FormData(event.currentTarget);
  const draft = `Запрос разрешения на публикацию\n\nИмя / организация: ${form.get('name')}\nКонтакт: ${form.get('contact')}\nЯзык: ${form.get('language')}\nОбъём: ${form.get('scope')}\n\nОписание:\n${form.get('message')}\n\nЭто обращение является запросом и не заменяет письменное разрешение.`;
  const copyPromise = navigator.clipboard ? navigator.clipboard.writeText(draft) : Promise.reject(new Error('Clipboard unavailable'));
  copyPromise.then(() => {
    result.textContent = 'Черновик скопирован. Проверьте официальный канал правообладателя перед отправкой.';
  }).catch(() => {
    result.textContent = 'Черновик подготовлен. Скопируйте текст вручную и отправьте его через проверенный официальный канал.';
  });
});
