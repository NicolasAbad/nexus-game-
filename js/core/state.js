// ── Estado del juego + migración de saves ────────────────────────────────────

export const SAVE_KEY         = 'nexus_save_v1'   // misma key para cargar saves existentes
export const SAVE_INTERVAL_MS = 10_000
export const MIN_OFFLINE_SECS = 30
export const UI_TICK_MS       = 100
export const CURRENT_VERSION  = 6

export function createInitialState() {
  return {
    // Recursos
    energy:            new Decimal(0),
    totalEnergyEarned: new Decimal(0),
    totalClicks:       0,

    // Portales
    portals: {
      ignea: 0, abismal: 0, temporal: 0, vacio: 0,
      celestial: 0, caos: 0, primordial: 0, singular: 0,
    },

    // Mejoras compradas { upgradeId: true }
    upgrades: {},

    // Desbloqueos de portales y paneles
    unlocks: {
      portalIgnea:       false,
      portalAbismal:     false,
      portalTemporal:    false,
      portalVacio:       false,
      portalCelestial:   false,
      portalCaos:        false,
      portalPrimordial:  false,
      portalSingular:    false,
      panelUpgrades:     false,
    },

    // Sinergias cross-portal activadas { synergyId: true }
    activeSynergies: {},

    // Offline income
    offlineCap:        2 * 3600,
    offlineEfficiency: 0.5,

    // Habilidades activas
    abilities: {
      convergencia:   { unlocked: false, level: 1, exp: 0, lastUsed: 0, activeUntil: 0, usesToday: 0, dailyReset: 0 },
      tormenta:       { unlocked: false, level: 1, exp: 0, lastUsed: 0, activeUntil: 0, usesToday: 0, dailyReset: 0 },
      pulso:          { unlocked: false, level: 1, exp: 0, lastUsed: 0, activeUntil: 0, usesToday: 0, dailyReset: 0 },
      cristalizacion: { unlocked: false, level: 1, exp: 0, lastUsed: 0, activeUntil: 0, usesToday: 0, dailyReset: 0 },
      resonancia:     { unlocked: false, level: 1, exp: 0, lastUsed: 0, activeUntil: 0, usesToday: 0, dailyReset: 0 },
    },

    // Misiones
    missions: {
      history: {},
      daily: {
        lastReset:     0,
        completed:     {},
        clicks:        0,
        portalsBought: 0,
        abilitiesUsed: 0,
      },
      weekly: {
        lastReset:     0,
        completed:     {},
        portalsBought: 0,
      },
    },

    // Meta
    lastSave:     Date.now(),
    tutorialStep: 0,
    version:      CURRENT_VERSION,
  }
}

// Migra saves de versiones anteriores sin perder progreso
export function migrateState(state) {
  const v = state.version || 1

  if (v < 2) {
    state.portals  = { ignea: 0, abismal: 0, temporal: 0, vacio: 0, ...(state.portals || {}) }
    state.unlocks  = {
      portalIgnea: false, portalAbismal: false,
      portalTemporal: false, portalVacio: false, panelUpgrades: false,
      ...(state.unlocks || {}),
    }
    state.version = 2
  }

  if (v < 3) {
    state.abilities = {
      convergencia: { lastUsed: 0, activeUntil: 0 },
      tormenta:     { lastUsed: 0, activeUntil: 0 },
      pulso:        { lastUsed: 0 },
    }
    state.version = 3
  }

  if (v < 4) {
    const defaultAst = { unlocked: false, level: 1, exp: 0, lastUsed: 0, activeUntil: 0, usesToday: 0, dailyReset: 0 }
    state.abilities = {
      convergencia:   { ...defaultAst },
      tormenta:       { ...defaultAst },
      pulso:          { ...defaultAst },
      cristalizacion: { ...defaultAst },
      resonancia:     { ...defaultAst },
    }
    state.version = 4
  }

  if (v < 6) {
    if (!state.missions) {
      state.missions = {
        history: {},
        daily:   { lastReset: 0, completed: {}, clicks: 0, portalsBought: 0, abilitiesUsed: 0 },
        weekly:  { lastReset: 0, completed: {}, portalsBought: 0 },
      }
    }
    state.version = 6
  }

  if (v < 5) {
    // Agregar nuevos portales conservando los existentes
    state.portals = {
      ignea:      state.portals?.ignea      || 0,
      abismal:    state.portals?.abismal    || 0,
      temporal:   state.portals?.temporal   || 0,
      vacio:      state.portals?.vacio      || 0,
      celestial:  0,
      caos:       0,
      primordial: 0,
      singular:   0,
    }
    // Agregar nuevas keys de desbloqueo
    state.unlocks = {
      ...state.unlocks,
      portalCelestial:  false,
      portalCaos:       false,
      portalPrimordial: false,
      portalSingular:   false,
    }
    // Inicializar tracker de sinergias
    state.activeSynergies = {}
    state.version = 5
  }

  return state
}
