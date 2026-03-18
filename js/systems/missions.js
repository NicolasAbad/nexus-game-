// ── Sistema de misiones ───────────────────────────────────────────────────────
//    check(state, currentProd) → [{ id, energyReward }] misiones recién completadas
//    getProgress(state, mission) → { current, target }
//    getNextHistory(state) → mission object o null

import '../utils/decimal.js'
import { HISTORY_MISSIONS, DAILY_MISSIONS, WEEKLY_MISSION } from '../data/missions.js'

// ── Streak milestone rewards ───────────────────────────────────────────────────
const STREAK_MILESTONES = {
  3:  { type: 'productionMinutes', minutes: 10  },
  7:  { type: 'productionMinutes', minutes: 30  },
  14: { type: 'productionMinutes', minutes: 90  },
  30: { type: 'productionMinutes', minutes: 240 },
}

// ── Helpers de tiempo ──────────────────────────────────────────────────────────
function todayMidnight() {
  const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime()
}
function thisWeekSunday() {
  const d = new Date(); d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - d.getDay())
  return d.getTime()
}

// ── Reset diario/semanal ───────────────────────────────────────────────────────
function resetIfNeeded(state) {
  const midnight = todayMidnight()
  if (state.missions.daily.lastReset < midnight) {
    // If last full completion was before yesterday, streak is broken
    const yesterday = midnight - 86400000
    if ((state.missions.daily.streakLastCompleted || 0) < yesterday) {
      state.missions.daily.streakDays = 0
    }
    state.missions.daily.lastReset    = midnight
    state.missions.daily.completed    = {}
    state.missions.daily.clicks       = 0
    state.missions.daily.portalsBought = 0
    state.missions.daily.abilitiesUsed = 0
  }
  const sunday = thisWeekSunday()
  if (state.missions.weekly.lastReset < sunday) {
    state.missions.weekly.lastReset    = sunday
    state.missions.weekly.completed    = {}
    state.missions.weekly.portalsBought = 0
  }
}

// ── Evalúa un trigger contra el estado actual ──────────────────────────────────
function isMet(trigger, state, currentProd) {
  const portals    = state.portals
  const totalPorts = Object.values(portals).reduce((s, n) => s + n, 0)
  const upgOwned   = Object.values(state.upgrades).filter(Boolean).length
  const portalKey  = trigger.portalId
    ? 'portal' + trigger.portalId[0].toUpperCase() + trigger.portalId.slice(1)
    : null

  switch (trigger.type) {
    case 'totalClicks':    return state.totalClicks >= trigger.count
    case 'totalEnergy':    return state.totalEnergyEarned.gte(trigger.amount)
    case 'totalPortals':   return totalPorts >= trigger.count
    case 'portalUnlocked': return !!(portalKey && state.unlocks[portalKey])
    case 'upgradesOwned':  return upgOwned >= trigger.count
    case 'production':     return currentProd && currentProd.gte(trigger.rate)
    // Daily
    case 'clicksToday':        return state.missions.daily.clicks >= trigger.count
    case 'portalsBoughtToday': return state.missions.daily.portalsBought >= trigger.count
    case 'abilitiesUsedToday': return state.missions.daily.abilitiesUsed >= trigger.count
    // Weekly
    case 'portalsBoughtThisWeek': return state.missions.weekly.portalsBought >= trigger.count
    default: return false
  }
}

// ── Calcula la recompensa en energía ──────────────────────────────────────────
function computeReward(reward, currentProd) {
  if (reward.type === 'energy') return new Decimal(reward.amount)
  if (reward.type === 'productionMinutes' && currentProd) {
    return currentProd.mul(reward.minutes * 60)
  }
  return new Decimal(0)
}

// ── API pública ───────────────────────────────────────────────────────────────
export const MissionSystem = {

  // Llama a resetIfNeeded y verifica todas las misiones.
  // Retorna array de { id, energyReward } para cada misión recién completada.
  check(state, currentProd) {
    resetIfNeeded(state)
    const completed = []

    // Historia
    HISTORY_MISSIONS.forEach(m => {
      if (state.missions.history[m.id]) return
      if (isMet(m.trigger, state, currentProd)) {
        state.missions.history[m.id] = true
        completed.push({ id: m.id, energyReward: computeReward(m.reward, currentProd) })
      }
    })

    // Diarias
    DAILY_MISSIONS.forEach(m => {
      if (state.missions.daily.completed[m.id]) return
      if (isMet(m.trigger, state, currentProd)) {
        state.missions.daily.completed[m.id] = true
        completed.push({ id: m.id, energyReward: computeReward(m.reward, currentProd) })
      }
    })

    // Streak — check after all daily missions evaluated
    const allDailyDone = DAILY_MISSIONS.every(m => state.missions.daily.completed[m.id])
    if (allDailyDone && (state.missions.daily.streakLastCompleted || 0) < todayMidnight()) {
      state.missions.daily.streakLastCompleted = todayMidnight()
      state.missions.daily.streakDays = (state.missions.daily.streakDays || 0) + 1
      const days = state.missions.daily.streakDays
      if (STREAK_MILESTONES[days]) {
        completed.push({ id: 'streak_' + days, energyReward: computeReward(STREAK_MILESTONES[days], currentProd) })
      }
    }

    // Semanal
    if (!state.missions.weekly.completed[WEEKLY_MISSION.id]) {
      if (isMet(WEEKLY_MISSION.trigger, state, currentProd)) {
        state.missions.weekly.completed[WEEKLY_MISSION.id] = true
        completed.push({ id: WEEKLY_MISSION.id, energyReward: computeReward(WEEKLY_MISSION.reward, currentProd) })
      }
    }

    return completed
  },

  // Devuelve { current, target } para la barra de progreso de una misión
  getProgress(state, mission) {
    const t = mission.trigger
    const portals    = state.portals
    const totalPorts = Object.values(portals).reduce((s, n) => s + n, 0)
    const upgOwned   = Object.values(state.upgrades).filter(Boolean).length
    switch (t.type) {
      case 'totalClicks':           return { current: Math.min(state.totalClicks, t.count),    target: t.count }
      case 'totalEnergy':           return { current: Math.min(state.totalEnergyEarned.toNumber(), t.amount), target: t.amount }
      case 'totalPortals':          return { current: Math.min(totalPorts, t.count),            target: t.count }
      case 'portalUnlocked':        return { current: state.unlocks['portal' + t.portalId[0].toUpperCase() + t.portalId.slice(1)] ? 1 : 0, target: 1 }
      case 'upgradesOwned':         return { current: Math.min(upgOwned, t.count),              target: t.count }
      case 'production':            return { current: 0, target: 1 }  // just completed/not
      case 'clicksToday':           return { current: Math.min(state.missions.daily.clicks, t.count), target: t.count }
      case 'portalsBoughtToday':    return { current: Math.min(state.missions.daily.portalsBought, t.count), target: t.count }
      case 'abilitiesUsedToday':    return { current: Math.min(state.missions.daily.abilitiesUsed, t.count), target: t.count }
      case 'portalsBoughtThisWeek': return { current: Math.min(state.missions.weekly.portalsBought, t.count), target: t.count }
      default: return { current: 0, target: 1 }
    }
  },

  // Primera misión de historia no completada (para "Próximo Objetivo")
  getNextHistory(state) {
    return HISTORY_MISSIONS.find(m => !state.missions.history[m.id]) || null
  },

  // Cuenta completadas / total para cada tipo
  historyCount(state) {
    const done = HISTORY_MISSIONS.filter(m => state.missions.history[m.id]).length
    return { done, total: HISTORY_MISSIONS.length }
  },
  dailyCount(state) {
    const done = DAILY_MISSIONS.filter(m => state.missions.daily.completed[m.id]).length
    return { done, total: DAILY_MISSIONS.length }
  },
  weeklyDone(state) {
    return !!state.missions.weekly.completed[WEEKLY_MISSION.id]
  },

  // Racha actual de días con todas las diarias completadas
  getStreak(state) {
    return state.missions.daily.streakDays || 0
  },

  // Tiempo restante hasta el próximo reset diario (en ms)
  dailyTimeRemaining() {
    return todayMidnight() + 86400000 - Date.now()
  },
  weeklyTimeRemaining() {
    return thisWeekSunday() + 7 * 86400000 - Date.now()
  },
}
