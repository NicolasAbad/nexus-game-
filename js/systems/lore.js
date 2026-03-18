// ── Sistema de Lore ───────────────────────────────────────────────────────────
//    checkPortalFragments(state) → newly unlocked fragment objects
//    getUnlockedFragments(state) → all unlocked fragments in unlock order

import { PORTAL_FRAGMENTS } from '../data/lore.js'

export const LoreSystem = {

  // Checks which portal fragments should now be unlocked based on state.unlocks.
  // Idempotent — already-unlocked fragments are skipped.
  // Returns array of newly unlocked fragment objects.
  checkPortalFragments(state) {
    const fresh = []
    PORTAL_FRAGMENTS.forEach(f => {
      if (state.lore.unlockedFragments[f.id]) return
      const key = 'portal' + f.portalId[0].toUpperCase() + f.portalId.slice(1)
      if (state.unlocks[key]) {
        state.lore.unlockedFragments[f.id] = Date.now()
        fresh.push(f)
      }
    })
    return fresh
  },

  // Returns all unlocked fragments sorted by when they were unlocked
  getUnlockedFragments(state) {
    return PORTAL_FRAGMENTS
      .filter(f => state.lore.unlockedFragments[f.id])
      .sort((a, b) => (state.lore.unlockedFragments[a.id] || 0) - (state.lore.unlockedFragments[b.id] || 0))
  },
}
