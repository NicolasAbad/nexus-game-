// ── Sistema de Prestige ───────────────────────────────────────────────────────
//
//  API pública:
//    canPrestige(state)            → { can, type: 'full'|'early'|null, fragments }
//    calcFragments(state)          → number  (full score)
//    buyNode(state, nodeId)        → { ok, reason? }
//    applyReset(oldState, newState)→ void  (mutates newState with persisting data)
//    getNodeStatus(state, nodeId)  → 'owned'|'available'|'locked'|'insufficient'
//
//  Effect getters (read state.prestige.tree):
//    getOfflineCapHours(state)     → 2 | 4
//    hasFreeFirstPortal(state)     → bool
//    getUpgradeCostDiscount(state) → 0 | 0.15
//    getAbilityExpBonus(state)     → 0 | 0.5
//    getAscendedPortals(state)     → string[] of portalIds unlocked for tier 6

import { PRESTIGE_NODES, FRAGMENT_SCORING, PRESTIGE_FULL_ENERGY, PRESTIGE_EARLY_YIELD } from '../data/prestige.js'
import { PORTAL_DATA } from '../data/portals.js'

const ALL_PORTAL_IDS = ['ignea', 'abismal', 'temporal', 'vacio', 'celestial', 'caos', 'primordial', 'singular']

function _tree(state) {
  return state.prestige?.tree || {}
}

export const PrestigeSystem = {

  // ── Condición de prestige ───────────────────────────────────────────────────
  canPrestige(state) {
    const frags = this.calcFragments(state)

    // Full path: Singular ≥ 1 + totalEnergyEarned ≥ 500M
    if (
      (state.portals.singular || 0) >= 1 &&
      state.totalEnergyEarned.gte(PRESTIGE_FULL_ENERGY)
    ) {
      return { can: true, type: 'full', fragments: frags }
    }

    // Early path: all 8 portal types unlocked (at least 1 each), 40% yield
    const allUnlocked = ALL_PORTAL_IDS.every(id => (state.portals[id] || 0) >= 1)
    if (allUnlocked) {
      return { can: true, type: 'early', fragments: Math.round(frags * PRESTIGE_EARLY_YIELD) }
    }

    return { can: false, type: null, fragments: frags }
  },

  // ── Cálculo de Fragmentos ───────────────────────────────────────────────────
  calcFragments(state) {
    let total = 0

    // Portales desbloqueados más allá de ignea
    const extraPortals = ALL_PORTAL_IDS.slice(1).filter(id => (state.portals[id] || 0) >= 1)
    total += extraPortals.length * FRAGMENT_SCORING.portalUnlock

    // Total de portales — bracket más alto alcanzado
    const totalPortals = ALL_PORTAL_IDS.reduce((s, id) => s + (state.portals[id] || 0), 0)
    for (const tier of FRAGMENT_SCORING.portalCountTiers) {
      if (totalPortals >= tier.min) { total += tier.bonus; break }
    }

    // Mejoras compradas
    const upgradesBought = Object.values(state.upgrades || {}).filter(Boolean).length
    total += Math.floor(upgradesBought / 5) * FRAGMENT_SCORING.upgradesPerFive

    // Sinergias activas
    const synergyCount = Object.values(state.activeSynergies || {}).filter(Boolean).length
    total += synergyCount * FRAGMENT_SCORING.synergyActive

    // Habilidades en L5
    const maxLevelAbilities = Object.values(state.abilities || {}).filter(a => a.level >= 5).length
    total += maxLevelAbilities * FRAGMENT_SCORING.abilityMaxLevel

    return Math.max(1, total)
  },

  // ── Comprar nodo del árbol ──────────────────────────────────────────────────
  buyNode(state, nodeId) {
    const node = PRESTIGE_NODES.find(n => n.id === nodeId)
    if (!node || node.auto) return { ok: false, reason: 'invalid' }

    const tree = _tree(state)
    if (tree[nodeId]) return { ok: false, reason: 'already_owned' }

    // Tier 2 requires at least 1 prestige already done
    if (node.tier === 2 && (state.prestige.runCount || 0) < 1) {
      return { ok: false, reason: 'tier_locked' }
    }

    // Dependency within branch
    for (const req of node.requires) {
      if (!tree[req]) return { ok: false, reason: 'requires_' + req }
    }

    // Cost
    if ((state.prestige.fragments || 0) < node.cost) {
      return { ok: false, reason: 'insufficient' }
    }

    state.prestige.fragments -= node.cost
    state.prestige.tree[nodeId] = true

    // Apply immediate effects
    this._applyNodeEffect(state, node)

    return { ok: true }
  },

  // ── Reset de Prestige ───────────────────────────────────────────────────────
  // Copia datos persistentes de oldState a newState y aplica los Fragmentos
  applyReset(oldState, newState) {
    // Abilities: level + exp + unlocked persisten
    Object.keys(oldState.abilities || {}).forEach(id => {
      if (newState.abilities[id] && oldState.abilities[id]) {
        newState.abilities[id].level   = oldState.abilities[id].level
        newState.abilities[id].exp     = oldState.abilities[id].exp
        newState.abilities[id].unlocked = oldState.abilities[id].unlocked
      }
    })

    // Prestige state completo persiste
    newState.prestige = {
      fragments:     (oldState.prestige?.fragments   || 0),
      totalEarned:   (oldState.prestige?.totalEarned || 0),
      runCount:      (oldState.prestige?.runCount    || 0),
      tree:          { ...(oldState.prestige?.tree   || {}) },
      storyUnlocked: [ ...(oldState.prestige?.storyUnlocked || []) ],
    }

    // Lore persiste (intro + fragments)
    newState.lore = {
      introSeen:         oldState.lore?.introSeen         || false,
      unlockedFragments: { ...(oldState.lore?.unlockedFragments || {}) },
    }

    // Misiones de historia completadas persisten
    newState.missions.history = { ...(oldState.missions?.history || {}) }

    // Calcular y asignar Fragmentos de esta run
    const check = this.canPrestige(oldState)
    const earned = check.type === 'early'
      ? Math.round(this.calcFragments(oldState) * PRESTIGE_EARLY_YIELD)
      : this.calcFragments(oldState)

    newState.prestige.fragments   += earned
    newState.prestige.totalEarned += earned
    newState.prestige.runCount    += 1

    // Story chapters auto-unlock (Branch D)
    const run = newState.prestige.runCount
    if (run >= 1 && !newState.prestige.storyUnlocked.includes(1)) newState.prestige.storyUnlocked.push(1)
    if (run >= 2 && !newState.prestige.storyUnlocked.includes(2)) newState.prestige.storyUnlocked.push(2)

    // Rift schedule persiste
    newState.rifts.nextSpawnAt = oldState.rifts?.nextSpawnAt || 0

    // Re-apply all tree effects onto fresh state
    Object.keys(newState.prestige.tree).forEach(nodeId => {
      const node = PRESTIGE_NODES.find(n => n.id === nodeId)
      if (node) this._applyNodeEffect(newState, node)
    })
  },

  // ── Status de nodo para la UI ───────────────────────────────────────────────
  getNodeStatus(state, nodeId) {
    const node = PRESTIGE_NODES.find(n => n.id === nodeId)
    if (!node) return 'locked'
    const tree = _tree(state)
    if (tree[nodeId] || node.auto) return 'owned'
    if (node.tier === 2 && (state.prestige?.runCount || 0) < 1) return 'locked'
    const depsOk = node.requires.every(r => tree[r])
    if (!depsOk) return 'locked'
    if ((state.prestige?.fragments || 0) < node.cost) return 'insufficient'
    return 'available'
  },

  // ── Effect getters ──────────────────────────────────────────────────────────
  getOfflineCapHours(state) {
    return _tree(state)['c1'] ? 4 : 2
  },

  hasFreeFirstPortal(state) {
    return !!_tree(state)['c2']
  },

  getUpgradeCostDiscount(state) {
    return _tree(state)['c3'] ? 0.15 : 0
  },

  getAbilityExpBonus(state) {
    return _tree(state)['a3'] ? 0.5 : 0
  },

  getAscendedPortals(state) {
    const tree = _tree(state)
    const portals = []
    if (tree['b1']) portals.push('ignea')
    if (tree['b2']) portals.push('abismal', 'temporal')
    if (tree['b3']) portals.push('vacio', 'celestial')
    if (tree['b4']) portals.push('caos', 'primordial', 'singular')
    return portals
  },

  // ── Aplicar efecto de nodo ──────────────────────────────────────────────────
  _applyNodeEffect(state, node) {
    const e = node.effect
    if (e.type === 'offline_cap') {
      state.offlineCap = e.hours * 3600
    }
    // Other effects are read dynamically via the getters above
  },
}
