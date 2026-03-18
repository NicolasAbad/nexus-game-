// ── Sistema de Viajeros ───────────────────────────────────────────────────────
//
//  API pública:
//    checkArrivals(state)                    → string[]  newly arrived viajero IDs
//    isOwned(state, id)                      → bool
//    isOnExpedition(state, id)               → bool
//    getAssignment(state, id)                → portalId | null
//    getExpeditionSlotsMax(state)            → number (1 or 2)
//    canSendExpedition(state)                → bool
//    sendExpedition(state, id)               → bool
//    tickExpeditions(state, currentProd)     → [{ id, loot }]  completed
//    assignGuardian(state, id, portalId)     → bool
//    unassignGuardian(state, id)             → bool
//    pull(state, n)                          → { ok, reason?, results: [] }
//    equipArtifact(state, vId, slot, instId) → bool
//    unequipArtifact(state, vId, slot)       → bool
//    upgradeArtifact(state, instId)          → bool
//    getCdReduction(state)                   → 0..0.5  (fraction)
//    getExpSpeedMult(state, vId)             → 0..0.75 (fraction to subtract from 1)
//    getPassiveGlobalMult(state)             → Decimal multiplier from passiveEffects
//    getPrestigeFragBonus(state)             → multiplier on fragment scoring
//    getOfflineCapMult(state)                → 1 or higher (from Tempus)

import '../utils/decimal.js'
import {
  VIAJERO_DATA, ARTIFACT_DATA,
  GACHA_RATES, GACHA_PITY_HARD, GACHA_PITY_SOFT,
  GACHA_COST_SINGLE, GACHA_COST_TEN,
  EXPEDITION_DURATION_H, EXPEDITION_LOOT,
} from '../data/viajeros.js'
import { FUSION_TABLE }  from '../data/bonds.js'
import { RESONANCE_LORE } from '../data/viajero_lore.js'
import { BondSystem }    from './bonds.js'

// ── Helpers internos ──────────────────────────────────────────────────────────

function _def(id)        { return VIAJERO_DATA.find(v => v.id === id) }
function _artDef(defId)  { return ARTIFACT_DATA.find(a => a.id === defId) }
function _roster(state)  { return state.viajeros?.roster || {} }

function _statValue(artDef, stars) {
  if (!artDef) return 0
  const s = artDef.stat
  if (s.type === 'click_mult') return s.base * stars   // additive stacking multiplier
  return s.base * stars                                 // fraction × stars
}

// Generates a simple sequential artifact instance ID
function _newArtifactId(state) {
  const id = state.viajeros._nextArtifactId++
  return 'art_' + id
}

// Rolls a random viajero ID from gacha pool given target rarity
function _rollViajero(state, rarity) {
  const pool = VIAJERO_DATA.filter(v => v.rarity === rarity && v.arrivalSource === 'gacha')
  if (pool.length === 0) return null
  // Filter already-owned to separate tracking only — duplicates still roll
  return pool[Math.floor(Math.random() * pool.length)].id
}

// Resolve rarity for a single pull, applying soft pity
function _resolveRarity(pityCount) {
  let rates = { ...GACHA_RATES }
  if (pityCount >= GACHA_PITY_SOFT) {
    // Each pull above soft pity boosts épico chance by +2%
    const boost = Math.min((pityCount - GACHA_PITY_SOFT + 1) * 0.02, 0.30)
    rates.epico    = Math.min(0.40, rates.epico + boost)
    rates.legendario = Math.min(0.10, rates.legendario + boost / 4)
    const excess = (rates.epico - GACHA_RATES.epico) + (rates.legendario - GACHA_RATES.legendario)
    rates.common = Math.max(0.10, rates.common - excess * 0.7)
    rates.raro   = Math.max(0.05, rates.raro   - excess * 0.3)
  }
  const r = Math.random()
  if (r < rates.legendario)                    return 'legendario'
  if (r < rates.legendario + rates.epico)      return 'epico'
  if (r < rates.legendario + rates.epico + rates.raro) return 'raro'
  return 'common'
}

// Drops an artifact instance into state.viajeros.artifacts and returns instId or null
function _rollArtifact(state, lootConfig) {
  if (Math.random() > lootConfig.artifactChance) return null
  const pool   = lootConfig.artifactPool
  const defId  = pool[Math.floor(Math.random() * pool.length)]
  const instId = _newArtifactId(state)
  state.viajeros.artifacts[instId] = { defId, stars: 1, copies: 1 }
  return instId
}

// ── Sistema principal ─────────────────────────────────────────────────────────
export const ViajerosSystem = {

  // ── Arrivals ────────────────────────────────────────────────────────────────
  // Called after prestige applyReset handles story arrivals.
  // Here we detect if any story-gated Viajeros need to be granted
  // (e.g., if state was loaded from old save that predates applyReset logic).
  checkArrivals(state) {
    const fresh = []
    const tree  = state.prestige?.tree || {}

    if (tree.a1 && !_roster(state).kael) {
      this._grantViajero(state, 'kael')
      fresh.push('kael')
    }
    if (tree.a2 && !_roster(state).lyra) {
      this._grantViajero(state, 'lyra')
      fresh.push('lyra')
    }
    return fresh
  },

  _grantViajero(state, id) {
    if (!state.viajeros.roster[id]) {
      state.viajeros.roster[id] = {
        resonance: 0,
        expeditions: 0,
        artifacts: { head: null, weapon: null, relic: null },
      }
    }
  },

  // ── Queries ─────────────────────────────────────────────────────────────────
  isOwned(state, id) {
    return !!state.viajeros?.roster?.[id]
  },

  isOnExpedition(state, id) {
    return (state.viajeros?.expeditions || []).some(e => e.viajeroid === id)
  },

  getAssignment(state, id) {
    const asn = state.viajeros?.assignments || {}
    for (const [portalId, vid] of Object.entries(asn)) {
      if (vid === id) return portalId
    }
    return null
  },

  // Max expedition slots: 1 base, +1 if A2 prestige node owned OR Origin in Council
  getExpeditionSlotsMax(state) {
    const fromPrestige = state.prestige?.tree?.a2 ? 1 : 0
    const fromCouncil  = this.getExtraExpeditionSlot(state) ? 1 : 0
    return 1 + fromPrestige + fromCouncil
  },

  canSendExpedition(state) {
    const active = (state.viajeros?.expeditions || []).length
    return active < this.getExpeditionSlotsMax(state)
  },

  // ── Expeditions ─────────────────────────────────────────────────────────────
  sendExpedition(state, viajeroid) {
    if (!this.isOwned(state, viajeroid))       return false
    if (this.isOnExpedition(state, viajeroid)) return false
    if (this.getAssignment(state, viajeroid))  return false   // assigned guardians can't explore
    if (!this.canSendExpedition(state))        return false

    const def      = _def(viajeroid)
    if (!def) return false

    const baseH    = EXPEDITION_DURATION_H[def.dimension] || 4
    const speedMult = this.getExpSpeedMult(state, viajeroid)
    const durationMs = baseH * 3600 * 1000 * (1 - speedMult)

    state.viajeros.expeditions.push({
      viajeroid,
      returnsAt:  Date.now() + durationMs,
      durationH:  baseH,
      rarity:     def.rarity,
    })
    return true
  },

  // Returns array of completed expedition results (mutates state)
  tickExpeditions(state, currentProd) {
    const now       = Date.now()
    const completed = []
    const remaining = []

    for (const exp of (state.viajeros?.expeditions || [])) {
      if (now >= exp.returnsAt) {
        const loot = this._computeLoot(state, exp, currentProd)
        // Increment expedition counter + resonance for that Viajero
        const entry = _roster(state)[exp.viajeroid]
        let loreKeys = []
        if (entry) {
          entry.expeditions = (entry.expeditions || 0) + 1
          loreKeys = this.incrementResonanceForExpedition(state, exp.viajeroid)
        }
        completed.push({ viajeroid: exp.viajeroid, loot, loreKeys })
      } else {
        remaining.push(exp)
      }
    }

    state.viajeros.expeditions = remaining
    return completed
  },

  _computeLoot(state, exp, currentProd) {
    const config = EXPEDITION_LOOT[exp.rarity] || EXPEDITION_LOOT.common
    const def    = _def(exp.viajeroid)

    // Base energy
    let yieldMult = 1
    if (def?.explorerEffect?.type === 'expedition_yield') {
      yieldMult *= def.explorerEffect.mult
    }
    // Bond expedition yield bonus
    yieldMult *= BondSystem.getExpeditionYieldMult(state)

    const energy = currentProd
      ? currentProd.mul(config.energyMinutes * 60).mul(yieldMult)
      : new Decimal(0)

    // Prestige frags
    let prestigeFrags = config.prestigeFrags || 0
    if (def?.explorerEffect?.type === 'expedition_prestige') {
      prestigeFrags += def.explorerEffect.bonus
    }

    // Crystals
    const crystals = config.crystals || 0

    // Artifact
    const artifactInstId = _rollArtifact(state, config)

    return { energy, prestigeFrags, crystals, artifactInstId }
  },

  // ── Guardian assignment ─────────────────────────────────────────────────────
  assignGuardian(state, viajeroid, portalId) {
    if (!this.isOwned(state, viajeroid))        return false
    if (this.isOnExpedition(state, viajeroid))  return false

    const def = _def(viajeroid)
    if (!def || (def.role !== 'guardian' && def.role !== 'special' && def.role !== 'council')) {
      return false
    }

    // Unassign previous Viajero from this portal slot
    const prev = state.viajeros.assignments[portalId]
    if (prev) delete state.viajeros.assignments[portalId]

    // Unassign this Viajero from any other slot
    this.unassignGuardian(state, viajeroid)

    state.viajeros.assignments[portalId] = viajeroid
    return true
  },

  unassignGuardian(state, viajeroid) {
    const asn = state.viajeros.assignments
    for (const portalId of Object.keys(asn)) {
      if (asn[portalId] === viajeroid) {
        delete asn[portalId]
        return true
      }
    }
    return false
  },

  // ── Gacha ──────────────────────────────────────────────────────────────────
  pull(state, n = 1) {
    const cost = n === 10 ? GACHA_COST_TEN : GACHA_COST_SINGLE * n
    if ((state.crystals || 0) < cost) return { ok: false, reason: 'no_crystals' }

    state.crystals = (state.crystals || 0) - cost

    const preOwned = new Set(Object.keys(_roster(state)))
    const results  = []
    for (let i = 0; i < n; i++) {
      const pity   = state.viajeros.gacha.pityCount
      let rarity   = _resolveRarity(pity)

      // Hard pity: guarantee épico at 80 pulls
      if (pity >= GACHA_PITY_HARD) rarity = 'epico'

      const id = _rollViajero(state, rarity)
      if (!id) continue

      // If already owned, track duplicate copies
      if (_roster(state)[id]) {
        _roster(state)[id].copies = (_roster(state)[id].copies || 0) + 1
      } else {
        this._grantViajero(state, id)
      }

      // Reset pity on épico/legendario, increment otherwise
      if (rarity === 'epico' || rarity === 'legendario') {
        state.viajeros.gacha.pityCount = 0
      } else {
        state.viajeros.gacha.pityCount++
      }

      results.push({ id, rarity, isNew: !preOwned.has(id) })
    }

    // Trim history to 50 entries
    state.viajeros.gacha.history = [
      ...results,
      ...(state.viajeros.gacha.history || []),
    ].slice(0, 50)

    return { ok: true, results }
  },

  // ── Artifacts ──────────────────────────────────────────────────────────────
  equipArtifact(state, viajeroid, slot, instId) {
    const entry = state.viajeros.artifacts?.[instId]
    if (!entry) return false
    const def = _artDef(entry.defId)
    if (!def || def.slot !== slot) return false
    if (!_roster(state)[viajeroid]) return false

    _roster(state)[viajeroid].artifacts[slot] = instId
    return true
  },

  unequipArtifact(state, viajeroid, slot) {
    if (!_roster(state)[viajeroid]) return false
    _roster(state)[viajeroid].artifacts[slot] = null
    return true
  },

  // Upgrade: consume 3 copies of same defId to raise stars by 1 (max 5)
  upgradeArtifact(state, instId) {
    const entry = state.viajeros.artifacts?.[instId]
    if (!entry) return false
    if (entry.stars >= 5) return false

    // Count all instances of same defId
    const sameItems = Object.entries(state.viajeros.artifacts)
      .filter(([id, e]) => id !== instId && e.defId === entry.defId)
    if (sameItems.length < 2) return false  // need 2 others + this one = 3

    // Remove 2 others
    let removed = 0
    for (const [id] of sameItems) {
      if (removed >= 2) break
      delete state.viajeros.artifacts[id]
      removed++
    }

    entry.stars++
    return true
  },

  // ── Effect getters ──────────────────────────────────────────────────────────

  // Sum of cd_reduction across all cooldown_reduction explorers (who aren't on expedition)
  // + cd_reduction artifacts equipped on any owned Viajero
  getCdReduction(state) {
    let total = 0

    // Explorer effects (vex etc.) — apply when owned AND not on expedition
    for (const [id, data] of Object.entries(_roster(state))) {
      if (!data) continue
      const def = _def(id)
      if (def?.explorerEffect?.type === 'cooldown_reduction' && !this.isOnExpedition(state, id)) {
        total += def.explorerEffect.pct
      }
      // Relic artifacts equipped on this Viajero
      const relicInstId = data.artifacts?.relic
      if (relicInstId) {
        const artEntry = state.viajeros.artifacts?.[relicInstId]
        if (artEntry) {
          const artDef = _artDef(artEntry.defId)
          if (artDef?.stat.type === 'cd_reduction') {
            total += _statValue(artDef, artEntry.stars)
          }
        }
      }
    }

    return Math.min(0.50, total)
  },

  // Speed reduction fraction for a specific Viajero (from their explorerEffect + relic)
  getExpSpeedMult(state, viajeroid) {
    let total = 0
    const def  = _def(viajeroid)

    if (def?.explorerEffect?.type === 'expedition_time') {
      // mult is the fraction of base time (e.g. 0.75 = 25% faster = 0.25 reduction)
      total += (1 - def.explorerEffect.mult)
    }

    const data = _roster(state)[viajeroid]
    const relicInstId = data?.artifacts?.relic
    if (relicInstId) {
      const artEntry = state.viajeros.artifacts?.[relicInstId]
      if (artEntry) {
        const artDef = _artDef(artEntry.defId)
        if (artDef?.stat.type === 'exp_speed') {
          total += _statValue(artDef, artEntry.stars)
        }
      }
    }

    return Math.min(0.75, total)
  },

  // Combined global_mult from passiveEffects of all owned Viajeros.
  // Legendary passiveEffects only apply when the Viajero is in the Council.
  getPassiveGlobalMult(state) {
    const council = state.viajeros?.council || []
    let mult = new Decimal(1)
    for (const [id, data] of Object.entries(_roster(state))) {
      if (!data) continue
      const def = _def(id)
      if (!def?.passiveEffect) continue
      if (def.rarity === 'legendario' && !council.includes(id)) continue
      if (def.passiveEffect.type === 'global_mult') {
        mult = mult.mul(def.passiveEffect.mult)
      }
    }
    return mult
  },

  // Multiplier on prestige fragment scoring from nexar / prestige_frag_bonus
  getPrestigeFragBonus(state) {
    let mult = 1
    for (const [id, data] of Object.entries(_roster(state))) {
      if (!data) continue
      const def = _def(id)
      if (def?.passiveEffect?.type === 'prestige_frag_bonus') {
        mult *= def.passiveEffect.mult
      }
    }
    return mult
  },

  // Offline cap multiplier from Tempus passive effect (if owned)
  getOfflineCapMult(state) {
    for (const [id, data] of Object.entries(_roster(state))) {
      if (!data) continue
      const def = _def(id)
      if (def?.passiveEffect?.type === 'offline_cap_bonus') {
        return def.passiveEffect.mult
      }
    }
    return 1
  },

  // Click mult from weapon artifacts across all owned Viajeros
  getArtifactClickMult(state) {
    let mult = 1
    for (const [id, data] of Object.entries(_roster(state))) {
      if (!data) continue
      const wpnInstId = data.artifacts?.weapon
      if (!wpnInstId) continue
      const artEntry = state.viajeros.artifacts?.[wpnInstId]
      if (!artEntry) continue
      const artDef = _artDef(artEntry.defId)
      if (artDef?.stat.type === 'click_mult') {
        mult *= _statValue(artDef, artEntry.stars)
      }
    }
    // Also collect bonusEffect click_mult from assigned Guardians
    for (const [portalId, viajeroid] of Object.entries(state.viajeros?.assignments || {})) {
      if (!viajeroid) continue
      const def = _def(viajeroid)
      if (def?.bonusEffect?.type === 'click_mult') {
        mult *= def.bonusEffect.mult
      }
    }
    return mult
  },

  // prod_pct additive bonus for a specific portal (from Head artifact of assigned Guardian)
  getGuardianArtifactProdPct(state, portalId) {
    const viajeroid = state.viajeros?.assignments?.[portalId]
    if (!viajeroid) return 0
    const data = _roster(state)[viajeroid]
    if (!data) return 0
    const headInstId = data.artifacts?.head
    if (!headInstId) return 0
    const artEntry = state.viajeros.artifacts?.[headInstId]
    if (!artEntry) return 0
    const artDef = _artDef(artEntry.defId)
    if (artDef?.stat.type !== 'prod_pct') return 0
    return _statValue(artDef, artEntry.stars)
  },

  // ── Resonance ───────────────────────────────────────────────────────────────

  /**
   * +1 resonance for a Viajero after completing an expedition.
   * Returns array of lore keys newly unlocked (resonance hit 3, 6, or 9).
   */
  incrementResonanceForExpedition(state, viajeroid) {
    return this._incrementResonance(state, viajeroid)
  },

  /**
   * +1 resonance for ALL owned Viajeros when prestige fires.
   * Returns array of { viajeroid, loreKey } for newly unlocked lore fragments.
   */
  incrementResonanceForPrestige(state) {
    const unlocked = []
    for (const id of Object.keys(_roster(state))) {
      const newLore = this._incrementResonance(state, id)
      for (const key of newLore) unlocked.push({ viajeroid: id, loreKey: key })
    }
    return unlocked
  },

  /**
   * +1 resonance for the Guardian assigned to portalId when count hits a milestone.
   * Portal milestones: 10, 25, 50, 100. Returns lore keys unlocked or [].
   */
  incrementResonanceForPortalMilestone(state, portalId, count) {
    const milestones = [10, 25, 50, 100]
    if (!milestones.includes(count)) return []
    const viajeroid = state.viajeros?.assignments?.[portalId]
    if (!viajeroid) return []
    return this._incrementResonance(state, viajeroid)
  },

  // Internal: increment resonance by 1, return lore keys for milestones hit
  _incrementResonance(state, viajeroid) {
    const entry = _roster(state)[viajeroid]
    if (!entry) return []

    const prev = entry.resonance || 0
    const next  = Math.min(9, prev + 1)
    entry.resonance = next

    if (next === prev) return []   // already at max

    const loreMilestones = [3, 6, 9]
    const unlocked = []
    for (const lvl of loreMilestones) {
      if (prev < lvl && next >= lvl) {
        const key = RESONANCE_LORE[viajeroid]?.[lvl]
        if (key) unlocked.push(key)
      }
    }
    return unlocked
  },

  // ── Fusion ──────────────────────────────────────────────────────────────────

  /**
   * Fuse 3 copies of sourceId into 1 targetId.
   * sourceId must have copies >= 2 (base + 2 extras = 3 total).
   * Consumes the 2 extra copies and creates the target.
   * Returns { ok: true, targetId } or { ok: false, reason }.
   */
  fuseViajero(state, sourceId) {
    const entry = _roster(state)[sourceId]
    if (!entry) return { ok: false, reason: 'not_owned' }
    if ((entry.copies || 0) < 2) return { ok: false, reason: 'need_3_copies' }

    const fusePath = FUSION_TABLE.find(f => f.source === sourceId)
    if (!fusePath) return { ok: false, reason: 'no_fusion_path' }

    // Consume 2 copies
    entry.copies = entry.copies - 2

    // Grant target (creates if not owned, adds copy if already owned)
    const targetId = fusePath.target
    if (_roster(state)[targetId]) {
      _roster(state)[targetId].copies = (_roster(state)[targetId].copies || 0) + 1
    } else {
      this._grantViajero(state, targetId)
    }

    return { ok: true, targetId }
  },

  // ── Council of the Nexo ─────────────────────────────────────────────────────

  /** Assign a Legendary Viajero to the Council (max 3 slots). */
  assignCouncil(state, viajeroid) {
    const def = _def(viajeroid)
    if (!def || def.rarity !== 'legendario') return false
    if (!_roster(state)[viajeroid]) return false

    const council = state.viajeros.council || []
    if (council.includes(viajeroid)) return true  // already in council
    if (council.length >= 3) return false          // no free slot

    state.viajeros.council = [...council, viajeroid]
    return true
  },

  /** Remove a Viajero from the Council. */
  removeFromCouncil(state, viajeroid) {
    state.viajeros.council = (state.viajeros.council || []).filter(id => id !== viajeroid)
    return true
  },

  // ── Prestige frag + offline cap (council-aware) ────────────────────────────

  // Also gate extra_expedition_slot legendary effect to Council
  getExtraExpeditionSlot(state) {
    const council = state.viajeros?.council || []
    for (const id of council) {
      const def = _def(id)
      if (def?.passiveEffect?.type === 'extra_expedition_slot') return true
    }
    return false
  },

  // Returns expedition time remaining in seconds for a Viajero
  expeditionTimeRemaining(state, viajeroid) {
    const exp = (state.viajeros?.expeditions || []).find(e => e.viajeroid === viajeroid)
    if (!exp) return 0
    return Math.max(0, Math.ceil((exp.returnsAt - Date.now()) / 1000))
  },

  // Helpers for UI
  getOwnedList(state) {
    return Object.keys(_roster(state))
      .filter(id => _roster(state)[id])
      .map(id => ({ id, ..._roster(state)[id], def: _def(id) }))
  },

  getArtifactInventory(state) {
    return Object.entries(state.viajeros?.artifacts || {})
      .map(([instId, entry]) => ({ instId, ...entry, def: _artDef(entry.defId) }))
  },
}
