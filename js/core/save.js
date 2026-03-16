// ── Sistema de guardado ───────────────────────────────────────────────────────
//    Fix Stage 2: agrega visibilitychange para guardar en móvil
//    (beforeunload no se dispara en iOS/Android con Capacitor)

import { SAVE_KEY, createInitialState, migrateState } from './state.js'

export const SaveManager = {
  _serialize(state) {
    return JSON.stringify({
      ...state,
      energy:            state.energy.toString(),
      totalEnergyEarned: state.totalEnergyEarned.toString(),
    })
  },

  _deserialize(raw) {
    const d = JSON.parse(raw)
    d.energy            = new Decimal(d.energy)
    d.totalEnergyEarned = new Decimal(d.totalEnergyEarned)
    return d
  },

  save(state) {
    try {
      localStorage.setItem(SAVE_KEY, this._serialize(state))
    } catch (e) {
      console.warn('[Save] Error guardando:', e)
    }
  },

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY)
      if (!raw) return null
      const saved   = this._deserialize(raw)
      const merged  = { ...createInitialState(), ...saved }
      return migrateState(merged)
    } catch (e) {
      console.warn('[Save] Error cargando, iniciando nuevo juego:', e)
      return null
    }
  },

  clear() {
    localStorage.removeItem(SAVE_KEY)
  },

  // Registrar el guardado automático al perder foco (mobile-safe)
  // Llamar una sola vez desde Game.init()
  setupAutoSave(getState) {
    // Auto-save periódico
    setInterval(() => {
      const state = getState()
      state.lastSave = Date.now()
      this.save(state)
    }, 10_000)

    // Tab perdiendo foco (desktop)
    window.addEventListener('beforeunload', () => {
      const state = getState()
      state.lastSave = Date.now()
      this.save(state)
    })

    // App pasando a background (mobile + desktop)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        const state = getState()
        state.lastSave = Date.now()
        this.save(state)
      }
    })

    // Capacitor: evento 'pause' cuando la app va a background
    // Se activa en Stage 18 con el plugin de Capacitor App
    // document.addEventListener('pause', () => { ... })
  },
}
