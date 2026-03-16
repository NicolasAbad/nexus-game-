// ============================================================
//  NEXUS: Lords of Dimensions — Stage 3
//  Orquestador principal
// ============================================================

import './utils/decimal.js'

import { Analytics }     from './utils/analytics.js'
import { EventBus }      from './utils/eventbus.js'
import { UI }            from './ui.js'
import { PORTAL_DATA }   from './data/portals.js'
import { UPGRADE_DATA }  from './data/upgrades.js'
import { createInitialState, UI_TICK_MS } from './core/state.js'
import { Production }    from './core/production.js'
import { SaveManager }   from './core/save.js'
import { OfflineEngine } from './core/offline.js'
import { UnlockSystem }  from './core/unlocks.js'
import { Tutorial }      from './systems/tutorial.js'
import { Abilities }     from './systems/abilities.js'

// ── Estado global ─────────────────────────────────────────────────────────────
let state       = null
let _lastTick   = 0
let _lastUITick = 0

// ── Helpers de costo ──────────────────────────────────────────────────────────

function portalCost(portalId) {
  const def   = PORTAL_DATA.find(p => p.id === portalId)
  const count = state.portals[portalId] || 0
  return new Decimal(def.baseCost).mul(new Decimal(def.costMultiplier).pow(count))
}

// Costo total de comprar n portales desde el count actual
function portalCostN(portalId, n) {
  const def   = PORTAL_DATA.find(p => p.id === portalId)
  const count = state.portals[portalId] || 0
  let total   = new Decimal(0)
  for (let i = 0; i < n; i++) {
    total = total.add(
      new Decimal(def.baseCost).mul(new Decimal(def.costMultiplier).pow(count + i))
    )
  }
  return total
}

// Máxima cantidad de portales que se pueden comprar con la energía actual
function portalMaxBuyable(portalId) {
  const def   = PORTAL_DATA.find(p => p.id === portalId)
  const count = state.portals[portalId] || 0
  let n     = 0
  let total = new Decimal(0)
  while (n < 10000) {
    const next = new Decimal(def.baseCost).mul(new Decimal(def.costMultiplier).pow(count + n))
    if (total.add(next).gt(state.energy)) break
    total = total.add(next)
    n++
  }
  return n
}

// ── Game loop ─────────────────────────────────────────────────────────────────
function loop(ts) {
  const delta = Math.min((ts - _lastTick) / 1000, 1)
  _lastTick = ts

  // Producción pasiva × multiplicador de habilidades activas
  const abilityMult = Abilities.getProductionMultiplier(state)
  const gained      = Production.total(state).mul(abilityMult).mul(delta)
  state.energy            = state.energy.add(gained)
  state.totalEnergyEarned = state.totalEnergyEarned.add(gained)

  // Auto-click de Tormenta
  const autoClicks = Abilities.getAutoClicks(state, delta)
  for (let i = 0; i < autoClicks; i++) _doClick(false)

  // Desbloqueos
  const fresh = UnlockSystem.check(state)
  if (fresh.length > 0) fresh.forEach(u => UI.applyUnlock(u, state))

  // UI a ~10fps
  if (ts - _lastUITick >= UI_TICK_MS) {
    UI.renderResources(state, abilityMult)
    UI.renderAffordability(state)
    UI.renderAbilities(state)
    _lastUITick = ts
  }

  requestAnimationFrame(loop)
}

// ── Lógica de click (interna, reutilizada por Tormenta) ───────────────────────
function _doClick(advanceTutorial = true) {
  const power = Production.clickPower(state)
  state.energy            = state.energy.add(power)
  state.totalEnergyEarned = state.totalEnergyEarned.add(power)
  state.totalClicks++

  if (advanceTutorial && state.tutorialStep === 0) Tutorial.advance(state, 1)

  const fresh = UnlockSystem.check(state)
  fresh.forEach(u => UI.applyUnlock(u, state))

  EventBus.emit('click', { totalClicks: state.totalClicks })
  return power
}

// ── Acciones públicas ─────────────────────────────────────────────────────────

function click() {
  return _doClick(true)
}

function buyPortal(portalId) {
  return buyPortalN(portalId, 1)
}

function buyPortalN(portalId, n) {
  if (n <= 0) return false
  const cost = portalCostN(portalId, n)
  if (state.energy.lt(cost)) return false

  state.energy = state.energy.sub(cost)
  state.portals[portalId] = (state.portals[portalId] || 0) + n

  if (state.tutorialStep === 1) Tutorial.advance(state, 2)
  if (state.tutorialStep === 2 && state.unlocks.panelUpgrades) Tutorial.complete(state)

  UI.renderPortalCard(portalId, state)
  const fresh = UnlockSystem.check(state)
  fresh.forEach(u => UI.applyUnlock(u, state))

  Analytics.track('portal_bought', { portalId, count: state.portals[portalId], batch: n })
  EventBus.emit('portal_bought', { portalId, count: state.portals[portalId] })
  return true
}

function buyPortalMax(portalId) {
  const n = portalMaxBuyable(portalId)
  if (n === 0) return false
  return buyPortalN(portalId, n)
}

function buyUpgrade(upgradeId) {
  const upg = UPGRADE_DATA.find(u => u.id === upgradeId)
  if (!upg || state.upgrades[upgradeId]) return false

  // Click upgrades: solo requieren el panel abierto (requires: 0)
  if (upg.portalId !== 'click') {
    if ((state.portals[upg.portalId] || 0) < upg.requires) return false
  }

  if (state.energy.lt(upg.cost)) return false

  state.energy              = state.energy.sub(new Decimal(upg.cost))
  state.upgrades[upgradeId] = true

  UI.renderUpgradeCard(upgradeId, state)
  UI.showNotification(`${upg.name} activada — ${upg.desc}`, 'success')
  Analytics.track('upgrade_bought', { upgradeId })
  EventBus.emit('upgrade_bought', { upgradeId })
  return true
}

function activateAbility(abilityId) {
  const prod   = Production.total(state)
  const result = Abilities.activate(state, abilityId, prod)

  if (!result.ok) return

  // Pulso Nexo da energía instantánea
  if (result.energy) {
    state.energy            = state.energy.add(result.energy)
    state.totalEnergyEarned = state.totalEnergyEarned.add(result.energy)
    UI.showNotification(`Pulso Nexo — +${UI.fmtPublic(result.energy)} Energía`, 'success')
  }

  UI.renderAbilities(state)
  Analytics.track('ability_used', { abilityId })
  EventBus.emit('ability_used', { abilityId })
}

async function reset() {
  const confirmed = await UI.showConfirm('¿Seguro? Se borrará todo el progreso.')
  if (!confirmed) return

  SaveManager.clear()
  state = createInitialState()
  UI.build()
  UI.renderAll(state)
  Tutorial._render(state)
  Analytics.track('reset')
  EventBus.emit('reset')
}

function manualSave() {
  state.lastSave = Date.now()
  SaveManager.save(state)
}

// ── Inicialización ────────────────────────────────────────────────────────────
function init() {
  Analytics.init(null)

  const saved = SaveManager.load()
  if (saved) {
    state = saved
    const off = OfflineEngine.calculate(state)
    if (off) {
      state.energy            = state.energy.add(off.earned)
      state.totalEnergyEarned = state.totalEnergyEarned.add(off.earned)
      Analytics.track('offline_income', { seconds: Math.round(off.secondsAway) })
      setTimeout(() => UI.showOfflineModal(off, state.offlineCap), 200)
    }
  } else {
    state = createInitialState()
    Analytics.track('new_game')
  }

  state.lastSave = Date.now()

  UI.init({
    click,
    buyPortal,
    buyPortalN,
    buyPortalMax,
    buyUpgrade,
    activateAbility,
    reset,
    manualSave,
    getState:        () => state,
    getPortalCost:   portalCost,
    getPortalCostN:  portalCostN,
    getPortalMax:    portalMaxBuyable,
  })

  UI.build()
  UI.renderAll(state)
  Tutorial._render(state)

  SaveManager.setupAutoSave(() => state)

  _lastTick = performance.now()
  requestAnimationFrame(loop)
}

window.addEventListener('load', init)
