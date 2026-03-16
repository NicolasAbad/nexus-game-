// ── Motor de ingreso offline ──────────────────────────────────────────────────

import { MIN_OFFLINE_SECS } from './state.js'
import { Production } from './production.js'

export const OfflineEngine = {
  calculate(state) {
    const secondsAway = (Date.now() - state.lastSave) / 1000
    if (secondsAway < MIN_OFFLINE_SECS) return null

    const prod = Production.total(state)
    if (prod.lte(0)) return null

    const cappedSecs = Math.min(secondsAway, state.offlineCap)
    const earned     = prod.mul(cappedSecs).mul(state.offlineEfficiency)

    return {
      secondsAway,
      cappedSecs,
      earned,
      wasCapped:  secondsAway > state.offlineCap,
      efficiency: state.offlineEfficiency,
    }
  },
}
