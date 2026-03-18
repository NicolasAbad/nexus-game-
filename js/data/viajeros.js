// ── Datos de Viajeros ─────────────────────────────────────────────────────────
//    Texto (nombres, descs) vive en js/data/strings/
//    24 Viajeros: 3 por dimensión + 2 Legendarios especiales
//
//  arrivalSource:
//    'prestige_a1' → arrives when A1 prestige node is owned
//    'prestige_a2' → arrives when A2 prestige node is owned
//    'gacha'       → available in the gacha pool
//
//  roles: 'guardian' | 'explorer' | 'special' | 'council'
//
//  guardianEffect types:
//    portal_mult         → { type, portalId, mult }  multiplies assigned portal's prod
//    global_mult         → { type, mult }             multiplies ALL portals when assigned
//    multi_portal_mult   → { type, portals, mult }    multiplies listed portals
//
//  explorerEffect types:
//    expedition_yield    → { type, mult }   multiply energy loot
//    expedition_time     → { type, mult }   multiply duration (0.75 = -25% time)
//    expedition_prestige → { type, bonus }  +N prestige frags per expedition
//    cooldown_reduction  → { type, pct }    reduce ability cooldowns (passive, applies globally)
//
//  passiveEffect types (always active, not role-dependent):
//    global_mult          → { type, mult }
//    offline_cap_bonus    → { type, mult }   multiply offline cap
//    prestige_frag_bonus  → { type, mult }   multiply prestige fragment scoring
//    extra_expedition_slot→ { type }          unlocks extra expedition slot
//
//  bonusEffect: optional secondary effect on top of guardian/explorer role

export const VIAJERO_DATA = [

  // ── Ígnea ──────────────────────────────────────────────────────────────────
  {
    id:        'kael',
    dimension: 'ignea',
    rarity:    'common',
    role:      'guardian',
    icon:      '🔥',
    arrivalSource: 'prestige_a1',
    guardianEffect: { type: 'portal_mult', portalId: 'ignea', mult: 1.20 },
  },
  {
    id:        'embera',
    dimension: 'ignea',
    rarity:    'raro',
    role:      'explorer',
    icon:      '🌋',
    arrivalSource: 'gacha',
    explorerEffect: { type: 'expedition_yield', mult: 1.50 },
  },
  {
    id:        'pyron',
    dimension: 'ignea',
    rarity:    'epico',
    role:      'guardian',
    icon:      '💥',
    arrivalSource: 'gacha',
    guardianEffect: { type: 'portal_mult', portalId: 'ignea', mult: 2.00 },
    // auto-buy at 85% cost → Stage 9
  },

  // ── Abismal ────────────────────────────────────────────────────────────────
  {
    id:        'lyra',
    dimension: 'abismal',
    rarity:    'common',
    role:      'explorer',
    icon:      '🌊',
    arrivalSource: 'prestige_a2',
    explorerEffect: { type: 'expedition_time', mult: 0.75 },  // -25% time
  },
  {
    id:        'marea',
    dimension: 'abismal',
    rarity:    'raro',
    role:      'guardian',
    icon:      '🌀',
    arrivalSource: 'gacha',
    guardianEffect: { type: 'portal_mult', portalId: 'abismal', mult: 1.35 },
  },
  {
    id:        'abyssus',
    dimension: 'abismal',
    rarity:    'epico',
    role:      'explorer',
    icon:      '🦑',
    arrivalSource: 'gacha',
    explorerEffect: { type: 'expedition_prestige', bonus: 1 },
  },

  // ── Temporal ───────────────────────────────────────────────────────────────
  {
    id:        'vex',
    dimension: 'temporal',
    rarity:    'common',
    role:      'explorer',
    icon:      '⚡',
    arrivalSource: 'gacha',
    explorerEffect: { type: 'cooldown_reduction', pct: 0.10 },
  },
  {
    id:        'chronus',
    dimension: 'temporal',
    rarity:    'raro',
    role:      'guardian',
    icon:      '⏰',
    arrivalSource: 'gacha',
    guardianEffect: { type: 'portal_mult', portalId: 'temporal', mult: 1.50 },
    // auto portal buying → Stage 9
  },
  {
    id:        'tempus',
    dimension: 'temporal',
    rarity:    'epico',
    role:      'guardian',
    icon:      '🕰️',
    arrivalSource: 'gacha',
    guardianEffect: { type: 'portal_mult', portalId: 'temporal', mult: 2.00 },
    passiveEffect:  { type: 'offline_cap_bonus', mult: 1.50 },
  },

  // ── Vacío ──────────────────────────────────────────────────────────────────
  {
    id:        'null',
    dimension: 'vacio',
    rarity:    'common',
    role:      'guardian',
    icon:      '🌌',
    arrivalSource: 'gacha',
    guardianEffect: { type: 'portal_mult', portalId: 'vacio', mult: 1.25 },
  },
  {
    id:        'shade',
    dimension: 'vacio',
    rarity:    'raro',
    role:      'explorer',
    icon:      '🌑',
    arrivalSource: 'gacha',
    explorerEffect: { type: 'expedition_yield', mult: 2.00 },  // ×2 yield 12am-6am (simplified: always ×2 for Stage 8)
  },
  {
    id:        'presence',
    dimension: 'vacio',
    rarity:    'epico',
    role:      'special',
    icon:      '👁️',
    arrivalSource: 'gacha',
    guardianEffect: { type: 'global_mult', mult: 1.10 },
  },

  // ── Celestial ──────────────────────────────────────────────────────────────
  {
    id:        'aether',
    dimension: 'celestial',
    rarity:    'common',
    role:      'explorer',
    icon:      '✨',
    arrivalSource: 'gacha',
    explorerEffect: { type: 'expedition_yield', mult: 1.25 },
  },
  {
    id:        'solara',
    dimension: 'celestial',
    rarity:    'raro',
    role:      'guardian',
    icon:      '☀️',
    arrivalSource: 'gacha',
    guardianEffect: { type: 'portal_mult', portalId: 'celestial', mult: 1.40 },
    bonusEffect:    { type: 'portal_mult', portalId: 'ignea', mult: 1.15 },  // +15% ignea when assigned
  },
  {
    id:        'stellan',
    dimension: 'celestial',
    rarity:    'epico',
    role:      'guardian',
    icon:      '⭐',
    arrivalSource: 'gacha',
    guardianEffect: { type: 'portal_mult', portalId: 'celestial', mult: 2.50 },
    bonusEffect:    { type: 'click_mult', mult: 3.00 },
  },

  // ── Caos ───────────────────────────────────────────────────────────────────
  {
    id:        'rift',
    dimension: 'caos',
    rarity:    'common',
    role:      'explorer',
    icon:      '🌀',
    arrivalSource: 'gacha',
    explorerEffect: { type: 'expedition_yield', mult: 1.20 },
  },
  {
    id:        'khaos',
    dimension: 'caos',
    rarity:    'raro',
    role:      'guardian',
    icon:      '🌪️',
    arrivalSource: 'gacha',
    guardianEffect: { type: 'portal_mult', portalId: 'caos', mult: 1.50 },
  },
  {
    id:        'fracture',
    dimension: 'caos',
    rarity:    'epico',
    role:      'special',
    icon:      '💢',
    arrivalSource: 'gacha',
    guardianEffect: { type: 'portal_mult', portalId: 'caos', mult: 1.80 },
    // timed burst: every 5 min prod ×3 for 15s → Stage 9
  },

  // ── Primordial ─────────────────────────────────────────────────────────────
  {
    id:        'antiga',
    dimension: 'primordial',
    rarity:    'raro',
    role:      'guardian',
    icon:      '🌍',
    arrivalSource: 'gacha',
    guardianEffect: { type: 'multi_portal_mult', portals: ['ignea', 'temporal', 'celestial'], mult: 1.30 },
  },
  {
    id:        'nexar',
    dimension: 'primordial',
    rarity:    'epico',
    role:      'special',
    icon:      '🔮',
    arrivalSource: 'gacha',
    passiveEffect: { type: 'prestige_frag_bonus', mult: 1.10 },
  },
  {
    id:        'origin',
    dimension: 'primordial',
    rarity:    'legendario',
    role:      'council',
    icon:      '🌱',
    arrivalSource: 'gacha',
    passiveEffect: { type: 'extra_expedition_slot' },
  },

  // ── Singular ───────────────────────────────────────────────────────────────
  {
    id:        'singularis',
    dimension: 'singular',
    rarity:    'legendario',
    role:      'special',
    icon:      '⬛',
    arrivalSource: 'gacha',
    passiveEffect: { type: 'global_mult', mult: 1.25 },
    // active: ×5 all portals for 1 min, 1h cooldown → Stage 9
  },

  // ── Unknown / Legendarios ──────────────────────────────────────────────────
  {
    id:        'cartographer',
    dimension: 'unknown',
    rarity:    'legendario',
    role:      'council',
    icon:      '🗺️',
    arrivalSource: 'gacha',
    passiveEffect: { type: 'global_mult', mult: 1.15 },
  },
  {
    id:        'weaver',
    dimension: 'unknown',
    rarity:    'legendario',
    role:      'council',
    icon:      '🕸️',
    arrivalSource: 'gacha',
    passiveEffect: { type: 'global_mult', mult: 1.20 },
    // connects 2 Viajeros to share abilities → Stage 9
  },
]

// ── Gacha rates ───────────────────────────────────────────────────────────────
export const GACHA_RATES = {
  common:    0.65,
  raro:      0.25,
  epico:     0.09,
  legendario: 0.01,
}
export const GACHA_PITY_HARD    = 80   // guaranteed Épico at 80 pulls
export const GACHA_PITY_SOFT    = 60   // soft pity starts increasing rate at 60
export const GACHA_COST_SINGLE  = 100  // crystals per pull
export const GACHA_COST_TEN     = 900  // crystals per 10-pull

// ── Expedition config ─────────────────────────────────────────────────────────
// durationH: base expedition duration in hours per dimension
export const EXPEDITION_DURATION_H = {
  ignea:      1,
  abismal:    2,
  temporal:   4,
  vacio:      6,
  celestial:  8,
  caos:       12,
  primordial: 24,
  singular:   48,
  unknown:    12,
}

// Loot tables by Viajero rarity
// energyMinutes: base energy loot = currentProd × energyMinutes × 60
// crystals: flat crystal reward
// prestigeFrags: flat prestige fragment reward
// artifactChance: probability of dropping an artifact
// artifactPool: which artifact IDs can drop
export const EXPEDITION_LOOT = {
  common: {
    energyMinutes: 30,
    crystals:      0,
    prestigeFrags: 0,
    artifactChance: 0.10,
    artifactPool: ['head_ember', 'wpn_fire', 'rel_compass'],
  },
  raro: {
    energyMinutes: 60,
    crystals:      5,
    prestigeFrags: 0,
    artifactChance: 0.15,
    artifactPool: ['head_temporal', 'wpn_abyss', 'rel_hourglass', 'head_ember', 'wpn_fire'],
  },
  epico: {
    energyMinutes: 120,
    crystals:      15,
    prestigeFrags: 1,
    artifactChance: 0.20,
    artifactPool: ['head_void', 'wpn_chaos', 'rel_nexus', 'head_temporal', 'wpn_abyss'],
  },
  legendario: {
    energyMinutes: 240,
    crystals:      50,
    prestigeFrags: 2,
    artifactChance: 0.25,
    artifactPool: ['head_celestial', 'wpn_singularis', 'rel_primal', 'head_void', 'wpn_chaos'],
  },
}

// ── Artifact definitions ──────────────────────────────────────────────────────
// stat.base: value at star 1
// stat at star N: base × N (for click_mult: base ^ N for balance)
//
// stat types:
//   prod_pct        → adds pct to portal production multiplier of assigned Guardian
//   click_mult      → multiplies click power (global)
//   exp_speed       → reduces expedition duration (fraction, stackable up to 0.75 max)
//   cd_reduction    → reduces ability cooldowns (fraction, stackable up to 0.50 max)
export const ARTIFACT_DATA = [
  // ── Head (prod_pct) ───────────────────────────────────────────────────────
  { id: 'head_ember',     slot: 'head',   rarity: 'common',    stat: { type: 'prod_pct',  base: 0.05 } },
  { id: 'head_temporal',  slot: 'head',   rarity: 'raro',      stat: { type: 'prod_pct',  base: 0.08 } },
  { id: 'head_void',      slot: 'head',   rarity: 'epico',     stat: { type: 'prod_pct',  base: 0.12 } },
  { id: 'head_celestial', slot: 'head',   rarity: 'legendario',stat: { type: 'prod_pct',  base: 0.20 } },

  // ── Weapon (click_mult) ───────────────────────────────────────────────────
  { id: 'wpn_fire',       slot: 'weapon', rarity: 'common',    stat: { type: 'click_mult', base: 1.5  } },
  { id: 'wpn_abyss',      slot: 'weapon', rarity: 'raro',      stat: { type: 'click_mult', base: 2.0  } },
  { id: 'wpn_chaos',      slot: 'weapon', rarity: 'epico',     stat: { type: 'click_mult', base: 3.0  } },
  { id: 'wpn_singularis', slot: 'weapon', rarity: 'legendario',stat: { type: 'click_mult', base: 5.0  } },

  // ── Relic (exp_speed / cd_reduction) ─────────────────────────────────────
  { id: 'rel_compass',    slot: 'relic',  rarity: 'common',    stat: { type: 'exp_speed',    base: 0.10 } },
  { id: 'rel_hourglass',  slot: 'relic',  rarity: 'raro',      stat: { type: 'exp_speed',    base: 0.15 } },
  { id: 'rel_nexus',      slot: 'relic',  rarity: 'epico',     stat: { type: 'cd_reduction', base: 0.05 } },
  { id: 'rel_primal',     slot: 'relic',  rarity: 'legendario',stat: { type: 'cd_reduction', base: 0.10 } },
]
