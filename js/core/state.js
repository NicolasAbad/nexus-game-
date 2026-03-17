// ── Estado del juego + migración de saves ────────────────────────────────────

export const SAVE_KEY         = 'nexus_save_v1'   // misma key para cargar saves existentes
export const SAVE_INTERVAL_MS = 10_000
export const MIN_OFFLINE_SECS = 30
export const UI_TICK_MS       = 100
export const CURRENT_VERSION  = 4

export function createInitialState() {
  return {
    // Recursos
    energy:            new Decimal(0),
    totalEnergyEarned: new Decimal(0),
    totalClicks:       0,

    // Portales — Stage 4 agrega celestial, caos, primordial, singular
    portals: { ignea: 0, abismal: 0, temporal: 0, vacio: 0 },

    // Mejoras compradas { upgradeId: true }
    upgrades: {},

    // Desbloqueos
    unlocks: {
      portalIgnea:    false,
      portalAbismal:  false,
      portalTemporal: false,
      portalVacio:    false,
      panelUpgrades:  false,
    },

    // Offline income
    offlineCap:        2 * 3600,
    offlineEfficiency: 0.5,

    // Habilidades activas
    // unlocked: se desbloquea al cumplir su condición
    // level: 1-5, sube con exp (usos acumulados)
    // exp: total de veces usada (para subir de nivel)
    // lastUsed: timestamp ms (para cooldown)
    // activeUntil: timestamp ms (para efectos con duración)
    // usesToday: usos gratuitos consumidos hoy
    // dailyReset: timestamp del último reset diario (medianoche)
    abilities: {
      convergencia:   { unlocked: false, level: 1, exp: 0, lastUsed: 0, activeUntil: 0, usesToday: 0, dailyReset: 0 },
      tormenta:       { unlocked: false, level: 1, exp: 0, lastUsed: 0, activeUntil: 0, usesToday: 0, dailyReset: 0 },
      pulso:          { unlocked: false, level: 1, exp: 0, lastUsed: 0, activeUntil: 0, usesToday: 0, dailyReset: 0 },
      cristalizacion: { unlocked: false, level: 1, exp: 0, lastUsed: 0, activeUntil: 0, usesToday: 0, dailyReset: 0 },
      resonancia:     { unlocked: false, level: 1, exp: 0, lastUsed: 0, activeUntil: 0, usesToday: 0, dailyReset: 0 },
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
    // Reemplaza la estructura vieja de abilities por la nueva con niveles, EXP y límite diario
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

  // Futuras migraciones se agregan aquí con: if (v < N) { ... }

  return state
}
