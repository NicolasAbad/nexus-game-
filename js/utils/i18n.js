// ── Motor de internacionalización ─────────────────────────────────────────────
// Uso: t('key') o t('key', { var: value })
// Selector de idioma en el HUD llama i18n.setLocale('en') y re-renderiza.

import { STRINGS_ES } from '../data/strings/es.js'
import { STRINGS_EN } from '../data/strings/en.js'

const STRINGS = { es: STRINGS_ES, en: STRINGS_EN }
const LOCALE_KEY = 'nexus_locale'

let _locale = 'es'

export const i18n = {
  init() {
    const saved   = localStorage.getItem(LOCALE_KEY)
    const browser = navigator.language?.slice(0, 2)
    _locale = (saved && STRINGS[saved])
      ? saved
      : (STRINGS[browser] ? browser : 'es')
  },

  setLocale(lang) {
    if (!STRINGS[lang]) return
    _locale = lang
    localStorage.setItem(LOCALE_KEY, lang)
    this.applyDOM()
  },

  getLocale() { return _locale },

  // Traduce una key con interpolación opcional: t('key', { name: 'Nexus' })
  t(key, vars = {}) {
    const strings = STRINGS[_locale] || STRINGS['es']
    let   str     = strings[key] ?? STRINGS['es'][key] ?? key
    Object.entries(vars).forEach(([k, v]) => {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v)
    })
    return str
  },

  // Aplica data-i18n="key" a todos los elementos del DOM
  applyDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this.t(el.dataset.i18n)
    })
    document.documentElement.lang = _locale
  },

  // Devuelve los idiomas disponibles
  available() { return Object.keys(STRINGS) },
}

// Shorthand exportado para uso directo: import { t } from './utils/i18n.js'
export const t = (key, vars) => i18n.t(key, vars)
