// ── Habilidades activas ───────────────────────────────────────────────────────
// Texto (name/desc/unlock label) vive en js/data/strings/es.js y en.js
// UI accede via: t('ability.' + id + '.name'), t('ability.' + id + '.unlock')
//
// EXP thresholds (total de usos para alcanzar cada nivel):
//   L1=0 | L2=15 | L3=55 | L4=135 | L5=285
//
// Usos gratuitos por día: dailyFree. Extras con anuncio: dailyAd (Stage 19).
// Cooldown en horas.

export const EXP_THRESHOLDS = [0, 10, 30, 75, 150]  // índice 0=L1 … 4=L5

export const ABILITY_DATA = [
  {
    id:       'convergencia',
    icon:     '🔮',
    type:     'buff',         // aplica productionMult al game loop
    dailyFree: 3,
    dailyAd:   4,
    unlockCondition: { type: 'totalEnergy', amount: 50000 },
    levels: [
      { level: 1, mult: 2,   duration: 30, cooldownH: 6   },
      { level: 2, mult: 2,   duration: 45, cooldownH: 5   },
      { level: 3, mult: 2.5, duration: 45, cooldownH: 4   },
      { level: 4, mult: 2.5, duration: 60, cooldownH: 3.5 },
      { level: 5, mult: 3,   duration: 60, cooldownH: 3   },
    ],
  },
  {
    id:       'tormenta',
    icon:     '⚡',
    type:     'autoclicker',
    dailyFree: 3,
    dailyAd:   4,
    unlockCondition: { type: 'totalPortals', amount: 25 },
    levels: [
      { level: 1, intervalMs: 150, clickMult: 1, duration: 10, cooldownH: 8   },
      { level: 2, intervalMs: 150, clickMult: 1, duration: 12, cooldownH: 7   },
      { level: 3, intervalMs: 120, clickMult: 1, duration: 15, cooldownH: 6   },
      { level: 4, intervalMs: 100, clickMult: 2, duration: 20, cooldownH: 5   },
      { level: 5, intervalMs: 80,  clickMult: 3, duration: 25, cooldownH: 4   },
    ],
  },
  {
    id:       'pulso',
    icon:     '💫',
    type:     'instant',
    dailyFree: 3,
    dailyAd:   4,
    unlockCondition: { type: 'portalCount', portalId: 'vacio', count: 1 },
    levels: [
      { level: 1, prodMinutes: 10, cooldownH: 8 },
      { level: 2, prodMinutes: 12, cooldownH: 7 },
      { level: 3, prodMinutes: 15, cooldownH: 6 },
      { level: 4, prodMinutes: 18, cooldownH: 5 },
      { level: 5, prodMinutes: 25, cooldownH: 4 },
    ],
  },
  {
    id:       'cristalizacion',
    icon:     '❄️',
    type:     'costReduction',
    dailyFree: 1,
    dailyAd:   4,
    unlockCondition: { type: 'totalPortals', amount: 100 },
    levels: [
      { level: 1, discount: 0.10, duration: 20, cooldownH: 24 },
      { level: 2, discount: 0.20, duration: 25, cooldownH: 24 },
      { level: 3, discount: 0.30, duration: 30, cooldownH: 24 },
      { level: 4, discount: 0.40, duration: 35, cooldownH: 24 },
      { level: 5, discount: 0.50, duration: 40, cooldownH: 24 },
    ],
  },
  {
    id:       'resonancia',
    icon:     '🔗',
    type:     'chain',
    dailyFree: 1,
    dailyAd:   4,
    unlockCondition: { type: 'allPortalTypes' },
    levels: [
      { level: 1, bonusPerPortal: 0.10, duration: 20, cooldownH: 24 },
      { level: 2, bonusPerPortal: 0.15, duration: 25, cooldownH: 24 },
      { level: 3, bonusPerPortal: 0.20, duration: 30, cooldownH: 24 },
      { level: 4, bonusPerPortal: 0.25, duration: 35, cooldownH: 24 },
      { level: 5, bonusPerPortal: 0.30, duration: 40, cooldownH: 24 },
    ],
  },
]
