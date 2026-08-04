// Client-side i18n for Axonvale landing page.
// Single translations.json holds all locales; UI text is swapped via data-i18n attributes.
(function () {
  'use strict';

  var STORAGE_KEY = 'axonvale-lang';
  var DEFAULT_LANG = 'en';

  var LOCALES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'pt', name: 'Português' },
    { code: 'it', name: 'Italiano' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'ru', name: 'Русский' },
    { code: 'ar', name: 'العربية' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'pl', name: 'Polski' },
    { code: 'sv', name: 'Svenska' },
    { code: 'th', name: 'ไทย' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'zh-CN', name: '简体中文' },
    { code: 'zh-TW', name: '繁體中文' },
  ];

  // Shared state survives both navigation swaps and Astro re-executing this script.
  var state = window.__axonvaleI18nState;
  if (!state) {
    state = window.__axonvaleI18nState = {
      translations: null,
      currentLang: DEFAULT_LANG,
      selectorWired: null,
    };
  }

  function getStoredLang() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && LOCALES.some(function (l) { return l.code === saved; })) {
        return saved;
      }
    } catch (e) {
      /* localStorage unavailable */
    }
    return DEFAULT_LANG;
  }

  function storeLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      /* ignore */
    }
  }

  function translate(node) {
    if (!state.translations) return;
    var lang = state.translations[state.currentLang] || state.translations[DEFAULT_LANG] || {};
    var fallback = state.translations[DEFAULT_LANG] || {};
    node.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = lang[key];
      if (val === undefined || val === null) val = fallback[key];
      if (val === undefined || val === null) return;
      if (el.hasAttribute('data-i18n-placeholder')) {
        el.setAttribute('placeholder', val);
      } else {
        el.textContent = val.replace(/\{year\}/g, String(new Date().getFullYear()));
      }
    });
  }

  function getLocaleName(code) {
    var localized;
    if (state.translations) {
      var lang = state.translations[state.currentLang] || {};
      var fallback = state.translations[DEFAULT_LANG] || {};
      var val = lang['lang.' + code];
      if (val === undefined || val === null) val = fallback['lang.' + code];
      localized = val;
    }
    if (localized !== undefined && localized !== null) return localized;
    for (var i = 0; i < LOCALES.length; i += 1) {
      if (LOCALES[i].code === code) return LOCALES[i].name;
    }
    return code;
  }

  function applyLanguage(lang, updateLabel) {
    state.currentLang = lang;
    var langFixed = document.body && document.body.hasAttribute('data-lang-fixed');
    if (!langFixed) {
      document.documentElement.setAttribute('lang', lang);
    }
    if (updateLabel) {
      var label = document.getElementById('lang-dd-label');
      if (label) label.textContent = getLocaleName(lang);
      var menu = document.getElementById('lang-dd-menu');
      if (menu) {
        menu.querySelectorAll('[role="option"]').forEach(function (item) {
          var code = item.getAttribute('data-lang');
          var selected = code === lang;
          item.textContent = getLocaleName(code);
          item.setAttribute('aria-selected', selected ? 'true' : 'false');
          item.classList.toggle('is-active', selected);
        });
      }
    }
    if (!state.translations) return;
    translate(document.body);
  }

  function setMenuOpen(open) {
    var dd = document.getElementById('lang-dd');
    var btn = document.getElementById('lang-dd-btn');
    var menu = document.getElementById('lang-dd-menu');
    if (!dd || !btn || !menu) return;
    dd.classList.toggle('is-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.hidden = !open;
  }

  function initSelector() {
    var btn = document.getElementById('lang-dd-btn');
    var menu = document.getElementById('lang-dd-menu');
    if (!btn || !menu) return;

    if (state.selectorWired === btn) return;
    state.selectorWired = btn;

    while (menu.firstChild) menu.removeChild(menu.firstChild);

    // Build option items
    LOCALES.forEach(function (locale) {
      var li = document.createElement('li');
      li.className = 'lang-dd-item';
      li.setAttribute('role', 'option');
      li.setAttribute('data-lang', locale.code);
      li.setAttribute('aria-selected', locale.code === state.currentLang ? 'true' : 'false');
      li.tabIndex = -1;
      li.textContent = getLocaleName(locale.code);
      li.addEventListener('click', function () {
        storeLang(locale.code);
        applyLanguage(locale.code, true);
        setMenuOpen(false);
      });
      menu.appendChild(li);
    });

    btn.addEventListener('click', function (event) {
      event.stopPropagation();
      setMenuOpen(menu.hidden);
    });
  }

  // Applies the saved language to whatever DOM is currently present.
  function initPage() {
    initSelector();
    applyLanguage(state.currentLang, true);
  }

  async function loadTranslations() {
    if (state.translations) {
      initPage();
      return;
    }
    try {
      var res = await fetch('/locales/translations.json');
      if (!res.ok) throw new Error('translations fetch failed');
      state.translations = await res.json();
    } catch (e) {
      state.translations = {};
    }
    state.currentLang = getStoredLang();
    initPage();
  }

  if (window.__axonvaleI18nInstalled) {
    initPage();
  } else {
    window.__axonvaleI18nInstalled = true;

    // Close on outside click
    document.addEventListener('click', function () {
      setMenuOpen(false);
    });

    // Close on Escape
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') setMenuOpen(false);
    });

    // Fires on initial load and after every View Transition navigation.
    document.addEventListener('astro:page-load', function () {
      state.currentLang = getStoredLang();
      initPage();
    });

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadTranslations);
    } else {
      loadTranslations();
    }
  }

  window.AxonvaleI18n = {
    getMessage: function (key) {
      if (!state.translations) return key;
      var lang = state.translations[state.currentLang] || state.translations[DEFAULT_LANG] || {};
      var fallback = state.translations[DEFAULT_LANG] || {};
      var val = lang[key];
      if (val === undefined || val === null) val = fallback[key];
      if (val === undefined || val === null) return key;
      return val.replace(/\{year\}/g, String(new Date().getFullYear()));
    },
    getLang: function () {
      return state.currentLang;
    },
  };
})();
