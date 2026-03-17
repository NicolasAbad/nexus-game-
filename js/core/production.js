// ── Cálculo de producción ─────────────────────────────────────────────────────

import { PORTAL_DATA }  from '../data/portals.js'
import { UPGRADE_DATA } from '../data/upgrades.js'
import { Synergies }    from '../systems/synergies.js'

export const Production = {

  // Multiplicador acumulado de mejoras de portal compradas
  getMultiplier(state, portalId) {
    return UPGRADE_DATA
      .filter(u => u.portalId === portalId && state.upgrades[u.id])
      .reduce((m, u) => m * u.multiplier, 1)
  },

  // Multiplicador de mejoras globales compradas
  getGlobalMultiplier(state) {
    return UPGRADE_DATA
      .filter(u => u.portalId === 'global' && state.upgrades[u.id])
      .reduce((m, u) => m * u.multiplier, 1)
  },

  // Producción/s de un tipo de portal (sin multiplicadores globales ni sinergias)
  ofPortal(state, portalId) {
    const def   = PORTAL_DATA.find(p => p.id === portalId)
    const count = state.portals[portalId] || 0
    if (!def || count === 0) return new Decimal(0)
    return new Decimal(def.baseProduction)
      .mul(count)
      .mul(this.getMultiplier(state, portalId))
  },

  // Producción/s total — incluye mejoras globales + sinergias
  total(state) {
    const base = PORTAL_DATA.reduce(
      (sum, p) => sum.add(this.ofPortal(state, p.id)),
      new Decimal(0)
    )
    const globalMult  = this.getGlobalMultiplier(state)
    const synergyMult = Synergies.getMultiplier(state)
    return base.mul(globalMult).mul(synergyMult)
  },

  // Poder de click.
  // ck1/ck2/ck3 aplican multiplicador fijo.
  // ck4/ck5 reemplazan el base si totalProd × minutos > fijo.
  // totalProd: resultado de Production.total() pasado desde el caller.
  clickPower(state, totalProd = null) {
    const flatMult = UPGRADE_DATA
      .filter(u => u.portalId === 'click' && !u.prodMinutes && state.upgrades[u.id])
      .reduce((m, u) => m * u.multiplier, 1)

    const flatPower = new Decimal(flatMult)
    if (!totalProd) return flatPower

    const prodUpgs = UPGRADE_DATA
      .filter(u => u.portalId === 'click' && u.prodMinutes && state.upgrades[u.id])
    if (prodUpgs.length === 0) return flatPower

    const bestMinutes = Math.max(...prodUpgs.map(u => u.prodMinutes))
    const prodBased   = totalProd.mul(bestMinutes * 60)
    return prodBased.gt(flatPower) ? prodBased : flatPower
  },
}
