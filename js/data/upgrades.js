// ── Datos de mejoras ──────────────────────────────────────────────────────────
//    Stage 1: 3 tiers por portal (×2, ×3, ×5)
//    Stage 3: mejoras de click power (portalId: 'click')
//    Stage 4: agrega tiers 4 y 5 (×10 en 25, ×25 en 50) + globales

export const UPGRADE_DATA = [
  // ── Click power ────────────────────────────────────────────────────────────
  // requires: 0 = visible en cuanto se abre el panel de mejoras
  { id: 'ck1', portalId: 'click', name: 'Guante de Energía', desc: 'Click power ×5',  multiplier: 5,  cost: 500,     requires: 0 },
  { id: 'ck2', portalId: 'click', name: 'Impulso Manual',    desc: 'Click power ×10', multiplier: 10, cost: 50000,   requires: 0 },
  { id: 'ck3', portalId: 'click', name: 'Mano del Nexo',     desc: 'Click power ×25', multiplier: 25, cost: 2000000, requires: 0 },

  // ── Ígnea ──────────────────────────────────────────────────────────────────
  { id: 'ig1', portalId: 'ignea',    name: 'Llama Azul',          desc: 'Portal Ígnea ×2',     multiplier: 2, cost: 100,     requires: 1  },
  { id: 'ig2', portalId: 'ignea',    name: 'Núcleo Solar',         desc: 'Portal Ígnea ×3',     multiplier: 3, cost: 1000,    requires: 5  },
  { id: 'ig3', portalId: 'ignea',    name: 'Nova Dimensional',     desc: 'Portal Ígnea ×5',     multiplier: 5, cost: 8000,    requires: 10 },
  // ── Abismal ────────────────────────────────────────────────────────────────
  { id: 'ab1', portalId: 'abismal',  name: 'Corriente Profunda',   desc: 'Portal Abismal ×2',   multiplier: 2, cost: 1000,    requires: 1  },
  { id: 'ab2', portalId: 'abismal',  name: 'Vorágine Oscura',      desc: 'Portal Abismal ×3',   multiplier: 3, cost: 8000,    requires: 5  },
  { id: 'ab3', portalId: 'abismal',  name: 'Abismo Infinito',      desc: 'Portal Abismal ×5',   multiplier: 5, cost: 60000,   requires: 10 },
  // ── Temporal ──────────────────────────────────────────────────────────────
  { id: 'tm1', portalId: 'temporal', name: 'Eco del Pasado',       desc: 'Portal Temporal ×2',  multiplier: 2, cost: 10000,   requires: 1  },
  { id: 'tm2', portalId: 'temporal', name: 'Bucle Eterno',         desc: 'Portal Temporal ×3',  multiplier: 3, cost: 80000,   requires: 5  },
  { id: 'tm3', portalId: 'temporal', name: 'Convergencia Eterna',  desc: 'Portal Temporal ×5',  multiplier: 5, cost: 600000,  requires: 10 },
  // ── Vacío ─────────────────────────────────────────────────────────────────
  { id: 'va1', portalId: 'vacio',    name: 'Eco del Vacío',        desc: 'Portal del Vacío ×2', multiplier: 2, cost: 100000,  requires: 1  },
  { id: 'va2', portalId: 'vacio',    name: 'Singularidad',         desc: 'Portal del Vacío ×3', multiplier: 3, cost: 800000,  requires: 5  },
  { id: 'va3', portalId: 'vacio',    name: 'Colapso Dimensional',  desc: 'Portal del Vacío ×5', multiplier: 5, cost: 6000000, requires: 10 },
]
