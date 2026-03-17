// ── Datos de mejoras ──────────────────────────────────────────────────────────
//    Texto (name) vive en js/data/strings/es.js y en.js
//    UI accede via: t('upgrade.' + id + '.name')
//    Stage 1: 3 tiers por portal (×2, ×3, ×5)
//    Stage 3: mejoras de click power (portalId: 'click')
//    Stage 4: agrega tiers 4 y 5 (×10 en 25, ×25 en 50) + globales

export const UPGRADE_DATA = [
  // ── Click power ────────────────────────────────────────────────────────────
  { id: 'ck1', portalId: 'click', multiplier: 5,  cost: 500,     requires: 0 },
  { id: 'ck2', portalId: 'click', multiplier: 10, cost: 50000,   requires: 0 },
  { id: 'ck3', portalId: 'click', multiplier: 25, cost: 2000000, requires: 0 },

  // ── Ígnea ──────────────────────────────────────────────────────────────────
  { id: 'ig1', portalId: 'ignea',    multiplier: 2, cost: 100,     requires: 1  },
  { id: 'ig2', portalId: 'ignea',    multiplier: 3, cost: 1000,    requires: 5  },
  { id: 'ig3', portalId: 'ignea',    multiplier: 5, cost: 8000,    requires: 10 },
  // ── Abismal ────────────────────────────────────────────────────────────────
  { id: 'ab1', portalId: 'abismal',  multiplier: 2, cost: 1000,    requires: 1  },
  { id: 'ab2', portalId: 'abismal',  multiplier: 3, cost: 8000,    requires: 5  },
  { id: 'ab3', portalId: 'abismal',  multiplier: 5, cost: 60000,   requires: 10 },
  // ── Temporal ──────────────────────────────────────────────────────────────
  { id: 'tm1', portalId: 'temporal', multiplier: 2, cost: 10000,   requires: 1  },
  { id: 'tm2', portalId: 'temporal', multiplier: 3, cost: 80000,   requires: 5  },
  { id: 'tm3', portalId: 'temporal', multiplier: 5, cost: 600000,  requires: 10 },
  // ── Vacío ─────────────────────────────────────────────────────────────────
  { id: 'va1', portalId: 'vacio',    multiplier: 2, cost: 100000,  requires: 1  },
  { id: 'va2', portalId: 'vacio',    multiplier: 3, cost: 800000,  requires: 5  },
  { id: 'va3', portalId: 'vacio',    multiplier: 5, cost: 6000000, requires: 10 },
]
