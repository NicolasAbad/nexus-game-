// ── Datos de portales ─────────────────────────────────────────────────────────
//    Texto (name/desc) vive en js/data/strings/es.js y en.js
//    UI accede via: t('portal.' + id + '.name')
//    Stage 4: 4 portales nuevos + costos rebalanceados + costMultiplier 1.13

export const PORTAL_DATA = [
  {
    id:              'ignea',
    icon:            '🔥',
    color:           '#ff6b35',
    baseCost:        25,
    baseProduction:  0.1,
    costMultiplier:  1.13,
    unlockCondition: { type: 'totalEnergy', amount: 10 },
  },
  {
    id:              'abismal',
    icon:            '🌊',
    color:           '#0099ff',
    baseCost:        300,
    baseProduction:  1,
    costMultiplier:  1.13,
    unlockCondition: { type: 'portalCount', portalId: 'ignea', count: 5 },
  },
  {
    id:              'temporal',
    icon:            '⚡',
    color:           '#ffcc00',
    baseCost:        4000,
    baseProduction:  8,
    costMultiplier:  1.13,
    unlockCondition: { type: 'portalCount', portalId: 'abismal', count: 5 },
  },
  {
    id:              'vacio',
    icon:            '🌌',
    color:           '#cc44ff',
    baseCost:        50000,
    baseProduction:  60,
    costMultiplier:  1.13,
    unlockCondition: { type: 'portalCount', portalId: 'temporal', count: 5 },
  },
  {
    id:              'celestial',
    icon:            '✨',
    color:           '#ffd700',
    baseCost:        500000,
    baseProduction:  400,
    costMultiplier:  1.13,
    unlockCondition: { type: 'portalCount', portalId: 'vacio', count: 5 },
  },
  {
    id:              'caos',
    icon:            '🌀',
    color:           '#ff2266',
    baseCost:        5000000,
    baseProduction:  2500,
    costMultiplier:  1.13,
    unlockCondition: { type: 'portalCount', portalId: 'celestial', count: 5 },
  },
  {
    id:              'primordial',
    icon:            '🔱',
    color:           '#7700cc',
    baseCost:        50000000,
    baseProduction:  15000,
    costMultiplier:  1.13,
    unlockCondition: { type: 'portalCount', portalId: 'caos', count: 5 },
  },
  {
    id:              'singular',
    icon:            '🕳️',
    color:           '#e0e0ff',
    baseCost:        500000000,
    baseProduction:  100000,
    costMultiplier:  1.13,
    unlockCondition: { type: 'portalCount', portalId: 'primordial', count: 5 },
  },
]
