// ── Sinergias cross-portal ────────────────────────────────────────────────────
//    Tener X de portal A + X de portal B activa un bonus global permanente.
//    UI completa en Stage 10. Aquí solo datos + notificación al activar.
//    globalMult: multiplicador sobre toda la producción (se acumulan)

export const SYNERGY_DATA = [
  {
    id:         'infernal_depths',
    portals:    [{ id: 'ignea', count: 10 }, { id: 'abismal', count: 10 }],
    globalMult: 1.5,
  },
  {
    id:         'frozen_void',
    portals:    [{ id: 'temporal', count: 10 }, { id: 'vacio', count: 10 }],
    globalMult: 2,
  },
  {
    id:         'celestial_rift',
    portals:    [{ id: 'celestial', count: 15 }, { id: 'caos', count: 15 }],
    globalMult: 3,
  },
  {
    id:         'primordial_singularity',
    portals:    [{ id: 'primordial', count: 10 }, { id: 'singular', count: 5 }],
    globalMult: 5,
  },
]
