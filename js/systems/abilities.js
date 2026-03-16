// ── Sistema de habilidades activas ────────────────────────────────────────────

import { ABILITY_DATA } from '../data/abilities.js'

export const Abilities = {

  // ── Consultas de estado ────────────────────────────────────────────────────

  isOnCooldown(state, id) {
    const ab  = ABILITY_DATA.find(a => a.id === id)
    const ast = state.abilities[id]
    if (!ab || !ast) return false
    return Date.now() < ast.lastUsed + ab.cooldown * 1000
  },

  isActive(state, id) {
    const ast = state.abilities[id]
    if (!ast || !ast.activeUntil) return false
    return Date.now() < ast.activeUntil
  },

  // Segundos restantes de cooldown (0 si listo)
  cooldownRemaining(state, id) {
    const ab  = ABILITY_DATA.find(a => a.id === id)
    const ast = state.abilities[id]
    if (!ab || !ast) return 0
    return Math.max(0, (ast.lastUsed + ab.cooldown * 1000 - Date.now()) / 1000)
  },

  // Segundos restantes de efecto activo (0 si no está activa)
  activeRemaining(state, id) {
    const ast = state.abilities[id]
    if (!ast || !ast.activeUntil) return 0
    return Math.max(0, (ast.activeUntil - Date.now()) / 1000)
  },

  // Multiplicador de producción de habilidades activas (para Convergencia)
  getProductionMultiplier(state) {
    let mult = 1
    ABILITY_DATA
      .filter(ab => ab.type === 'buff' && this.isActive(state, ab.id))
      .forEach(ab => { mult *= ab.buffValue })
    return mult
  },

  // ── Activar habilidad ──────────────────────────────────────────────────────
  // Retorna { ok, energy } — energy es la energía instantánea para 'instant'
  activate(state, id, currentProduction) {
    if (this.isOnCooldown(state, id)) return { ok: false }
    if (this.isActive(state, id))     return { ok: false }

    const ab  = ABILITY_DATA.find(a => a.id === id)
    const ast = state.abilities[id]
    if (!ab || !ast) return { ok: false }

    const now = Date.now()
    ast.lastUsed = now

    if (ab.type === 'buff' || ab.type === 'autoclicker') {
      ast.activeUntil = now + ab.duration * 1000
      return { ok: true }
    }

    if (ab.type === 'instant') {
      const energy = currentProduction.mul(ab.prodSeconds)
      return { ok: true, energy }
    }

    return { ok: false }
  },

  // ── Tick del auto-clicker (llamado desde el game loop) ────────────────────
  // Retorna cantidad de auto-clicks para este delta
  getAutoClicks(state, delta) {
    const tormenta = ABILITY_DATA.find(a => a.id === 'tormenta')
    if (!this.isActive(state, 'tormenta')) return 0
    return Math.floor(delta / tormenta.clickRate)
  },
}
