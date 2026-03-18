// ── Datos de Prestige ─────────────────────────────────────────────────────────
//    Texto vive en js/data/strings/en.js y es.js
//    UI accede via: t('prestige.node.' + id + '.name') etc.

// ── Condiciones de desbloqueo ─────────────────────────────────────────────────
// full:  Portal Singular ≥ 1  AND totalEnergyEarned ≥ 500M
// early: todos los 8 tipos de portal desbloqueados (≥1 each) → 40% yield
export const PRESTIGE_FULL_ENERGY  = 500_000_000
export const PRESTIGE_EARLY_YIELD  = 0.4   // fraction of full fragment score

// ── Cálculo de Fragmentos Dimensionales ──────────────────────────────────────
// Portal unlocks beyond ignea: +2 each (max +14)
// Portal count (highest bracket only): ≥10→+2, ≥25→+3, ≥50→+4, ≥100→+5
// Upgrades bought per 5: +1 (max ~10)
// Each active synergy: +3 (max +12)
// Each ability at L5: +2 (max +10)
export const FRAGMENT_SCORING = {
  portalUnlock:    2,
  portalCountTiers: [
    { min: 100, bonus: 5 },
    { min:  50, bonus: 4 },
    { min:  25, bonus: 3 },
    { min:  10, bonus: 2 },
  ],
  upgradesPerFive: 1,
  synergyActive:   3,
  abilityMaxLevel: 2,
}

// ── Árbol de Prestige ─────────────────────────────────────────────────────────
// tier: 1 = available from run 1+  |  2 = available from run 2+
// requires: [] = no dependency within branch
// Branch D nodes cost 0 and auto-unlock (no purchase required)
export const PRESTIGE_NODES = [

  // Branch A — Viajeros
  { id: 'a1', branch: 'A', cost: 5,  tier: 1, requires: [],     effect: { type: 'viajero_kael'    } },
  { id: 'a2', branch: 'A', cost: 10, tier: 2, requires: ['a1'], effect: { type: 'expedition_slot' } },
  { id: 'a3', branch: 'A', cost: 15, tier: 2, requires: ['a2'], effect: { type: 'ability_exp_bonus', pct: 50 } },

  // Branch B — Ascended Upgrades (tier 6 ×150 per portal)
  { id: 'b1', branch: 'B', cost: 4,  tier: 1, requires: [],     effect: { type: 'ascended', portals: ['ignea'] } },
  { id: 'b2', branch: 'B', cost: 6,  tier: 1, requires: ['b1'], effect: { type: 'ascended', portals: ['abismal', 'temporal'] } },
  { id: 'b3', branch: 'B', cost: 8,  tier: 2, requires: ['b2'], effect: { type: 'ascended', portals: ['vacio', 'celestial'] } },
  { id: 'b4', branch: 'B', cost: 12, tier: 2, requires: ['b3'], effect: { type: 'ascended', portals: ['caos', 'primordial', 'singular'] } },

  // Branch C — Quality of Life
  { id: 'c1', branch: 'C', cost: 3, tier: 1, requires: [],     effect: { type: 'offline_cap', hours: 4 } },
  { id: 'c2', branch: 'C', cost: 4, tier: 1, requires: ['c1'], effect: { type: 'free_first_portal' } },
  { id: 'c3', branch: 'C', cost: 5, tier: 2, requires: ['c2'], effect: { type: 'upgrade_discount', pct: 15 } },

  // Branch D — Story (auto-unlocked, no cost, no purchase)
  { id: 'd1', branch: 'D', cost: 0, tier: 1, requires: [], effect: { type: 'story_chapter', chapter: 1 }, auto: true },
  { id: 'd2', branch: 'D', cost: 0, tier: 2, requires: [], effect: { type: 'story_chapter', chapter: 2 }, auto: true },
]
