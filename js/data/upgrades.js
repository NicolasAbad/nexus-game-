// ── Datos de mejoras ──────────────────────────────────────────────────────────
//    Texto (name) vive en js/data/strings/es.js y en.js
//    UI accede via: t('upgrade.' + id + '.name')
//    Stage 1: 3 tiers por portal (×2, ×3, ×5)
//    Stage 4: tiers 4 y 5 para primeros 4 portales + 5 tiers para 4 nuevos
//             3 mejoras globales (portalId: 'global')
//             2 click upgrades basadas en producción total (prodMinutes)

export const UPGRADE_DATA = [

  // ── Click power (multiplicador fijo) ────────────────────────────────────────
  { id: 'ck1', portalId: 'click', multiplier: 5,   cost: 500       },
  { id: 'ck2', portalId: 'click', multiplier: 10,  cost: 50000     },
  { id: 'ck3', portalId: 'click', multiplier: 25,  cost: 2000000   },
  // Click basado en producción total: click = prodMinutes × producción/s × 60
  { id: 'ck4', portalId: 'click', prodMinutes: 1,  cost: 20000000  },
  { id: 'ck5', portalId: 'click', prodMinutes: 5,  cost: 2000000000 },

  // ── Global (afectan todos los portales) ─────────────────────────────────────
  //    Visible cuando totalEnergyEarned >= requiresEnergy
  { id: 'gl1', portalId: 'global', multiplier: 1.5, cost: 2000000,       requiresEnergy: 1000000        },
  { id: 'gl2', portalId: 'global', multiplier: 2,   cost: 1000000000,    requiresEnergy: 500000000      },
  { id: 'gl3', portalId: 'global', multiplier: 3,   cost: 2000000000000, requiresEnergy: 1000000000000  },

  // ── Ígnea ──────────────────────────────────────────────────────────────────
  { id: 'ig1', portalId: 'ignea', multiplier: 2,  cost: 100,     requires: 1  },
  { id: 'ig2', portalId: 'ignea', multiplier: 3,  cost: 1000,    requires: 5  },
  { id: 'ig3', portalId: 'ignea', multiplier: 5,  cost: 8000,    requires: 10 },
  { id: 'ig4', portalId: 'ignea', multiplier: 10, cost: 60000,   requires: 25 },
  { id: 'ig5', portalId: 'ignea', multiplier: 25, cost: 500000,  requires: 50 },

  // ── Abismal ────────────────────────────────────────────────────────────────
  { id: 'ab1', portalId: 'abismal', multiplier: 2,  cost: 1000,      requires: 1  },
  { id: 'ab2', portalId: 'abismal', multiplier: 3,  cost: 8000,      requires: 5  },
  { id: 'ab3', portalId: 'abismal', multiplier: 5,  cost: 60000,     requires: 10 },
  { id: 'ab4', portalId: 'abismal', multiplier: 10, cost: 750000,    requires: 25 },
  { id: 'ab5', portalId: 'abismal', multiplier: 25, cost: 6000000,   requires: 50 },

  // ── Temporal ──────────────────────────────────────────────────────────────
  { id: 'tm1', portalId: 'temporal', multiplier: 2,  cost: 10000,     requires: 1  },
  { id: 'tm2', portalId: 'temporal', multiplier: 3,  cost: 80000,     requires: 5  },
  { id: 'tm3', portalId: 'temporal', multiplier: 5,  cost: 600000,    requires: 10 },
  { id: 'tm4', portalId: 'temporal', multiplier: 10, cost: 10000000,  requires: 25 },
  { id: 'tm5', portalId: 'temporal', multiplier: 25, cost: 80000000,  requires: 50 },

  // ── Vacío ─────────────────────────────────────────────────────────────────
  { id: 'va1', portalId: 'vacio', multiplier: 2,  cost: 100000,     requires: 1  },
  { id: 'va2', portalId: 'vacio', multiplier: 3,  cost: 800000,     requires: 5  },
  { id: 'va3', portalId: 'vacio', multiplier: 5,  cost: 6000000,    requires: 10 },
  { id: 'va4', portalId: 'vacio', multiplier: 10, cost: 100000000,  requires: 25 },
  { id: 'va5', portalId: 'vacio', multiplier: 25, cost: 1000000000, requires: 50 },

  // ── Celestial ─────────────────────────────────────────────────────────────
  { id: 'ce1', portalId: 'celestial', multiplier: 2,  cost: 2000000,     requires: 1  },
  { id: 'ce2', portalId: 'celestial', multiplier: 3,  cost: 20000000,    requires: 5  },
  { id: 'ce3', portalId: 'celestial', multiplier: 5,  cost: 160000000,   requires: 10 },
  { id: 'ce4', portalId: 'celestial', multiplier: 10, cost: 1500000000,  requires: 25 },
  { id: 'ce5', portalId: 'celestial', multiplier: 25, cost: 15000000000, requires: 50 },

  // ── Caos ──────────────────────────────────────────────────────────────────
  { id: 'ca1', portalId: 'caos', multiplier: 2,  cost: 20000000,     requires: 1  },
  { id: 'ca2', portalId: 'caos', multiplier: 3,  cost: 200000000,    requires: 5  },
  { id: 'ca3', portalId: 'caos', multiplier: 5,  cost: 1600000000,   requires: 10 },
  { id: 'ca4', portalId: 'caos', multiplier: 10, cost: 15000000000,  requires: 25 },
  { id: 'ca5', portalId: 'caos', multiplier: 25, cost: 120000000000, requires: 50 },

  // ── Primordial ────────────────────────────────────────────────────────────
  { id: 'pr1', portalId: 'primordial', multiplier: 2,  cost: 200000000,     requires: 1  },
  { id: 'pr2', portalId: 'primordial', multiplier: 3,  cost: 2000000000,    requires: 5  },
  { id: 'pr3', portalId: 'primordial', multiplier: 5,  cost: 16000000000,   requires: 10 },
  { id: 'pr4', portalId: 'primordial', multiplier: 10, cost: 150000000000,  requires: 25 },
  { id: 'pr5', portalId: 'primordial', multiplier: 25, cost: 1200000000000, requires: 50 },

  // ── Singular ──────────────────────────────────────────────────────────────
  { id: 'si1', portalId: 'singular', multiplier: 2,  cost: 2000000000,     requires: 1  },
  { id: 'si2', portalId: 'singular', multiplier: 3,  cost: 20000000000,    requires: 5  },
  { id: 'si3', portalId: 'singular', multiplier: 5,  cost: 160000000000,   requires: 10 },
  { id: 'si4', portalId: 'singular', multiplier: 10, cost: 1500000000000,  requires: 25 },
  { id: 'si5', portalId: 'singular', multiplier: 25, cost: 15000000000000, requires: 50 },
]
