// ── Datos de portales ─────────────────────────────────────────────────────────
//    Texto (name/desc) vive en js/data/strings/es.js y en.js
//    UI accede via: t('portal.' + id + '.name')
//
//    BALANCE Stage 4→5 rebalance:
//    - unlockCondition count: 5 → 10 (el jugador debe invertir más antes de ver el siguiente portal)
//    - Celestial+ baseCost aumentado para que el mid/late game no se acelere demasiado:
//        celestial: 500K → 1M (×2)
//        caos:      5M  → 15M (×3)
//        primordial: 50M → 200M (×4)
//        singular:  500M → 3B  (×6)
//    - costMultiplier: 1.13 (sin cambios)

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
    unlockCondition: { type: 'portalCount', portalId: 'ignea', count: 10 },
  },
  {
    id:              'temporal',
    icon:            '⚡',
    color:           '#ffcc00',
    baseCost:        4000,
    baseProduction:  8,
    costMultiplier:  1.13,
    unlockCondition: { type: 'portalCount', portalId: 'abismal', count: 10 },
  },
  {
    id:              'vacio',
    icon:            '🌌',
    color:           '#cc44ff',
    baseCost:        50000,
    baseProduction:  60,
    costMultiplier:  1.13,
    unlockCondition: { type: 'portalCount', portalId: 'temporal', count: 10 },
  },
  {
    id:              'celestial',
    icon:            '✨',
    color:           '#ffd700',
    baseCost:        1000000,
    baseProduction:  400,
    costMultiplier:  1.13,
    unlockCondition: { type: 'portalCount', portalId: 'vacio', count: 10 },
  },
  {
    id:              'caos',
    icon:            '🌀',
    color:           '#ff2266',
    baseCost:        15000000,
    baseProduction:  2500,
    costMultiplier:  1.13,
    unlockCondition: { type: 'portalCount', portalId: 'celestial', count: 10 },
  },
  {
    id:              'primordial',
    icon:            '🔱',
    color:           '#7700cc',
    baseCost:        200000000,
    baseProduction:  15000,
    costMultiplier:  1.13,
    unlockCondition: { type: 'portalCount', portalId: 'caos', count: 10 },
  },
  {
    id:              'singular',
    icon:            '🕳️',
    color:           '#e0e0ff',
    baseCost:        3000000000,
    baseProduction:  100000,
    costMultiplier:  1.13,
    unlockCondition: { type: 'portalCount', portalId: 'primordial', count: 10 },
  },
]
