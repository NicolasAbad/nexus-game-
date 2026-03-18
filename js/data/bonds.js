// ── Bond & Fusion Data ─────────────────────────────────────────────────────────
//
//  BOND_DATA — 6 bonds, each between two Viajeros.
//  A bond activates when:
//   1. Both Viajeros are owned
//   2. Combined resonance of both Viajeros >= resonanceRequired
//
//  effect types:
//    portal_pair_mult   → { type, portals: [id, id], mult }  multiply two specific portals
//    offline_cap_mult   → { type, mult }                      multiply offline cap hours
//    expedition_yield   → { type, mult }                      multiply all expedition energy loot
//    all_portal_mult    → { type, mult }                      multiply all portals
//    global_mult        → { type, mult }                      multiply total production (after portal sum)
//
//  FUSION_TABLE — each entry: 3× sourceId (gacha only) → targetId
//  Consuming 3 copies of sourceId removes them from artifacts/roster duplicates
//  and adds one instance of targetId.
//  Only gacha-sourced Viajeros can be fused (kael/lyra are excluded — prestige arrivals).
// ──────────────────────────────────────────────────────────────────────────────

export const BOND_DATA = [
  {
    id:                'celestial_flame',
    viajeros:          ['kael', 'solara'],
    resonanceRequired: 1,          // just own both + res≥1 each
    effect: { type: 'portal_pair_mult', portals: ['ignea', 'celestial'], mult: 2.00 },
  },
  {
    id:                'eternal_loop',
    viajeros:          ['chronus', 'tempus'],
    resonanceRequired: 1,
    effect: { type: 'offline_cap_mult', mult: 3.00 },
  },
  {
    id:                'blood_of_abyss',
    viajeros:          ['lyra', 'abyssus'],
    resonanceRequired: 1,
    effect: { type: 'expedition_yield', mult: 3.00 },
  },
  {
    id:                'void_siblings',
    viajeros:          ['presence', 'null'],
    resonanceRequired: 3,
    effect: { type: 'all_portal_mult', mult: 1.25 },
  },
  {
    id:                'lost_origin',
    viajeros:          ['cartographer', 'weaver'],
    resonanceRequired: 6,
    effect: { type: 'global_mult', mult: 1.50 },
  },
  {
    id:                'chaos_and_order',
    viajeros:          ['fracture', 'origin'],
    resonanceRequired: 6,
    effect: { type: 'global_mult', mult: 1.30 },
  },
]

// ── Fusion paths ───────────────────────────────────────────────────────────────
// 3× sourceId (gacha-sourced only) → 1× targetId
// The 3 source copies are consumed. The target is added to the roster.
// If target is already owned, adds a duplicate (can be used for star upgrades).
export const FUSION_TABLE = [
  // Common → Raro (same dimension)
  { source: 'vex',     target: 'chronus'  },   // temporal  common → raro
  { source: 'null',    target: 'shade'    },   // vacio     common → raro
  { source: 'aether',  target: 'solara'   },   // celestial common → raro
  { source: 'rift',    target: 'khaos'    },   // caos      common → raro

  // Raro → Épico (same dimension)
  { source: 'embera',  target: 'pyron'    },   // ignea     raro → epico
  { source: 'marea',   target: 'abyssus'  },   // abismal   raro → epico
  { source: 'chronus', target: 'tempus'   },   // temporal  raro → epico
  { source: 'shade',   target: 'presence' },   // vacio     raro → epico
  { source: 'solara',  target: 'stellan'  },   // celestial raro → epico
  { source: 'khaos',   target: 'fracture' },   // caos      raro → epico
  { source: 'antiga',  target: 'nexar'    },   // primordial raro → epico

  // Épico → Legendario (cross-dimension, thematic)
  { source: 'nexar',    target: 'origin'       },  // primordial epico → legendario
  { source: 'fracture', target: 'singularis'   },  // caos epico → singular legendario
  { source: 'tempus',   target: 'cartographer' },  // temporal epico → unknown legendario
  { source: 'presence', target: 'weaver'       },  // vacio epico → unknown legendario
]
