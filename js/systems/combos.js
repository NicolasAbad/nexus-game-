// ── Sistema de Combos de Portales ─────────────────────────────────────────────
//
//  API pública:
//    checkNew(state)              → string[]   IDs de pasivos recién activados
//    getPortalMult(state, pid)    → number     mult combinado para ese portal
//    getGlobalMult(state)         → number     mult global de pasivos + consumidos
//    getClickPowerMult(state)     → number     mult de click power
//    getOfflineAddHours(state)    → number     horas extra al cap offline
//    getOfflineEffAdd(state)      → number     fracción extra de eficiencia offline
//    getPrestigeFragMult(state)   → number     mult de fragmentos al prestigiar
//    getActivePassiveCount(state) → number     combos pasivos activos
//    canConsume(state, comboId)   → bool
//    executeConsume(state, cid)   → { ok, effect? }

import { PASSIVE_COMBOS, CONSUMABLE_COMBOS } from '../data/combos.js'

function _passive(state)  { return state.combos?.passive  || {} }
function _consumed(state) { return state.combos?.consumed || {} }

export const ComboSystem = {

  // Detecta nuevos combos pasivos alcanzados y los marca en state.combos.passive
  checkNew(state) {
    if (!state.combos) state.combos = { passive: {}, consumed: {} }
    const newOnes = []
    PASSIVE_COMBOS.forEach(combo => {
      if (_passive(state)[combo.id]) return
      const met = combo.portals.every(p => (state.portals[p.id] || 0) >= p.count)
      if (met) {
        state.combos.passive[combo.id] = true
        newOnes.push(combo.id)
      }
    })
    return newOnes
  },

  // Multiplicador de un portal específico desde combos pasivos activos
  getPortalMult(state, portalId) {
    let mult = 1
    for (const combo of PASSIVE_COMBOS) {
      if (!_passive(state)[combo.id]) continue
      const e = combo.effect
      if (e.type === 'portal_pair_mult' && e.portals.includes(portalId))   mult *= e.mult
      if (e.type === 'global_and_portal' && e.portals.includes(portalId))  mult *= e.portalMult
    }
    return mult
  },

  // Multiplicador global de todos los combos activos + consumidos
  getGlobalMult(state) {
    let mult = 1
    for (const combo of PASSIVE_COMBOS) {
      if (!_passive(state)[combo.id]) continue
      const e = combo.effect
      if (e.type === 'global_mult')       mult *= e.mult
      if (e.type === 'global_and_portal') mult *= e.globalMult
    }
    for (const combo of CONSUMABLE_COMBOS) {
      if (!_consumed(state)[combo.id]) continue
      if (combo.effect.type === 'global_mult') mult *= combo.effect.mult
    }
    return mult
  },

  // Multiplicador de click power de pasivos + consumidos
  getClickPowerMult(state) {
    let mult = 1
    for (const combo of PASSIVE_COMBOS) {
      if (!_passive(state)[combo.id]) continue
      if (combo.effect.type === 'click_power_mult') mult *= combo.effect.mult
    }
    for (const combo of CONSUMABLE_COMBOS) {
      if (!_consumed(state)[combo.id]) continue
      if (combo.effect.type === 'click_power_mult') mult *= combo.effect.mult
    }
    return mult
  },

  // Horas extra de cap offline (aditivo) de pasivos + consumidos
  getOfflineAddHours(state) {
    let hours = 0
    for (const combo of PASSIVE_COMBOS) {
      if (!_passive(state)[combo.id]) continue
      if (combo.effect.type === 'offline_add_hours') hours += combo.effect.hours
    }
    for (const combo of CONSUMABLE_COMBOS) {
      if (!_consumed(state)[combo.id]) continue
      if (combo.effect.type === 'offline_add_hours') hours += combo.effect.hours
    }
    return hours
  },

  // Fracción extra de eficiencia offline (aditiva) de pasivos + consumidos
  getOfflineEffAdd(state) {
    let pct = 0
    for (const combo of PASSIVE_COMBOS) {
      if (!_passive(state)[combo.id]) continue
      if (combo.effect.type === 'offline_eff_add') pct += combo.effect.pct
    }
    for (const combo of CONSUMABLE_COMBOS) {
      if (!_consumed(state)[combo.id]) continue
      if (combo.effect.type === 'offline_eff_add') pct += combo.effect.pct
    }
    return pct
  },

  // Multiplicador de fragmentos de prestige de pasivos + consumidos
  getPrestigeFragMult(state) {
    let mult = 1
    for (const combo of PASSIVE_COMBOS) {
      if (!_passive(state)[combo.id]) continue
      if (combo.effect.type === 'prestige_frag_mult') mult *= combo.effect.mult
    }
    for (const combo of CONSUMABLE_COMBOS) {
      if (!_consumed(state)[combo.id]) continue
      if (combo.effect.type === 'prestige_frag_mult') mult *= combo.effect.mult
    }
    return mult
  },

  // Cantidad de combos pasivos activos (para scoring de prestige)
  getActivePassiveCount(state) {
    return PASSIVE_COMBOS.filter(c => _passive(state)[c.id]).length
  },

  // ¿Se puede ejecutar este combo consumible ahora?
  canConsume(state, comboId) {
    const combo = CONSUMABLE_COMBOS.find(c => c.id === comboId)
    if (!combo) return false
    if (_consumed(state)[comboId]) return false
    return combo.cost.every(c => (state.portals[c.id] || 0) >= c.count)
  },

  // Ejecuta el combo consumible: descuenta portales, marca como consumido
  executeConsume(state, comboId) {
    if (!this.canConsume(state, comboId)) return { ok: false, reason: 'cannot_consume' }
    const combo = CONSUMABLE_COMBOS.find(c => c.id === comboId)

    combo.cost.forEach(c => {
      state.portals[c.id] = (state.portals[c.id] || 0) - c.count
    })

    if (!state.combos) state.combos = { passive: {}, consumed: {} }
    state.combos.consumed[comboId] = true

    return { ok: true, effect: combo.effect }
  },
}
