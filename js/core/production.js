// ── Cálculo de producción ─────────────────────────────────────────────────────

import { PORTAL_DATA }  from '../data/portals.js'
import { UPGRADE_DATA } from '../data/upgrades.js'
import { VIAJERO_DATA } from '../data/viajeros.js'
import { Synergies }    from '../systems/synergies.js'

// ── Artifact stat lookup (inlined to avoid circular dep) ──────────────────────
// Mirrors ARTIFACT_DATA stat fields from data/viajeros.js. Keep in sync.
const _ARTIFACT_STAT = {
  head_ember:     { type: 'prod_pct',     base: 0.05 },
  head_temporal:  { type: 'prod_pct',     base: 0.08 },
  head_void:      { type: 'prod_pct',     base: 0.12 },
  head_celestial: { type: 'prod_pct',     base: 0.20 },
  wpn_fire:       { type: 'click_mult',   base: 1.5  },
  wpn_abyss:      { type: 'click_mult',   base: 2.0  },
  wpn_chaos:      { type: 'click_mult',   base: 3.0  },
  wpn_singularis: { type: 'click_mult',   base: 5.0  },
  rel_compass:    { type: 'exp_speed',    base: 0.10 },
  rel_hourglass:  { type: 'exp_speed',    base: 0.15 },
  rel_nexus:      { type: 'cd_reduction', base: 0.05 },
  rel_primal:     { type: 'cd_reduction', base: 0.10 },
}

function _artStat(defId) { return _ARTIFACT_STAT[defId] || null }

// ── Helpers internos ──────────────────────────────────────────────────────────

function _roster(state)    { return state.viajeros?.roster    || {} }
function _artifacts(state) { return state.viajeros?.artifacts || {} }
function _assigns(state)   { return state.viajeros?.assignments || {} }

// Portal multiplier contributed by the Guardian assigned to this portal
function _guardianPortalMult(state, portalId) {
  const vId = _assigns(state)[portalId]
  if (!vId) return 1
  const def = VIAJERO_DATA.find(v => v.id === vId)
  if (!def) return 1

  let mult = 1
  const ge = def.guardianEffect
  if (ge) {
    if (ge.type === 'portal_mult' && ge.portalId === portalId)       mult *= ge.mult
    if (ge.type === 'multi_portal_mult' && ge.portals.includes(portalId)) mult *= ge.mult
    // global_mult is handled separately in getGuardianGlobalMult
  }

  // bonusEffect targeting this portal from this guardian
  if (def.bonusEffect?.type === 'portal_mult' && def.bonusEffect.portalId === portalId) {
    mult *= def.bonusEffect.mult
  }

  // bonusEffect on OTHER guardians targeting this portal (e.g. Solara's ignea bonus)
  for (const [pid, vid] of Object.entries(_assigns(state))) {
    if (pid === portalId || !vid) continue
    const other = VIAJERO_DATA.find(v => v.id === vid)
    if (other?.bonusEffect?.type === 'portal_mult' && other.bonusEffect.portalId === portalId) {
      mult *= other.bonusEffect.mult
    }
  }

  // Head artifact prod_pct bonus of assigned Guardian
  const vData  = _roster(state)[vId]
  const headId = vData?.artifacts?.head
  if (headId) {
    const entry = _artifacts(state)[headId]
    if (entry) {
      const stat = _artStat(entry.defId)
      if (stat?.type === 'prod_pct') mult *= (1 + stat.base * entry.stars)
    }
  }

  return mult
}

// ── API pública ───────────────────────────────────────────────────────────────

export const Production = {

  // Multiplicador acumulado de mejoras de portal compradas
  getMultiplier(state, portalId) {
    return UPGRADE_DATA
      .filter(u => u.portalId === portalId && state.upgrades[u.id])
      .reduce((m, u) => m * u.multiplier, 1)
  },

  // Multiplicador de mejoras globales compradas
  getGlobalMultiplier(state) {
    return UPGRADE_DATA
      .filter(u => u.portalId === 'global' && state.upgrades[u.id])
      .reduce((m, u) => m * u.multiplier, 1)
  },

  // Multiplicador global de guardianes (global_mult effect) + passive global_mult
  getGuardianGlobalMult(state) {
    let mult = 1

    // global_mult from Viajeros assigned as Guardians
    for (const [, vId] of Object.entries(_assigns(state))) {
      if (!vId) continue
      const def = VIAJERO_DATA.find(v => v.id === vId)
      if (def?.guardianEffect?.type === 'global_mult') mult *= def.guardianEffect.mult
    }

    // passiveEffect global_mult from all owned Viajeros
    for (const [vId, data] of Object.entries(_roster(state))) {
      if (!data) continue
      const def = VIAJERO_DATA.find(v => v.id === vId)
      if (def?.passiveEffect?.type === 'global_mult') mult *= def.passiveEffect.mult
    }

    return mult
  },

  // Producción/s de un tipo de portal
  ofPortal(state, portalId) {
    const def   = PORTAL_DATA.find(p => p.id === portalId)
    const count = state.portals[portalId] || 0
    if (!def || count === 0) return new Decimal(0)
    return new Decimal(def.baseProduction)
      .mul(count)
      .mul(this.getMultiplier(state, portalId))
      .mul(_guardianPortalMult(state, portalId))
  },

  // Producción/s total — mejoras globales + sinergias + guardianes
  total(state) {
    const base = PORTAL_DATA.reduce(
      (sum, p) => sum.add(this.ofPortal(state, p.id)),
      new Decimal(0)
    )
    return base
      .mul(this.getGlobalMultiplier(state))
      .mul(Synergies.getMultiplier(state))
      .mul(this.getGuardianGlobalMult(state))
  },

  // Poder de click — incluye weapon artifacts + bonusEffect click_mult
  clickPower(state, totalProd = null) {
    const flatMult = UPGRADE_DATA
      .filter(u => u.portalId === 'click' && !u.prodMinutes && state.upgrades[u.id])
      .reduce((m, u) => m * u.multiplier, 1)

    const artifactMult = this._artifactClickMult(state)
    const flatPower    = new Decimal(flatMult).mul(artifactMult)

    if (!totalProd) return flatPower

    const prodUpgs = UPGRADE_DATA
      .filter(u => u.portalId === 'click' && u.prodMinutes && state.upgrades[u.id])
    if (prodUpgs.length === 0) return flatPower

    const bestMinutes = Math.max(...prodUpgs.map(u => u.prodMinutes))
    const prodBased   = totalProd.mul(bestMinutes * 60).mul(artifactMult)
    return prodBased.gt(flatPower) ? prodBased : flatPower
  },

  // Weapon artifact click mult from all owned Viajeros + bonusEffect click_mult from Guardians
  _artifactClickMult(state) {
    let mult = 1

    for (const [, data] of Object.entries(_roster(state))) {
      if (!data) continue
      const wpnId = data.artifacts?.weapon
      if (!wpnId) continue
      const entry = _artifacts(state)[wpnId]
      if (!entry) continue
      const stat = _artStat(entry.defId)
      if (stat?.type === 'click_mult') mult *= stat.base * entry.stars
    }

    for (const [, vId] of Object.entries(_assigns(state))) {
      if (!vId) continue
      const def = VIAJERO_DATA.find(v => v.id === vId)
      if (def?.bonusEffect?.type === 'click_mult') mult *= def.bonusEffect.mult
    }

    return mult
  },
}
