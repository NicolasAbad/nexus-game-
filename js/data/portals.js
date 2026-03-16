// ── Datos de portales ─────────────────────────────────────────────────────────
//    Costos actuales (Stage 1). Stage 4 los actualiza a 25/300/4K/50K
//    con migración de save.

export const PORTAL_DATA = [
  {
    id:              'ignea',
    name:            'Portal Ígnea',
    description:     'Dimensión de fuego primordial',
    icon:            '🔥',
    color:           '#ff6b35',
    baseCost:        15,
    baseProduction:  0.1,
    costMultiplier:  1.15,
    unlockCondition: { type: 'totalEnergy', amount: 10 },
  },
  {
    id:              'abismal',
    name:            'Portal Abismal',
    description:     'Dimensión de las profundidades oscuras',
    icon:            '🌊',
    color:           '#0099ff',
    baseCost:        150,
    baseProduction:  1,
    costMultiplier:  1.15,
    unlockCondition: { type: 'portalCount', portalId: 'ignea', count: 5 },
  },
  {
    id:              'temporal',
    name:            'Portal Temporal',
    description:     'Dimensión suspendida fuera del tiempo',
    icon:            '⚡',
    color:           '#ffcc00',
    baseCost:        1500,
    baseProduction:  8,
    costMultiplier:  1.15,
    unlockCondition: { type: 'portalCount', portalId: 'abismal', count: 5 },
  },
  {
    id:              'vacio',
    name:            'Portal del Vacío',
    description:     'El espacio entre todas las dimensiones',
    icon:            '🌌',
    color:           '#cc44ff',
    baseCost:        15000,
    baseProduction:  60,
    costMultiplier:  1.15,
    unlockCondition: { type: 'portalCount', portalId: 'temporal', count: 5 },
  },
]
