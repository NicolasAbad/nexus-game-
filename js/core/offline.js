// ── Motor de ingreso offline ──────────────────────────────────────────────────

import { MIN_OFFLINE_SECS } from './state.js'
import { Production }     from './production.js'
import { PrestigeSystem } from '../systems/prestige.js'
import { ViajerosSystem } from '../systems/viajeros.js'
import { BondSystem }     from '../systems/bonds.js'
import { ComboSystem }    from '../systems/combos.js'

export const OfflineEngine = {
  calculate(state) {
    const secondsAway = (Date.now() - state.lastSave) / 1000
    if (secondsAway < MIN_OFFLINE_SECS) return null

    const prod = Production.total(state)
    if (prod.lte(0)) return null

    // Cap: prestige × Viajero × Bond mult, then add combo bonus hours
    const capHours = PrestigeSystem.getOfflineCapHours(state)
      * ViajerosSystem.getOfflineCapMult(state)
      * BondSystem.getOfflineCapMult(state)
      + ComboSystem.getOfflineAddHours(state)

    // Efficiency: base + combo bonus, capped at 100%
    const efficiency = Math.min(state.offlineEfficiency + ComboSystem.getOfflineEffAdd(state), 1.0)

    const capSecs    = capHours * 3600
    const cappedSecs = Math.min(secondsAway, capSecs)
    const earned     = prod.mul(cappedSecs).mul(efficiency)

    return {
      secondsAway,
      cappedSecs,
      earned,
      wasCapped:  secondsAway > capSecs,
      efficiency,
    }
  },
}
