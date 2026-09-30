/* Public-site localization. App frames and customer-entered values stay untouched. */
(() => {
  'use strict';
  const supported = ['it', 'en', 'de', 'fr'];
  const dictionaries = window.MODULA_TRANSLATIONS || {};
  const textSources = new WeakMap(), attributeSources = new WeakMap();
  const ignored = 'script,style,noscript,textarea,[data-i18n-ignore]';
  const attributes = ['alt','title','aria-label','aria-valuetext','placeholder','data-caption'];
  let saved;
  try { saved = localStorage.getItem('modula-language'); } catch (_) {}
  const requested = new URL(location.href).searchParams.get('lang');
  let language = supported.includes(requested) ? requested : supported.includes(saved) ? saved : 'it';
  let scheduled = false;
  const t = source => language === 'it' ? String(source) : dictionaries[language]?.[String(source).trim()] ?? String(source);

  function updateText(node) {
    if (!node.nodeValue.trim() || node.parentElement?.closest(ignored)) return;
    let record = textSources.get(node);
    if (!record || node.nodeValue !== record.last) record = {source:node.nodeValue};
    const trimmed = record.source.trim();
    record.last = record.source.replace(trimmed, () => t(trimmed));
    if (node.nodeValue !== record.last) node.nodeValue = record.last;
    textSources.set(node, record);
  }

  function updateAttribute(element, name) {
    if (element.closest('[data-i18n-ignore]')) return;
    const current = element.getAttribute(name);
    if (!current) return;
    let records = attributeSources.get(element);
    if (!records) { records = new Map(); attributeSources.set(element, records); }
    let record = records.get(name);
    if (!record || current !== record.last) record = {source:current};
    record.last = t(record.source);
    if (current !== record.last) element.setAttribute(name, record.last);
    records.set(name, record);
  }

  function updateLinks() {
    document.querySelectorAll('a[href]').forEach(link => {
      const raw = link.getAttribute('href');
      if (!raw || raw.startsWith('#') || link.hasAttribute('download')) return;
      let url;
      try { url = new URL(raw, location.href); } catch (_) { return; }
      // Only the two public pages are localized; never rewrite app or mail links.
      if (!/(?:landing|configuratore)\/(?:index\.html)?$/.test(url.pathname)) return;
      if (url.protocol !== location.protocol || url.host !== location.host) return;
      url.searchParams.set('lang', language);
      if (link.href !== url.href) link.href = url.href;
    });
  }

  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => { scheduled = false; translate(); });
  });
  function observe() {
    observer.observe(document.documentElement, {subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attributes});
  }
  function translate(root = document.documentElement) {
    observer.disconnect();
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) updateText(node);
    const selector = attributes.map(name => '[' + name + ']').join(',');
    root.querySelectorAll?.(selector).forEach(element => attributes.forEach(name => updateAttribute(element,name)));
    document.querySelectorAll('meta[name="description"]').forEach(element => updateAttribute(element,'content'));
    document.documentElement.lang = language;
    document.querySelectorAll('[data-language-select]').forEach(select => {
      select.value = language;
      if (select.dataset.languageReady) return;
      select.dataset.languageReady = 'true';
      select.addEventListener('change', () => setLanguage(select.value));
    });
    updateLinks();
    observe();
  }

  function setLanguage(next) {
    if (!supported.includes(next)) return;
    language = next;
    try { localStorage.setItem('modula-language', language); } catch (_) {}
    try {
      const url = new URL(location.href);
      url.searchParams.set('lang',language);
      history.replaceState(history.state,'',url.href);
    } catch (_) { /* Some browsers restrict history updates on file URLs. */ }
    translate();
    document.dispatchEvent(new CustomEvent('modula:languagechange', {detail:{language}}));
  }

  window.ModulaI18n = {
    t, translate, setLanguage,
    sourceAttribute(element, name) { return attributeSources.get(element)?.get(name)?.source ?? element.getAttribute(name); },
    get language() { return language; },
    // Useful for checking coverage without treating untranslated product names as errors.
    sources() {
      const sources = new Set(), walker = document.createTreeWalker(document.documentElement,NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (node.parentElement?.closest(ignored)) continue;
        const source = textSources.get(node)?.source ?? node.nodeValue;
        if (source.trim()) sources.add(source.trim());
      }
      return [...sources];
    }
  };
  setLanguage(language);
})();
