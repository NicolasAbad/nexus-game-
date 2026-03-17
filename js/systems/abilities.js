// ── Sistema de habilidades activas ────────────────────────────────────────────

import { ABILITY_DATA, EXP_THRESHOLDS } from '../data/abilities.js'
import { PORTAL_DATA }                  from '../data/portals.js'
import { Production }                   from '../core/production.js'

// Retorna el timestamp de medianoche de hoy (inicio del día actual)
function todayMidnight() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export const Abilities = {

  // ── Helpers de nivel ───────────────────────────────────────────────────────

  getLevelDef(ab, level) {
    return ab.levels[(level || 1) - 1]
  },

  // Comprueba y aplica level-up si el EXP lo permite
  _checkLevelUp(ast) {
    while (ast.level < 5 && ast.exp >= EXP_THRESHOLDS[ast.level]) {
      ast.level++
    }
  },

  // ── Reset diario ──────────────────────────────────────────────────────────

  _resetDailyIfNeeded(ast) {
    const midnight = todayMidnight()
    if (ast.dailyReset < midnight) {
      ast.usesToday  = 0
      ast.dailyReset = midnight
    }
  },

  // ── Consultas de estado ────────────────────────────────────────────────────

  isUnlocked(state, id) {
    return !!(state.abilities[id]?.unlocked)
  },

  isOnCooldown(state, id) {
    const ab  = ABILITY_DATA.find(a => a.id === id)
    const ast = state.abilities[id]
    if (!ab || !ast || !ast.unlocked) return false
    const lvDef = this.getLevelDef(ab, ast.level)
    return Date.now() < ast.lastUsed + lvDef.cooldownH * 3600 * 1000
  },

  isActive(state, id) {
    const ast = state.abilities[id]
    if (!ast || !ast.unlocked) return false
    return Date.now() < ast.activeUntil
  },

  isDailyLimitReached(state, id) {
    const ab  = ABILITY_DATA.find(a => a.id === id)
    const ast = state.abilities[id]
    if (!ab || !ast) return false
    this._resetDailyIfNeeded(ast)
    return ast.usesToday >= ab.dailyFree
  },

  cooldownRemaining(state, id) {
    const ab  = ABILITY_DATA.find(a => a.id === id)
    const ast = state.abilities[id]
    if (!ab || !ast) return 0
    const lvDef = this.getLevelDef(ab, ast.level)
    return Math.max(0, (ast.lastUsed + lvDef.cooldownH * 3600 * 1000 - Date.now()) / 1000)
  },

  activeRemaining(state, id) {
    const ast = state.abilities[id]
    if (!ast) return 0
    return Math.max(0, (ast.activeUntil - Date.now()) / 1000)
  },

  usesRemainingToday(state, id) {
    const ab  = ABILITY_DATA.find(a => a.id === id)
    const ast = state.abilities[id]
    if (!ab || !ast) return 0
    this._resetDailyIfNeeded(ast)
    return Math.max(0, ab.dailyFree - ast.usesToday)
  },

  // EXP necesaria para el próximo nivel (0 si ya es L5)
  expToNextLevel(ast) {
    if (ast.level >= 5) return 0
    return EXP_THRESHOLDS[ast.level] - ast.exp
  },

  // Progreso de EXP dentro del nivel actual (0.0 - 1.0)
  expProgress(ast) {
    if (ast.level >= 5) return 1
    const from = EXP_THRESHOLDS[ast.level - 1]
    const to   = EXP_THRESHOLDS[ast.level]
    return Math.min(1, (ast.exp - from) / (to - from))
  },

  // ── Efectos activos en el game loop ───────────────────────────────────────

  // Multiplicador de producción por Convergencia activa
  getProductionMultiplier(state) {
    if (!this.isActive(state, 'convergencia')) return 1
    const ab  = ABILITY_DATA.find(a => a.id === 'convergencia')
    const ast = state.abilities['convergencia']
    return this.getLevelDef(ab, ast.level).mult
  },

  // Bonus de energía/s por Resonancia en Cadena activa
  getChainBonus(state) {
    if (!this.isActive(state, 'resonancia')) return new Decimal(0)
    const ab    = ABILITY_DATA.find(a => a.id === 'resonancia')
    const ast   = state.abilities['resonancia']
    const bonus = this.getLevelDef(ab, ast.level).bonusPerPortal
    let extra   = new Decimal(0)
    PORTAL_DATA.forEach((p, i) => {
      const portalProd = Production.ofPortal(state, p.id)
      const chainMult  = Math.pow(1 + bonus, i + 1) - 1  // bonus encima del 1x base
      extra = extra.add(portalProd.mul(chainMult))
    })
    return extra
  },

  // Descuento de costo por Cristalización activa (0.0 - 0.5)
  getCostDiscount(state) {
    if (!this.isActive(state, 'cristalizacion')) return 0
    const ab  = ABILITY_DATA.find(a => a.id === 'cristalizacion')
    const ast = state.abilities['cristalizacion']
    return this.getLevelDef(ab, ast.level).discount
  },

  // Multiplicador de click para auto-clicks de Tormenta
  getAutoClickMultiplier(state) {
    if (!this.isActive(state, 'tormenta')) return 1
    const ab  = ABILITY_DATA.find(a => a.id === 'tormenta')
    const ast = state.abilities['tormenta']
    return this.getLevelDef(ab, ast.level).clickMult
  },

  // Cantidad de auto-clicks para este delta (en segundos)
  getAutoClicks(state, delta) {
    if (!this.isActive(state, 'tormenta')) return 0
    const ab    = ABILITY_DATA.find(a => a.id === 'tormenta')
    const ast   = state.abilities['tormenta']
    const lvDef = this.getLevelDef(ab, ast.level)
    return Math.floor(delta / (lvDef.intervalMs / 1000))
  },

  // ── Desbloqueos ───────────────────────────────────────────────────────────
  // Devuelve array de IDs recién desbloqueados

  checkUnlocks(state) {
    const fresh = []
    ABILITY_DATA.forEach(ab => {
      const ast = state.abilities[ab.id]
      if (!ast || ast.unlocked) return

      const c   = ab.unlockCondition
      let   met = false

      if (c.type === 'totalEnergy') {
        met = state.totalEnergyEarned.gte(c.amount)
      } else if (c.type === 'totalPortals') {
        const total = Object.values(state.portals).reduce((s, n) => s + n, 0)
        met = total >= c.amount
      } else if (c.type === 'portalCount') {
        met = (state.portals[c.portalId] || 0) >= c.count
      } else if (c.type === 'allPortalTypes') {
        met = PORTAL_DATA.every(p => (state.portals[p.id] || 0) >= 1)
      }

      if (met) {
        ast.unlocked = true
        fresh.push(ab.id)
      }
    })
    return fresh
  },

  // ── Activar habilidad ──────────────────────────────────────────────────────
  // Retorna { ok, reason?, energy?, leveledUp? }

  activate(state, id, currentProduction) {
    const ab  = ABILITY_DATA.find(a => a.id === id)
    const ast = state.abilities[id]
    if (!ab || !ast)          return { ok: false, reason: 'not_found' }
    if (!ast.unlocked)        return { ok: false, reason: 'locked' }
    if (this.isOnCooldown(state, id))     return { ok: false, reason: 'cooldown' }
    if (this.isActive(state, id))         return { ok: false, reason: 'active' }

    this._resetDailyIfNeeded(ast)
    if (this.isDailyLimitReached(state, id)) return { ok: false, reason: 'daily_limit' }

    const now   = Date.now()
    const lvDef = this.getLevelDef(ab, ast.level)

    ast.lastUsed  = now
    ast.usesToday++
    ast.exp++

    const prevLevel = ast.level
    this._checkLevelUp(ast)
    const leveledUp = ast.level > prevLevel

    // Efectos con duración
    if (['buff', 'autoclicker', 'costReduction', 'chain'].includes(ab.type)) {
      ast.activeUntil = now + lvDef.duration * 1000
      return { ok: true, leveledUp }
    }

    // Efecto instantáneo
    if (ab.type === 'instant') {
      const energy = currentProduction.mul(lvDef.prodMinutes * 60)
      return { ok: true, energy, leveledUp }
    }

    return { ok: false, reason: 'unknown_type' }
  },
}
