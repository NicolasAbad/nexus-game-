// ── Dimensional Rifts ─────────────────────────────────────────────────────────
//    Random active windows where a rift appears and the player can click for
//    bonus energy. Keeps active clicking meaningful at all game stages.
//
//    Flow:
//      - Rift spawns after nextSpawnAt timestamp
//      - Stays open for RIFT_DURATION_MS
//      - Click: gives base_production × ENERGY_SECONDS, schedules next spawn
//      - Miss:  silently expires, schedules next spawn

const RIFT_DURATION_MS = 30_000          // 30s to click before it expires
const SPAWN_MIN_MS     = 60_000          // min 1 min between rifts
const SPAWN_MAX_MS     = 180_000         // max 3 min between rifts
const ENERGY_SECONDS   = 30             // reward = base production × 30s

function randomDelay() {
  return SPAWN_MIN_MS + Math.random() * (SPAWN_MAX_MS - SPAWN_MIN_MS)
}

export const RiftSystem = {

  // Call from the UI tick. Returns 'spawned' | 'expired' | null
  tick(state) {
    const now = Date.now()

    if (state.rifts.active) {
      if (now >= state.rifts.activeUntil) {
        state.rifts.active      = false
        state.rifts.nextSpawnAt = now + randomDelay()
        return 'expired'
      }
    } else {
      if (state.rifts.nextSpawnAt > 0 && now >= state.rifts.nextSpawnAt) {
        state.rifts.active      = true
        state.rifts.activeUntil = now + RIFT_DURATION_MS
        return 'spawned'
      }
    }

    return null
  },

  // Called when player clicks the rift button.
  // Returns energy reward (Decimal) or null if no active rift.
  click(state, baseProd) {
    if (!state.rifts.active) return null
    state.rifts.active       = false
    state.rifts.nextSpawnAt  = Date.now() + randomDelay()
    state.rifts.totalClicked = (state.rifts.totalClicked || 0) + 1
    return baseProd.mul(ENERGY_SECONDS)
  },

  // Seconds remaining on the active rift (0 if none)
  timeRemaining(state) {
    if (!state.rifts.active) return 0
    return Math.max(0, Math.ceil((state.rifts.activeUntil - Date.now()) / 1000))
  },

  // Schedule the first rift 30s after game start (only sets if not already scheduled)
  scheduleFirst(state) {
    if (state.rifts.nextSpawnAt === 0) {
      state.rifts.nextSpawnAt = Date.now() + 30_000
    }
  },
}
