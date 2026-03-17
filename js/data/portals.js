// ── Datos de portales ─────────────────────────────────────────────────────────
//    Texto (name/desc) vive en js/data/strings/es.js y en.js
//    UI accede via: t('portal.' + id + '.name')
//    Costos actuales (Stage 1). Stage 4 los actualiza con migración de save.

export const PORTAL_DATA = [
  {
    id:              'ignea',
    icon:            '🔥',
    color:           '#ff6b35',
    baseCost:        15,
    baseProduction:  0.1,
    costMultiplier:  1.15,
    unlockCondition: { type: 'totalEnergy', amount: 10 },
  },
  {
    id:              'abismal',
    icon:            '🌊',
    color:           '#0099ff',
    baseCost:        150,
    baseProduction:  1,
    costMultiplier:  1.15,
    unlockCondition: { type: 'portalCount', portalId: 'ignea', count: 5 },
  },
  {
    id:              'temporal',
    icon:            '⚡',
    color:           '#ffcc00',
    baseCost:        1500,
    baseProduction:  8,
    costMultiplier:  1.15,
    unlockCondition: { type: 'portalCount', portalId: 'abismal', count: 5 },
  },
  {
    id:              'vacio',
    icon:            '🌌',
    color:           '#cc44ff',
    baseCost:        15000,
    baseProduction:  60,
    costMultiplier:  1.15,
    unlockCondition: { type: 'portalCount', portalId: 'temporal', count: 5 },
  },
]
