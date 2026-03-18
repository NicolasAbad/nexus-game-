// ── Datos de Combos de Portales ────────────────────────────────────────────────
//
//  PASSIVE_COMBOS   — se activan al mantener el threshold de portales
//  CONSUMABLE_COMBOS— sacrificás portales para obtener un bonus permanente
//
//  Effect types (diferenciados de synergies que sólo usan globalMult):
//    portal_pair_mult   { portals: [...], mult }    — boost a un par de portales
//    offline_add_hours  { hours }                   — suma horas al cap offline
//    offline_eff_add    { pct }                     — suma % a la eficiencia offline
//    click_power_mult   { mult }                    — multiplica el click power
//    prestige_frag_mult { mult }                    — multiplica fragmentos al prestigiar
//    global_mult        { mult }                    — multiplica toda la producción
//    global_and_portal  { globalMult, portalMult, portals: [...] } — ambos a la vez

export const PASSIVE_COMBOS = [
  // Tier 1 — thresholds bajos, efectos focalizados
  {
    id:      'fire_tide',
    portals: [{ id: 'ignea', count: 50 }, { id: 'abismal', count: 50 }],
    effect:  { type: 'portal_pair_mult', portals: ['ignea', 'abismal'], mult: 1.5 },
  },
  {
    id:      'time_void',
    portals: [{ id: 'temporal', count: 50 }, { id: 'vacio', count: 50 }],
    effect:  { type: 'offline_add_hours', hours: 2 },
  },
  {
    id:      'primordial_heart',
    portals: [{ id: 'primordial', count: 30 }, { id: 'singular', count: 30 }],
    effect:  { type: 'click_power_mult', mult: 3 },
  },

  // Tier 2 — thresholds medios, efectos globales
  {
    id:      'star_chaos',
    portals: [{ id: 'celestial', count: 50 }, { id: 'caos', count: 50 }],
    effect:  { type: 'global_mult', mult: 1.25 },
  },
  {
    id:      'infernal_depths',
    portals: [{ id: 'ignea', count: 100 }, { id: 'abismal', count: 100 }],
    effect:  { type: 'offline_eff_add', pct: 0.2 },
  },
  {
    id:      'time_celestial',
    portals: [{ id: 'temporal', count: 75 }, { id: 'celestial', count: 75 }],
    effect:  { type: 'prestige_frag_mult', mult: 1.5 },
  },
  {
    id:      'void_chaos',
    portals: [{ id: 'vacio', count: 75 }, { id: 'caos', count: 75 }],
    effect:  { type: 'global_mult', mult: 1.5 },
  },

  // Tier 3 — all eight: logro máximo de portales
  {
    id:      'all_eight',
    portals: [
      { id: 'ignea', count: 50 }, { id: 'abismal', count: 50 },
      { id: 'temporal', count: 50 }, { id: 'vacio', count: 50 },
      { id: 'celestial', count: 50 }, { id: 'caos', count: 50 },
      { id: 'primordial', count: 50 }, { id: 'singular', count: 50 },
    ],
    effect: { type: 'global_and_portal', globalMult: 2, portalMult: 1.2,
              portals: ['ignea','abismal','temporal','vacio','celestial','caos','primordial','singular'] },
  },
]

export const CONSUMABLE_COMBOS = [
  // Sacrificar portales obtiene un bonus permanente y no se puede deshacer
  {
    id:     'ember_sacrifice',
    cost:   [{ id: 'ignea', count: 50 }, { id: 'abismal', count: 50 }],
    effect: { type: 'global_mult', mult: 2 },
  },
  {
    id:     'time_convergence',
    cost:   [{ id: 'temporal', count: 100 }, { id: 'vacio', count: 50 }],
    effect: { type: 'offline_add_hours', hours: 6 },
  },
  {
    id:     'chaos_singularity',
    cost:   [{ id: 'caos', count: 100 }, { id: 'singular', count: 100 }],
    effect: { type: 'global_mult', mult: 5 },
  },
  {
    id:     'celestial_ascension',
    cost:   [{ id: 'celestial', count: 200 }, { id: 'primordial', count: 100 }],
    effect: { type: 'click_power_mult', mult: 10 },
  },
  {
    id:     'nexo_rebirth',
    cost:   [
      { id: 'ignea', count: 50 }, { id: 'abismal', count: 50 },
      { id: 'temporal', count: 50 }, { id: 'vacio', count: 50 },
      { id: 'celestial', count: 50 }, { id: 'caos', count: 50 },
      { id: 'primordial', count: 50 }, { id: 'singular', count: 50 },
    ],
    effect: { type: 'prestige_frag_mult', mult: 2 },
  },
]
