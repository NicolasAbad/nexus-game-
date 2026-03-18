// ── Viajero Lore & Dialogue Keys ───────────────────────────────────────────────
//
//  RESONANCE_LORE[viajeroId][resonanceLevel] → i18n key for lore fragment text
//  Levels with lore: 3, 6, 9
//
//  DIALOGUE_EVENTS[eventType] → array of { viajeroId, key }
//  Event types that trigger reactive dialogue via EventBus:
//    'prestige'         → player performs prestige
//    'long_return'      → player returns after 8+ hours offline
//    'portal_milestone' → a portal count hits 10/25/50/100
//    'first_click'      → very first click of a new run
//    'ability_use'      → any ability activated
//    'expedition_return'→ an expedition completes
// ──────────────────────────────────────────────────────────────────────────────

export const RESONANCE_LORE = {

  // ── Kael ───────────────────────────────────────────────────────────────────
  kael: {
    3: 'lore.kael.r3',
    6: 'lore.kael.r6',
    9: 'lore.kael.r9',
  },

  // ── Embera ─────────────────────────────────────────────────────────────────
  embera: {
    3: 'lore.embera.r3',
    6: 'lore.embera.r6',
    9: 'lore.embera.r9',
  },

  // ── Pyron ──────────────────────────────────────────────────────────────────
  pyron: {
    3: 'lore.pyron.r3',
    6: 'lore.pyron.r6',
    9: 'lore.pyron.r9',
  },

  // ── Lyra ───────────────────────────────────────────────────────────────────
  lyra: {
    3: 'lore.lyra.r3',
    6: 'lore.lyra.r6',
    9: 'lore.lyra.r9',
  },

  // ── Marea ──────────────────────────────────────────────────────────────────
  marea: {
    3: 'lore.marea.r3',
    6: 'lore.marea.r6',
    9: 'lore.marea.r9',
  },

  // ── Abyssus ────────────────────────────────────────────────────────────────
  abyssus: {
    3: 'lore.abyssus.r3',
    6: 'lore.abyssus.r6',
    9: 'lore.abyssus.r9',
  },

  // ── Vex ────────────────────────────────────────────────────────────────────
  vex: {
    3: 'lore.vex.r3',
    6: 'lore.vex.r6',
    9: 'lore.vex.r9',
  },

  // ── Chronus ────────────────────────────────────────────────────────────────
  chronus: {
    3: 'lore.chronus.r3',
    6: 'lore.chronus.r6',
    9: 'lore.chronus.r9',
  },

  // ── Tempus ─────────────────────────────────────────────────────────────────
  tempus: {
    3: 'lore.tempus.r3',
    6: 'lore.tempus.r6',
    9: 'lore.tempus.r9',
  },

  // ── Null ───────────────────────────────────────────────────────────────────
  null: {
    3: 'lore.null.r3',
    6: 'lore.null.r6',
    9: 'lore.null.r9',
  },

  // ── Shade ──────────────────────────────────────────────────────────────────
  shade: {
    3: 'lore.shade.r3',
    6: 'lore.shade.r6',
    9: 'lore.shade.r9',
  },

  // ── Presence ───────────────────────────────────────────────────────────────
  presence: {
    3: 'lore.presence.r3',
    6: 'lore.presence.r6',
    9: 'lore.presence.r9',
  },

  // ── Aether ─────────────────────────────────────────────────────────────────
  aether: {
    3: 'lore.aether.r3',
    6: 'lore.aether.r6',
    9: 'lore.aether.r9',
  },

  // ── Solara ─────────────────────────────────────────────────────────────────
  solara: {
    3: 'lore.solara.r3',
    6: 'lore.solara.r6',
    9: 'lore.solara.r9',
  },

  // ── Stellan ────────────────────────────────────────────────────────────────
  stellan: {
    3: 'lore.stellan.r3',
    6: 'lore.stellan.r6',
    9: 'lore.stellan.r9',
  },

  // ── Rift ───────────────────────────────────────────────────────────────────
  rift: {
    3: 'lore.rift.r3',
    6: 'lore.rift.r6',
    9: 'lore.rift.r9',
  },

  // ── Khaos ──────────────────────────────────────────────────────────────────
  khaos: {
    3: 'lore.khaos.r3',
    6: 'lore.khaos.r6',
    9: 'lore.khaos.r9',
  },

  // ── Fracture ───────────────────────────────────────────────────────────────
  fracture: {
    3: 'lore.fracture.r3',
    6: 'lore.fracture.r6',
    9: 'lore.fracture.r9',
  },

  // ── Antiga ─────────────────────────────────────────────────────────────────
  antiga: {
    3: 'lore.antiga.r3',
    6: 'lore.antiga.r6',
    9: 'lore.antiga.r9',
  },

  // ── Nexar ──────────────────────────────────────────────────────────────────
  nexar: {
    3: 'lore.nexar.r3',
    6: 'lore.nexar.r6',
    9: 'lore.nexar.r9',
  },

  // ── Origin ─────────────────────────────────────────────────────────────────
  origin: {
    3: 'lore.origin.r3',
    6: 'lore.origin.r6',
    9: 'lore.origin.r9',
  },

  // ── Singularis ─────────────────────────────────────────────────────────────
  singularis: {
    3: 'lore.singularis.r3',
    6: 'lore.singularis.r6',
    9: 'lore.singularis.r9',
  },

  // ── Cartographer ───────────────────────────────────────────────────────────
  cartographer: {
    3: 'lore.cartographer.r3',
    6: 'lore.cartographer.r6',
    9: 'lore.cartographer.r9',
  },

  // ── Weaver ─────────────────────────────────────────────────────────────────
  weaver: {
    3: 'lore.weaver.r3',
    6: 'lore.weaver.r6',
    9: 'lore.weaver.r9',
  },
}

// ── Reactive dialogue ──────────────────────────────────────────────────────────
// Each entry: { viajeroId, key }
// The key maps to a string in the i18n system.
// The UI picks ONE at random from the matching viajeros that are owned.
export const DIALOGUE_EVENTS = {

  prestige: [
    { viajeroId: 'kael',         key: 'dialogue.kael.prestige'         },
    { viajeroId: 'lyra',         key: 'dialogue.lyra.prestige'         },
    { viajeroId: 'vex',          key: 'dialogue.vex.prestige'          },
    { viajeroId: 'presence',     key: 'dialogue.presence.prestige'     },
    { viajeroId: 'cartographer', key: 'dialogue.cartographer.prestige' },
    { viajeroId: 'weaver',       key: 'dialogue.weaver.prestige'       },
    { viajeroId: 'singularis',   key: 'dialogue.singularis.prestige'   },
    { viajeroId: 'origin',       key: 'dialogue.origin.prestige'       },
  ],

  long_return: [
    { viajeroId: 'kael',       key: 'dialogue.kael.long_return'       },
    { viajeroId: 'lyra',       key: 'dialogue.lyra.long_return'       },
    { viajeroId: 'chronus',    key: 'dialogue.chronus.long_return'    },
    { viajeroId: 'tempus',     key: 'dialogue.tempus.long_return'     },
    { viajeroId: 'shade',      key: 'dialogue.shade.long_return'      },
    { viajeroId: 'aether',     key: 'dialogue.aether.long_return'     },
  ],

  portal_milestone: [
    { viajeroId: 'kael',    key: 'dialogue.kael.portal_milestone'    },
    { viajeroId: 'embera',  key: 'dialogue.embera.portal_milestone'  },
    { viajeroId: 'pyron',   key: 'dialogue.pyron.portal_milestone'   },
    { viajeroId: 'antiga',  key: 'dialogue.antiga.portal_milestone'  },
    { viajeroId: 'nexar',   key: 'dialogue.nexar.portal_milestone'   },
  ],

  expedition_return: [
    { viajeroId: 'lyra',    key: 'dialogue.lyra.expedition_return'    },
    { viajeroId: 'abyssus', key: 'dialogue.abyssus.expedition_return' },
    { viajeroId: 'shade',   key: 'dialogue.shade.expedition_return'   },
    { viajeroId: 'aether',  key: 'dialogue.aether.expedition_return'  },
    { viajeroId: 'rift',    key: 'dialogue.rift.expedition_return'    },
  ],

  ability_use: [
    { viajeroId: 'vex',      key: 'dialogue.vex.ability_use'      },
    { viajeroId: 'tempus',   key: 'dialogue.tempus.ability_use'   },
    { viajeroId: 'fracture', key: 'dialogue.fracture.ability_use' },
  ],
}
