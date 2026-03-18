// ── QuestSystem ───────────────────────────────────────────────────────────────
//
//  Manages Viajero quest chains. State lives in state.viajeros.quests:
//    { [questId]: { completed: bool, claimed: bool } }
//
//  Quest progress is computed live from game state — not stored.
//  Completing a quest doesn't auto-advance to the next step: the UI calls
//  claimReward() which marks it claimed and stores the reward in state.
//
//  No circular deps: imports data only.
// ──────────────────────────────────────────────────────────────────────────────

import { QUEST_DATA } from '../data/quests.js'
import { BondSystem }  from './bonds.js'

// ── Helpers ───────────────────────────────────────────────────────────────────

function _portals(state) { return state.portals || {} }
function _roster(state)  { return state.viajeros.roster }

function _totalPortals(state) {
  return Object.values(_portals(state)).reduce((s, v) => s + (typeof v === 'number' ? v : 0), 0)
}

function _viajeroExpeditions(state, viajeroid) {
  const entry = _roster(state)[viajeroid]
  return entry ? (entry.expeditions || 0) : 0
}

function _viajeroResonance(state, viajeroid) {
  const entry = _roster(state)[viajeroid]
  return entry ? (entry.resonance || 0) : 0
}

function _viajeroCount(state) {
  return Object.keys(_roster(state)).length
}

function _totalEnergy(state) {
  const te = state.totalEnergyEarned
  if (!te) return 0
  // Decimal object has .gte()
  if (typeof te.toNumber === 'function') return te.toNumber()
  return Number(te)
}

/** Returns true if a quest's trigger condition is met */
function _isConditionMet(quest, state) {
  switch (quest.trigger) {
    case 'portal_count':
      return (_portals(state)[quest.targetParam] || 0) >= quest.target

    case 'total_portals':
      return _totalPortals(state) >= quest.target

    case 'total_energy':
      return _totalEnergy(state) >= quest.target

    case 'viajero_expeditions':
      return _viajeroExpeditions(state, quest.targetParam) >= quest.target

    case 'viajero_resonance':
      return _viajeroResonance(state, quest.targetParam) >= quest.target

    case 'prestige_count':
      return (state.prestige?.runCount || 0) >= quest.target

    case 'bond_active':
      return BondSystem.isBondActive(state, quest.targetParam)

    case 'viajeros_owned':
      return _viajeroCount(state) >= quest.target

    default:
      return false
  }
}

/** Returns true if the previous step in this chain is claimed (or step === 1) */
function _isPreviousStepClaimed(quest, state) {
  if (quest.step === 1) return true
  const prevId = `${quest.viajeroId}_${quest.step - 1}`
  return state.viajeros.quests[prevId]?.claimed === true
}

// ── Public API ─────────────────────────────────────────────────────────────────

export const QuestSystem = {

  /**
   * Returns all quests for a given Viajero with current status.
   * @returns Array of { quest, unlocked, conditionMet, completed, claimed }
   */
  getChain(state, viajeroid) {
    return QUEST_DATA
      .filter(q => q.viajeroId === viajeroid)
      .sort((a, b) => a.step - b.step)
      .map(quest => {
        const unlocked     = _isPreviousStepClaimed(quest, state) && !!_roster(state)[viajeroid]
        const conditionMet = unlocked && _isConditionMet(quest, state)
        const completed    = state.viajeros.quests[quest.id]?.completed ?? false
        const claimed      = state.viajeros.quests[quest.id]?.claimed   ?? false
        return { quest, unlocked, conditionMet, completed, claimed }
      })
  },

  /**
   * Check all owned Viajero quests and mark completed if conditions met.
   * Call once per game tick or on state-changing events.
   * Returns array of quest ids newly completed (for notification).
   */
  tick(state) {
    const newly = []
    for (const viajeroid of Object.keys(_roster(state))) {
      const chain = QUEST_DATA.filter(q => q.viajeroId === viajeroid).sort((a, b) => a.step - b.step)
      for (const quest of chain) {
        if (state.viajeros.quests[quest.id]?.completed) continue
        if (!_isPreviousStepClaimed(quest, state)) continue
        if (_isConditionMet(quest, state)) {
          if (!state.viajeros.quests[quest.id]) state.viajeros.quests[quest.id] = {}
          state.viajeros.quests[quest.id].completed = true
          newly.push(quest.id)
        }
      }
    }
    return newly
  },

  /**
   * Claim reward for a completed quest. Mutates state.
   * Returns the reward object { type, amt } or null if not claimable.
   */
  claimReward(state, questId) {
    const questDef = QUEST_DATA.find(q => q.id === questId)
    if (!questDef) return null

    const entry = state.viajeros.quests[questId]
    if (!entry?.completed || entry?.claimed) return null

    entry.claimed = true

    const reward = { type: questDef.rewardType, amt: questDef.rewardAmt }
    switch (questDef.rewardType) {
      case 'crystals':
        state.crystals = (state.crystals || 0) + questDef.rewardAmt
        break
      case 'prestige_frags':
        if (state.prestige) state.prestige.fragments = (state.prestige.fragments || 0) + questDef.rewardAmt
        break
      case 'resonance_boost': {
        const entry = _roster(state)[questDef.viajeroId]
        if (entry) entry.resonance = (entry.resonance || 0) + questDef.rewardAmt
        break
      }
    }
    return reward
  },

  /** Returns count of completed-but-unclaimed quests across all owned Viajeros */
  getUnclaimedCount(state) {
    let count = 0
    for (const [id, entry] of Object.entries(state.viajeros.quests)) {
      if (entry.completed && !entry.claimed) count++
    }
    return count
  },
}
