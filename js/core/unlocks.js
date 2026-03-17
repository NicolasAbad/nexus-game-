// ── Sistema de desbloqueos ────────────────────────────────────────────────────

import { PORTAL_DATA } from '../data/portals.js'

export const UnlockSystem = {
  // Verifica condiciones y modifica state.unlocks in-place.
  // Retorna array de desbloqueos nuevos para que la UI reaccione.
  check(state) {
    const fresh = []

    PORTAL_DATA.forEach(portal => {
      const key = 'portal' + portal.id[0].toUpperCase() + portal.id.slice(1)
      if (state.unlocks[key]) return

      const c   = portal.unlockCondition
      let   met = false
      if (c.type === 'totalEnergy') met = state.totalEnergyEarned.gte(c.amount)
      if (c.type === 'portalCount') met = (state.portals[c.portalId] || 0) >= c.count

      if (met) {
        state.unlocks[key] = true
        fresh.push({ type: 'portal', portal })
      }
    })

    if (!state.unlocks.panelUpgrades) {
      const anyBought = PORTAL_DATA.some(p => (state.portals[p.id] || 0) > 0)
      if (anyBought) {
        state.unlocks.panelUpgrades = true
        fresh.push({ type: 'panel', panelKey: 'upgrades' })
      }
    }

    return fresh
  },
}
