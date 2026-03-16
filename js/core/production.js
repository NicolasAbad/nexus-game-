// ── Cálculo de producción ─────────────────────────────────────────────────────

import { PORTAL_DATA } from '../data/portals.js'
import { UPGRADE_DATA } from '../data/upgrades.js'

export const Production = {
  // Multiplicador acumulado de mejoras compradas para un portal
  getMultiplier(state, portalId) {
    return UPGRADE_DATA
      .filter(u => u.portalId === portalId && state.upgrades[u.id])
      .reduce((m, u) => m * u.multiplier, 1)
  },

  // Producción/s de un tipo de portal
  ofPortal(state, portalId) {
    const def   = PORTAL_DATA.find(p => p.id === portalId)
    const count = state.portals[portalId] || 0
    if (!def || count === 0) return new Decimal(0)
    return new Decimal(def.baseProduction)
      .mul(count)
      .mul(this.getMultiplier(state, portalId))
  },

  // Producción/s total de todos los portales
  total(state) {
    return PORTAL_DATA.reduce(
      (sum, p) => sum.add(this.ofPortal(state, p.id)),
      new Decimal(0)
    )
  },

  // Poder de click — escala con las mejoras de click compradas
  clickPower(state) {
    const mult = UPGRADE_DATA
      .filter(u => u.portalId === 'click' && state.upgrades[u.id])
      .reduce((m, u) => m * u.multiplier, 1)
    return new Decimal(mult)
  },
}
