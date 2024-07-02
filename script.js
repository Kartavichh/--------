// Сохранение языка в localStorage
localStorage.setItem('language', 'en');

// Получение языка из localStorage
const lang = localStorage.getItem('language') || 'en';

//Функция загрузки соответствующего языка
async function loadTranslations(lang) {
    const response = await fetch(`translations/${lang}.json`);
    return await response.json();
  }
  
  //Применение перевода
  function applyTranslations(translations) {
    document.querySelectorAll('[data-i18n-key]').forEach(elem => {
      const key = elem.getAttribute('data-i18n-key');
      elem.textContent = translations[key];
    });
  }

  // Инициализация перевода при смене языка
  async function init() {
    const lang = localStorage.getItem('language') || 'en';
    const translations = await loadTranslations(lang);
    applyTranslations(translations);
  }
  
  document.addEventListener('DOMContentLoaded', init);

  //Обработка смены языка
  document.querySelectorAll('.language-switcher').forEach(button => {
    button.addEventListener('click', async (event) => {
      const lang = event.target.dataset.lang;
      localStorage.setItem('language', lang);
      const translations = await loadTranslations(lang);
      applyTranslations(translations);
    });
  });
  