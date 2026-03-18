// ── BondSystem ─────────────────────────────────────────────────────────────────
//
//  A bond activates when:
//   1. Both Viajeros in the pair are owned (in state.viajeros.roster)
//   2. The combined resonance of both Viajeros >= bond.resonanceRequired
//
//  No circular deps: this file only imports data, not production.js or viajeros.js
// ──────────────────────────────────────────────────────────────────────────────

import { BOND_DATA } from '../data/bonds.js'

const _roster = s => s.viajeros.roster

function _resonance(state, viajeroid) {
  const entry = _roster(state)[viajeroid]
  return entry ? (entry.resonance || 0) : 0
}

function _isActive(bond, state) {
  const [a, b] = bond.viajeros
  const ra = _resonance(state, a)
  const rb = _resonance(state, b)
  if (!_roster(state)[a] || !_roster(state)[b]) return false
  return (ra + rb) >= bond.resonanceRequired
}

// ── Public API ─────────────────────────────────────────────────────────────────

export const BondSystem = {

  /** Returns array of bond objects that are currently active */
  getActiveBonds(state) {
    return BOND_DATA.filter(b => _isActive(b, state))
  },

  /** Returns true if a specific bond id is active */
  isBondActive(state, bondId) {
    const bond = BOND_DATA.find(b => b.id === bondId)
    return bond ? _isActive(bond, state) : false
  },

  /**
   * Returns the combined portal production multiplier from portal_pair_mult bonds.
   * Called from production.js ofPortal().
   * @param {object} state
   * @param {string} portalId
   * @returns {number} multiplier (1.0 if no bond active for this portal)
   */
  getPortalMult(state, portalId) {
    let mult = 1
    for (const bond of BOND_DATA) {
      if (bond.effect.type !== 'portal_pair_mult') continue
      if (!bond.effect.portals.includes(portalId)) continue
      if (_isActive(bond, state)) mult *= bond.effect.mult
    }
    return mult
  },

  /**
   * Returns the combined all_portal_mult from bonds.
   * Called from production.js ofPortal() (applied to every portal).
   * @param {object} state
   * @returns {number}
   */
  getAllPortalMult(state) {
    let mult = 1
    for (const bond of BOND_DATA) {
      if (bond.effect.type !== 'all_portal_mult') continue
      if (_isActive(bond, state)) mult *= bond.effect.mult
    }
    return mult
  },

  /**
   * Returns the combined global production multiplier from global_mult bonds.
   * Called from production.js total().
   * @param {object} state
   * @returns {number}
   */
  getGlobalMult(state) {
    let mult = 1
    for (const bond of BOND_DATA) {
      if (bond.effect.type !== 'global_mult') continue
      if (_isActive(bond, state)) mult *= bond.effect.mult
    }
    return mult
  },

  /**
   * Returns the offline cap multiplier from offline_cap_mult bonds.
   * Called from offline.js.
   * @param {object} state
   * @returns {number}
   */
  getOfflineCapMult(state) {
    let mult = 1
    for (const bond of BOND_DATA) {
      if (bond.effect.type !== 'offline_cap_mult') continue
      if (_isActive(bond, state)) mult *= bond.effect.mult
    }
    return mult
  },

  /**
   * Returns the expedition energy yield multiplier from expedition_yield bonds.
   * Called from viajeros.js _computeLoot().
   * @param {object} state
   * @returns {number}
   */
  getExpeditionYieldMult(state) {
    let mult = 1
    for (const bond of BOND_DATA) {
      if (bond.effect.type !== 'expedition_yield') continue
      if (_isActive(bond, state)) mult *= bond.effect.mult
    }
    return mult
  },
}
