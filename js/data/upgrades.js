// ── Datos de mejoras ──────────────────────────────────────────────────────────
//    Texto (name) vive en js/data/strings/es.js y en.js
//    UI accede via: t('upgrade.' + id + '.name')
//
//    Tiers: ×2 en 1, ×3 en 5, ×5 en 10, ×10 en 25, ×25 en 50
//    Combined at 50 portals with all upgrades: ×7,500 per portal
//
//    BALANCE rebalance:
//    - Celestial+ baseCosts aumentaron → costos de mejoras escalados proporcionalmente:
//        ce ×2, ca ×3, pr ×4, si ×6
//    - Ignea–Vacío sin cambios (el early/mid game se balancea via misiones)

export const UPGRADE_DATA = [

  // ── Click power (multiplicador fijo) ────────────────────────────────────────
  { id: 'ck1', portalId: 'click', multiplier: 5,   cost: 500        },
  { id: 'ck2', portalId: 'click', multiplier: 10,  cost: 50000      },
  { id: 'ck3', portalId: 'click', multiplier: 25,  cost: 2000000    },
  // Click basado en producción total: click = prodMinutes × producción/s × 60
  { id: 'ck4', portalId: 'click', prodMinutes: 1,  cost: 20000000   },
  { id: 'ck5', portalId: 'click', prodMinutes: 5,  cost: 2000000000 },

  // ── Global (afectan todos los portales) ─────────────────────────────────────
  //    Visible cuando totalEnergyEarned >= requiresEnergy
  { id: 'gl1', portalId: 'global', multiplier: 1.5, cost: 2000000,          requiresEnergy: 1000000        },
  { id: 'gl2', portalId: 'global', multiplier: 2,   cost: 1000000000,       requiresEnergy: 500000000      },
  { id: 'gl3', portalId: 'global', multiplier: 3,   cost: 2000000000000,    requiresEnergy: 1000000000000  },

  // ── Ígnea ──────────────────────────────────────────────────────────────────
  { id: 'ig1', portalId: 'ignea', multiplier: 2,  cost: 100,      requires: 1  },
  { id: 'ig2', portalId: 'ignea', multiplier: 3,  cost: 1000,     requires: 5  },
  { id: 'ig3', portalId: 'ignea', multiplier: 5,  cost: 8000,     requires: 10 },
  { id: 'ig4', portalId: 'ignea', multiplier: 10, cost: 60000,    requires: 25 },
  { id: 'ig5', portalId: 'ignea', multiplier: 25, cost: 500000,   requires: 50 },

  // ── Abismal ────────────────────────────────────────────────────────────────
  { id: 'ab1', portalId: 'abismal', multiplier: 2,  cost: 1000,       requires: 1  },
  { id: 'ab2', portalId: 'abismal', multiplier: 3,  cost: 8000,       requires: 5  },
  { id: 'ab3', portalId: 'abismal', multiplier: 5,  cost: 60000,      requires: 10 },
  { id: 'ab4', portalId: 'abismal', multiplier: 10, cost: 750000,     requires: 25 },
  { id: 'ab5', portalId: 'abismal', multiplier: 25, cost: 6000000,    requires: 50 },

  // ── Temporal ──────────────────────────────────────────────────────────────
  { id: 'tm1', portalId: 'temporal', multiplier: 2,  cost: 10000,      requires: 1  },
  { id: 'tm2', portalId: 'temporal', multiplier: 3,  cost: 80000,      requires: 5  },
  { id: 'tm3', portalId: 'temporal', multiplier: 5,  cost: 600000,     requires: 10 },
  { id: 'tm4', portalId: 'temporal', multiplier: 10, cost: 10000000,   requires: 25 },
  { id: 'tm5', portalId: 'temporal', multiplier: 25, cost: 80000000,   requires: 50 },

  // ── Vacío ─────────────────────────────────────────────────────────────────
  { id: 'va1', portalId: 'vacio', multiplier: 2,  cost: 100000,      requires: 1  },
  { id: 'va2', portalId: 'vacio', multiplier: 3,  cost: 800000,      requires: 5  },
  { id: 'va3', portalId: 'vacio', multiplier: 5,  cost: 6000000,     requires: 10 },
  { id: 'va4', portalId: 'vacio', multiplier: 10, cost: 100000000,   requires: 25 },
  { id: 'va5', portalId: 'vacio', multiplier: 25, cost: 1000000000,  requires: 50 },

  // ── Celestial (costos ×2 respecto al diseño original) ─────────────────────
  { id: 'ce1', portalId: 'celestial', multiplier: 2,  cost: 4000000,      requires: 1  },
  { id: 'ce2', portalId: 'celestial', multiplier: 3,  cost: 40000000,     requires: 5  },
  { id: 'ce3', portalId: 'celestial', multiplier: 5,  cost: 320000000,    requires: 10 },
  { id: 'ce4', portalId: 'celestial', multiplier: 10, cost: 3000000000,   requires: 25 },
  { id: 'ce5', portalId: 'celestial', multiplier: 25, cost: 30000000000,  requires: 50 },

  // ── Caos (costos ×3) ──────────────────────────────────────────────────────
  { id: 'ca1', portalId: 'caos', multiplier: 2,  cost: 60000000,      requires: 1  },
  { id: 'ca2', portalId: 'caos', multiplier: 3,  cost: 600000000,     requires: 5  },
  { id: 'ca3', portalId: 'caos', multiplier: 5,  cost: 4800000000,    requires: 10 },
  { id: 'ca4', portalId: 'caos', multiplier: 10, cost: 45000000000,   requires: 25 },
  { id: 'ca5', portalId: 'caos', multiplier: 25, cost: 360000000000,  requires: 50 },

  // ── Primordial (costos ×4) ────────────────────────────────────────────────
  { id: 'pr1', portalId: 'primordial', multiplier: 2,  cost: 800000000,      requires: 1  },
  { id: 'pr2', portalId: 'primordial', multiplier: 3,  cost: 8000000000,     requires: 5  },
  { id: 'pr3', portalId: 'primordial', multiplier: 5,  cost: 64000000000,    requires: 10 },
  { id: 'pr4', portalId: 'primordial', multiplier: 10, cost: 600000000000,   requires: 25 },
  { id: 'pr5', portalId: 'primordial', multiplier: 25, cost: 4800000000000,  requires: 50 },

  // ── Singular (costos ×6) ──────────────────────────────────────────────────
  { id: 'si1', portalId: 'singular', multiplier: 2,  cost: 12000000000,      requires: 1  },
  { id: 'si2', portalId: 'singular', multiplier: 3,  cost: 120000000000,     requires: 5  },
  { id: 'si3', portalId: 'singular', multiplier: 5,  cost: 960000000000,     requires: 10 },
  { id: 'si4', portalId: 'singular', multiplier: 10, cost: 9000000000000,    requires: 25 },
  { id: 'si5', portalId: 'singular', multiplier: 25, cost: 90000000000000,   requires: 50 },
]
