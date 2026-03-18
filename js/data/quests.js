// ── Viajero Quest Chains ───────────────────────────────────────────────────────
//
//  72 quests total: 3 per Viajero × 24 Viajeros.
//  Each quest chain must be completed in order (step 1 → 2 → 3).
//
//  Fields:
//    id           → unique quest id
//    viajeroId    → which Viajero's chain this belongs to
//    step         → 1, 2, or 3
//    trigger      → condition type (see below)
//    target       → condition value (number or string)
//    targetParam  → optional extra param (e.g., which portal / viajero id)
//    rewardType   → 'crystals' | 'prestige_frags' | 'resonance_boost'
//    rewardAmt    → reward quantity
//    key          → i18n key for quest title/description
//
//  trigger types:
//    portal_count        → state.portals[targetParam].count >= target
//    total_portals       → sum of all portal counts >= target
//    total_energy        → state.stats.totalEnergyEarned >= target
//    viajero_expeditions → state.viajeros.roster[targetParam].expeditions >= target
//    viajero_resonance   → state.viajeros.roster[targetParam].resonance >= target
//    prestige_count      → state.stats.prestigeCount >= target
//    bond_active         → bond id == targetParam is currently active
//    viajeros_owned      → number of owned viajeros >= target
// ──────────────────────────────────────────────────────────────────────────────

export const QUEST_DATA = [

  // ── Kael (ignea guardian) ──────────────────────────────────────────────────
  { id: 'kael_1', viajeroId: 'kael', step: 1, trigger: 'portal_count',      target: 10,  targetParam: 'ignea',    rewardType: 'crystals',       rewardAmt: 50,  key: 'quest.kael.1' },
  { id: 'kael_2', viajeroId: 'kael', step: 2, trigger: 'portal_count',      target: 25,  targetParam: 'ignea',    rewardType: 'crystals',       rewardAmt: 100, key: 'quest.kael.2' },
  { id: 'kael_3', viajeroId: 'kael', step: 3, trigger: 'viajero_resonance', target: 5,   targetParam: 'kael',     rewardType: 'prestige_frags', rewardAmt: 3,   key: 'quest.kael.3' },

  // ── Embera (ignea explorer) ────────────────────────────────────────────────
  { id: 'embera_1', viajeroId: 'embera', step: 1, trigger: 'viajero_expeditions', target: 1,  targetParam: 'embera', rewardType: 'crystals',       rewardAmt: 50,  key: 'quest.embera.1' },
  { id: 'embera_2', viajeroId: 'embera', step: 2, trigger: 'viajero_expeditions', target: 5,  targetParam: 'embera', rewardType: 'crystals',       rewardAmt: 100, key: 'quest.embera.2' },
  { id: 'embera_3', viajeroId: 'embera', step: 3, trigger: 'viajero_expeditions', target: 15, targetParam: 'embera', rewardType: 'resonance_boost', rewardAmt: 1,   key: 'quest.embera.3' },

  // ── Pyron (ignea epic guardian) ────────────────────────────────────────────
  { id: 'pyron_1', viajeroId: 'pyron', step: 1, trigger: 'total_portals',      target: 50,  targetParam: null,  rewardType: 'crystals',       rewardAmt: 50,  key: 'quest.pyron.1' },
  { id: 'pyron_2', viajeroId: 'pyron', step: 2, trigger: 'total_portals',      target: 100, targetParam: null,  rewardType: 'crystals',       rewardAmt: 100, key: 'quest.pyron.2' },
  { id: 'pyron_3', viajeroId: 'pyron', step: 3, trigger: 'prestige_count',     target: 2,   targetParam: null,  rewardType: 'prestige_frags', rewardAmt: 3,   key: 'quest.pyron.3' },

  // ── Lyra (abismal explorer) ────────────────────────────────────────────────
  { id: 'lyra_1', viajeroId: 'lyra', step: 1, trigger: 'viajero_expeditions', target: 1,  targetParam: 'lyra', rewardType: 'crystals',       rewardAmt: 50,  key: 'quest.lyra.1' },
  { id: 'lyra_2', viajeroId: 'lyra', step: 2, trigger: 'viajero_expeditions', target: 5,  targetParam: 'lyra', rewardType: 'crystals',       rewardAmt: 100, key: 'quest.lyra.2' },
  { id: 'lyra_3', viajeroId: 'lyra', step: 3, trigger: 'bond_active',         target: 1,  targetParam: 'blood_of_abyss', rewardType: 'prestige_frags', rewardAmt: 3, key: 'quest.lyra.3' },

  // ── Marea (abismal raro guardian) ─────────────────────────────────────────
  { id: 'marea_1', viajeroId: 'marea', step: 1, trigger: 'portal_count',      target: 5,  targetParam: 'abismal', rewardType: 'crystals',       rewardAmt: 50,  key: 'quest.marea.1' },
  { id: 'marea_2', viajeroId: 'marea', step: 2, trigger: 'portal_count',      target: 20, targetParam: 'abismal', rewardType: 'crystals',       rewardAmt: 100, key: 'quest.marea.2' },
  { id: 'marea_3', viajeroId: 'marea', step: 3, trigger: 'viajero_resonance', target: 5,  targetParam: 'marea',   rewardType: 'resonance_boost', rewardAmt: 1,  key: 'quest.marea.3' },

  // ── Abyssus (abismal epic explorer) ───────────────────────────────────────
  { id: 'abyssus_1', viajeroId: 'abyssus', step: 1, trigger: 'viajero_expeditions', target: 3,  targetParam: 'abyssus', rewardType: 'crystals',       rewardAmt: 50,  key: 'quest.abyssus.1' },
  { id: 'abyssus_2', viajeroId: 'abyssus', step: 2, trigger: 'prestige_count',      target: 1,  targetParam: null,      rewardType: 'prestige_frags', rewardAmt: 2,   key: 'quest.abyssus.2' },
  { id: 'abyssus_3', viajeroId: 'abyssus', step: 3, trigger: 'viajero_resonance',   target: 5,  targetParam: 'abyssus', rewardType: 'prestige_frags', rewardAmt: 3,   key: 'quest.abyssus.3' },

  // ── Vex (temporal common explorer) ────────────────────────────────────────
  { id: 'vex_1', viajeroId: 'vex', step: 1, trigger: 'total_energy',       target: 1e6,  targetParam: null, rewardType: 'crystals',       rewardAmt: 50,  key: 'quest.vex.1' },
  { id: 'vex_2', viajeroId: 'vex', step: 2, trigger: 'total_energy',       target: 1e9,  targetParam: null, rewardType: 'crystals',       rewardAmt: 100, key: 'quest.vex.2' },
  { id: 'vex_3', viajeroId: 'vex', step: 3, trigger: 'viajero_resonance',  target: 5,    targetParam: 'vex', rewardType: 'resonance_boost', rewardAmt: 1,  key: 'quest.vex.3' },

  // ── Chronus (temporal raro guardian) ──────────────────────────────────────
  { id: 'chronus_1', viajeroId: 'chronus', step: 1, trigger: 'portal_count',      target: 5,  targetParam: 'temporal', rewardType: 'crystals',       rewardAmt: 50,  key: 'quest.chronus.1' },
  { id: 'chronus_2', viajeroId: 'chronus', step: 2, trigger: 'portal_count',      target: 20, targetParam: 'temporal', rewardType: 'crystals',       rewardAmt: 100, key: 'quest.chronus.2' },
  { id: 'chronus_3', viajeroId: 'chronus', step: 3, trigger: 'bond_active',       target: 1,  targetParam: 'eternal_loop', rewardType: 'prestige_frags', rewardAmt: 3, key: 'quest.chronus.3' },

  // ── Tempus (temporal epic guardian) ───────────────────────────────────────
  { id: 'tempus_1', viajeroId: 'tempus', step: 1, trigger: 'viajero_resonance', target: 3, targetParam: 'tempus',  rewardType: 'crystals',       rewardAmt: 50,  key: 'quest.tempus.1' },
  { id: 'tempus_2', viajeroId: 'tempus', step: 2, trigger: 'prestige_count',    target: 1, targetParam: null,      rewardType: 'crystals',       rewardAmt: 100, key: 'quest.tempus.2' },
  { id: 'tempus_3', viajeroId: 'tempus', step: 3, trigger: 'viajero_resonance', target: 7, targetParam: 'tempus',  rewardType: 'prestige_frags', rewardAmt: 3,   key: 'quest.tempus.3' },

  // ── Null (vacio common guardian) ──────────────────────────────────────────
  { id: 'null_1', viajeroId: 'null', step: 1, trigger: 'portal_count',      target: 5,  targetParam: 'vacio', rewardType: 'crystals',       rewardAmt: 50,  key: 'quest.null.1' },
  { id: 'null_2', viajeroId: 'null', step: 2, trigger: 'portal_count',      target: 15, targetParam: 'vacio', rewardType: 'crystals',       rewardAmt: 100, key: 'quest.null.2' },
  { id: 'null_3', viajeroId: 'null', step: 3, trigger: 'viajero_resonance', target: 5,  targetParam: 'null',  rewardType: 'resonance_boost', rewardAmt: 1,   key: 'quest.null.3' },

  // ── Shade (vacio raro explorer) ────────────────────────────────────────────
  { id: 'shade_1', viajeroId: 'shade', step: 1, trigger: 'viajero_expeditions', target: 3,  targetParam: 'shade', rewardType: 'crystals',       rewardAmt: 50,  key: 'quest.shade.1' },
  { id: 'shade_2', viajeroId: 'shade', step: 2, trigger: 'viajero_expeditions', target: 10, targetParam: 'shade', rewardType: 'crystals',       rewardAmt: 100, key: 'quest.shade.2' },
  { id: 'shade_3', viajeroId: 'shade', step: 3, trigger: 'bond_active',         target: 1,  targetParam: 'void_siblings', rewardType: 'prestige_frags', rewardAmt: 3, key: 'quest.shade.3' },

  // ── Presence (vacio epic special) ─────────────────────────────────────────
  { id: 'presence_1', viajeroId: 'presence', step: 1, trigger: 'viajeros_owned',   target: 5,  targetParam: null, rewardType: 'crystals',       rewardAmt: 50,  key: 'quest.presence.1' },
  { id: 'presence_2', viajeroId: 'presence', step: 2, trigger: 'viajeros_owned',   target: 10, targetParam: null, rewardType: 'crystals',       rewardAmt: 150, key: 'quest.presence.2' },
  { id: 'presence_3', viajeroId: 'presence', step: 3, trigger: 'viajero_resonance', target: 6, targetParam: 'presence', rewardType: 'prestige_frags', rewardAmt: 3, key: 'quest.presence.3' },

  // ── Aether (celestial common explorer) ────────────────────────────────────
  { id: 'aether_1', viajeroId: 'aether', step: 1, trigger: 'viajero_expeditions', target: 2,  targetParam: 'aether', rewardType: 'crystals',       rewardAmt: 50,  key: 'quest.aether.1' },
  { id: 'aether_2', viajeroId: 'aether', step: 2, trigger: 'viajero_expeditions', target: 8,  targetParam: 'aether', rewardType: 'crystals',       rewardAmt: 100, key: 'quest.aether.2' },
  { id: 'aether_3', viajeroId: 'aether', step: 3, trigger: 'viajero_resonance',   target: 5,  targetParam: 'aether', rewardType: 'resonance_boost', rewardAmt: 1,  key: 'quest.aether.3' },

  // ── Solara (celestial raro guardian) ──────────────────────────────────────
  { id: 'solara_1', viajeroId: 'solara', step: 1, trigger: 'portal_count',      target: 5,  targetParam: 'celestial', rewardType: 'crystals',       rewardAmt: 50,  key: 'quest.solara.1' },
  { id: 'solara_2', viajeroId: 'solara', step: 2, trigger: 'portal_count',      target: 20, targetParam: 'celestial', rewardType: 'crystals',       rewardAmt: 100, key: 'quest.solara.2' },
  { id: 'solara_3', viajeroId: 'solara', step: 3, trigger: 'bond_active',       target: 1,  targetParam: 'celestial_flame', rewardType: 'prestige_frags', rewardAmt: 3, key: 'quest.solara.3' },

  // ── Stellan (celestial epic guardian) ─────────────────────────────────────
  { id: 'stellan_1', viajeroId: 'stellan', step: 1, trigger: 'total_portals',      target: 75,  targetParam: null,   rewardType: 'crystals',       rewardAmt: 50,  key: 'quest.stellan.1' },
  { id: 'stellan_2', viajeroId: 'stellan', step: 2, trigger: 'total_portals',      target: 150, targetParam: null,   rewardType: 'crystals',       rewardAmt: 100, key: 'quest.stellan.2' },
  { id: 'stellan_3', viajeroId: 'stellan', step: 3, trigger: 'viajero_resonance',  target: 5,   targetParam: 'stellan', rewardType: 'prestige_frags', rewardAmt: 3, key: 'quest.stellan.3' },

  // ── Rift (caos common explorer) ────────────────────────────────────────────
  { id: 'rift_1', viajeroId: 'rift', step: 1, trigger: 'viajero_expeditions', target: 1,  targetParam: 'rift', rewardType: 'crystals',       rewardAmt: 50,  key: 'quest.rift.1' },
  { id: 'rift_2', viajeroId: 'rift', step: 2, trigger: 'viajero_expeditions', target: 5,  targetParam: 'rift', rewardType: 'crystals',       rewardAmt: 100, key: 'quest.rift.2' },
  { id: 'rift_3', viajeroId: 'rift', step: 3, trigger: 'viajero_resonance',   target: 5,  targetParam: 'rift', rewardType: 'resonance_boost', rewardAmt: 1,   key: 'quest.rift.3' },

  // ── Khaos (caos raro guardian) ─────────────────────────────────────────────
  { id: 'khaos_1', viajeroId: 'khaos', step: 1, trigger: 'portal_count',      target: 5,  targetParam: 'caos', rewardType: 'crystals',       rewardAmt: 50,  key: 'quest.khaos.1' },
  { id: 'khaos_2', viajeroId: 'khaos', step: 2, trigger: 'portal_count',      target: 20, targetParam: 'caos', rewardType: 'crystals',       rewardAmt: 100, key: 'quest.khaos.2' },
  { id: 'khaos_3', viajeroId: 'khaos', step: 3, trigger: 'viajero_resonance', target: 5,  targetParam: 'khaos', rewardType: 'resonance_boost', rewardAmt: 1, key: 'quest.khaos.3' },

  // ── Fracture (caos epic special) ──────────────────────────────────────────
  { id: 'fracture_1', viajeroId: 'fracture', step: 1, trigger: 'prestige_count',    target: 1, targetParam: null,      rewardType: 'crystals',       rewardAmt: 50,  key: 'quest.fracture.1' },
  { id: 'fracture_2', viajeroId: 'fracture', step: 2, trigger: 'prestige_count',    target: 3, targetParam: null,      rewardType: 'crystals',       rewardAmt: 150, key: 'quest.fracture.2' },
  { id: 'fracture_3', viajeroId: 'fracture', step: 3, trigger: 'bond_active',       target: 1, targetParam: 'chaos_and_order', rewardType: 'prestige_frags', rewardAmt: 3, key: 'quest.fracture.3' },

  // ── Antiga (primordial raro guardian) ─────────────────────────────────────
  { id: 'antiga_1', viajeroId: 'antiga', step: 1, trigger: 'portal_count',      target: 5,   targetParam: 'primordial', rewardType: 'crystals',       rewardAmt: 50,  key: 'quest.antiga.1' },
  { id: 'antiga_2', viajeroId: 'antiga', step: 2, trigger: 'total_portals',     target: 200,  targetParam: null,         rewardType: 'crystals',       rewardAmt: 100, key: 'quest.antiga.2' },
  { id: 'antiga_3', viajeroId: 'antiga', step: 3, trigger: 'prestige_count',    target: 2,    targetParam: null,         rewardType: 'prestige_frags', rewardAmt: 3,   key: 'quest.antiga.3' },

  // ── Nexar (primordial epic special) ───────────────────────────────────────
  { id: 'nexar_1', viajeroId: 'nexar', step: 1, trigger: 'prestige_count',    target: 1,  targetParam: null,  rewardType: 'crystals',       rewardAmt: 50,  key: 'quest.nexar.1' },
  { id: 'nexar_2', viajeroId: 'nexar', step: 2, trigger: 'prestige_count',    target: 3,  targetParam: null,  rewardType: 'prestige_frags', rewardAmt: 2,   key: 'quest.nexar.2' },
  { id: 'nexar_3', viajeroId: 'nexar', step: 3, trigger: 'viajero_resonance', target: 5,  targetParam: 'nexar', rewardType: 'prestige_frags', rewardAmt: 3,  key: 'quest.nexar.3' },

  // ── Origin (primordial legendary council) ─────────────────────────────────
  { id: 'origin_1', viajeroId: 'origin', step: 1, trigger: 'viajeros_owned',   target: 8,  targetParam: null,      rewardType: 'crystals',       rewardAmt: 100, key: 'quest.origin.1' },
  { id: 'origin_2', viajeroId: 'origin', step: 2, trigger: 'prestige_count',   target: 3,  targetParam: null,      rewardType: 'prestige_frags', rewardAmt: 3,   key: 'quest.origin.2' },
  { id: 'origin_3', viajeroId: 'origin', step: 3, trigger: 'bond_active',      target: 1,  targetParam: 'chaos_and_order', rewardType: 'prestige_frags', rewardAmt: 5, key: 'quest.origin.3' },

  // ── Singularis (singular legendary special) ────────────────────────────────
  { id: 'singularis_1', viajeroId: 'singularis', step: 1, trigger: 'total_portals',     target: 300,  targetParam: null, rewardType: 'crystals',       rewardAmt: 100, key: 'quest.singularis.1' },
  { id: 'singularis_2', viajeroId: 'singularis', step: 2, trigger: 'prestige_count',    target: 5,    targetParam: null, rewardType: 'prestige_frags', rewardAmt: 3,   key: 'quest.singularis.2' },
  { id: 'singularis_3', viajeroId: 'singularis', step: 3, trigger: 'viajero_resonance', target: 9,    targetParam: 'singularis', rewardType: 'prestige_frags', rewardAmt: 5, key: 'quest.singularis.3' },

  // ── Cartographer (unknown legendary council) ───────────────────────────────
  { id: 'cartographer_1', viajeroId: 'cartographer', step: 1, trigger: 'viajeros_owned',   target: 10, targetParam: null, rewardType: 'crystals',       rewardAmt: 100, key: 'quest.cartographer.1' },
  { id: 'cartographer_2', viajeroId: 'cartographer', step: 2, trigger: 'viajeros_owned',   target: 15, targetParam: null, rewardType: 'prestige_frags', rewardAmt: 3,   key: 'quest.cartographer.2' },
  { id: 'cartographer_3', viajeroId: 'cartographer', step: 3, trigger: 'bond_active',      target: 1,  targetParam: 'lost_origin', rewardType: 'prestige_frags', rewardAmt: 5, key: 'quest.cartographer.3' },

  // ── Weaver (unknown legendary council) ────────────────────────────────────
  { id: 'weaver_1', viajeroId: 'weaver', step: 1, trigger: 'viajeros_owned',   target: 12,  targetParam: null, rewardType: 'crystals',       rewardAmt: 100, key: 'quest.weaver.1' },
  { id: 'weaver_2', viajeroId: 'weaver', step: 2, trigger: 'prestige_count',   target: 4,   targetParam: null, rewardType: 'prestige_frags', rewardAmt: 3,   key: 'quest.weaver.2' },
  { id: 'weaver_3', viajeroId: 'weaver', step: 3, trigger: 'bond_active',      target: 1,   targetParam: 'lost_origin', rewardType: 'prestige_frags', rewardAmt: 5, key: 'quest.weaver.3' },
]
