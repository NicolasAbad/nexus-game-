// ── Sistema de sinergias cross-portal ────────────────────────────────────────
//    checkNew()      → array de IDs recién activados (para notificación)
//    getMultiplier() → multiplicador global acumulado de todas las activas
//    getActiveCount()→ cantidad de sinergias activas

import { SYNERGY_DATA } from '../data/synergies.js'

export const Synergies = {

  checkNew(state) {
    if (!state.activeSynergies) state.activeSynergies = {}
    const newOnes = []
    SYNERGY_DATA.forEach(syn => {
      if (state.activeSynergies[syn.id]) return
      const met = syn.portals.every(p => (state.portals[p.id] || 0) >= p.count)
      if (met) {
        state.activeSynergies[syn.id] = true
        newOnes.push(syn.id)
      }
    })
    return newOnes
  },

  getMultiplier(state) {
    if (!state.activeSynergies) return 1
    return SYNERGY_DATA
      .filter(syn => state.activeSynergies[syn.id])
      .reduce((m, syn) => m * syn.globalMult, 1)
  },

  getActiveCount(state) {
    if (!state.activeSynergies) return 0
    return SYNERGY_DATA.filter(syn => state.activeSynergies?.[syn.id]).length
  },
}
