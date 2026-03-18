// ── Datos de Lore ─────────────────────────────────────────────────────────────
//    Texto vive en js/data/strings/en.js y es.js
//    UI accede via: t('lore.' + fragment.id + '.text')
//                   t('lore.' + stub.id + '.title')

// One fragment per portal — revealed when the portal is unlocked
export const PORTAL_FRAGMENTS = [
  { id: 'frag_ignea',      portalId: 'ignea'      },
  { id: 'frag_abismal',    portalId: 'abismal'    },
  { id: 'frag_temporal',   portalId: 'temporal'   },
  { id: 'frag_vacio',      portalId: 'vacio'      },
  { id: 'frag_celestial',  portalId: 'celestial'  },
  { id: 'frag_caos',       portalId: 'caos'       },
  { id: 'frag_primordial', portalId: 'primordial' },
  { id: 'frag_singular',   portalId: 'singular'   },
]

// Prestige chapter stubs — full text added in Stage 14
export const PRESTIGE_STUBS = [
  { id: 'prestige_1', tier: 1 },
  { id: 'prestige_2', tier: 2 },
  { id: 'prestige_3', tier: 3 },
  { id: 'prestige_4', tier: 4 },
  { id: 'prestige_5', tier: 5 },
  { id: 'prestige_6', tier: 6 },
  { id: 'prestige_7', tier: 7 },
]
