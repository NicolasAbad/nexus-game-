// ============================================================
//  NEXUS: Lords of Dimensions — Stage 6
//  Orquestador principal
// ============================================================

import './utils/decimal.js'

import { t, i18n }       from './utils/i18n.js'
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
import { Synergies }     from './systems/synergies.js'
import { MissionSystem } from './systems/missions.js'
import { LoreSystem }    from './systems/lore.js'
import { RiftSystem }    from './systems/rifts.js'
import { PrestigeSystem } from './systems/prestige.js'
import { ViajerosSystem } from './systems/viajeros.js'

// ── Estado global ─────────────────────────────────────────────────────────────
let state       = null
let _lastTick   = 0
let _lastUITick = 0

// ── Helpers de costo ──────────────────────────────────────────────────────────

function portalCost(portalId) {
  const def      = PORTAL_DATA.find(p => p.id === portalId)
  const count    = state.portals[portalId] || 0
  const base     = new Decimal(def.baseCost).mul(new Decimal(def.costMultiplier).pow(count))
  const discount = Abilities.getCostDiscount(state)
  return discount > 0 ? base.mul(1 - discount) : base
}

// Costo total de comprar n portales desde el count actual (aplica descuento de Cristalización)
function portalCostN(portalId, n) {
  const def      = PORTAL_DATA.find(p => p.id === portalId)
  const count    = state.portals[portalId] || 0
  const discount = Abilities.getCostDiscount(state)
  const mult     = discount > 0 ? (1 - discount) : 1
  let total      = new Decimal(0)
  for (let i = 0; i < n; i++) {
    total = total.add(
      new Decimal(def.baseCost).mul(new Decimal(def.costMultiplier).pow(count + i)).mul(mult)
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

  // Producción pasiva × multiplicadores de habilidades activas
  const abilityMult = Abilities.getProductionMultiplier(state)
  const chainBonus  = Abilities.getChainBonus(state)
  const baseProd    = Production.total(state)
  const gained      = baseProd.mul(abilityMult).add(chainBonus).mul(delta)
  state.energy            = state.energy.add(gained)
  state.totalEnergyEarned = state.totalEnergyEarned.add(gained)

  // Auto-click de Tormenta (con multiplicador de nivel)
  const autoClicks   = Abilities.getAutoClicks(state, delta)
  const autoClickMult = Abilities.getAutoClickMultiplier(state)
  for (let i = 0; i < autoClicks; i++) _doAutoClick(autoClickMult)

  // Desbloqueos de habilidades
  const newAbilityUnlocks = Abilities.checkUnlocks(state)
  newAbilityUnlocks.forEach(id => UI.applyAbilityUnlock(id, state))

  // Sinergias cross-portal
  const newSynergies = Synergies.checkNew(state)
  newSynergies.forEach(id =>
    UI.showNotification(t('notif.synergy_activated', { name: t('synergy.' + id + '.name') }), 'unlock')
  )

  // Desbloqueos
  const fresh = UnlockSystem.check(state)
  if (fresh.length > 0) fresh.forEach(u => UI.applyUnlock(u, state))

  // UI a ~10fps
  if (ts - _lastUITick >= UI_TICK_MS) {
    UI.renderResources(state, abilityMult)
    UI.renderAffordability(state)
    UI.renderAbilities(state)

    // Misiones
    const newMissions = MissionSystem.check(state, baseProd)
    if (newMissions.length > 0) {
      newMissions.forEach(({ id, energyReward }) => {
        state.energy            = state.energy.add(energyReward)
        state.totalEnergyEarned = state.totalEnergyEarned.add(energyReward)
        UI.showNotification(t('notif.mission_complete', { title: t('mission.' + id + '.title') }), 'success')
      })
      UI.renderMissions(state)
    }
    UI.renderNextObjective(state)

    // Lore fragments
    const freshFragments = LoreSystem.checkPortalFragments(state)
    if (freshFragments.length > 0) {
      freshFragments.forEach(f => {
        const portalName = t('portal.' + f.portalId + '.name')
        UI.showNotification(t('notif.lore_fragment', { portal: portalName }), 'unlock')
      })
      UI.renderLorePanel(state)
    }

    // Dimensional Rifts
    const riftEvent = RiftSystem.tick(state)
    if (riftEvent === 'spawned') {
      UI.showNotification(t('ui.rift.spawned'), 'unlock')
    }
    UI.renderRift(state)

    // Viajero expeditions
    const completedExps = ViajerosSystem.tickExpeditions(state, baseProd)
    if (completedExps.length > 0) {
      completedExps.forEach(({ viajeroid, loot }) => {
        if (loot.energy && loot.energy.gt(0)) {
          state.energy            = state.energy.add(loot.energy)
          state.totalEnergyEarned = state.totalEnergyEarned.add(loot.energy)
        }
        if (loot.prestigeFrags > 0) {
          state.prestige.fragments += loot.prestigeFrags
        }
        if (loot.crystals > 0) {
          state.crystals = (state.crystals || 0) + loot.crystals
        }
        const defId = viajeroid
        UI.showNotification(t('notif.expedition_complete', {
          name: t('viajero.' + defId + '.name'),
          energy: loot.energy ? UI.fmtPublic(loot.energy) : '0',
        }), 'success')
      })
      UI.renderViajeros(state)
      UI.renderCrystals(state)
    }

    // Viajero arrivals (idempotent check for story-gated Viajeros)
    const newArrivals = ViajerosSystem.checkArrivals(state)
    if (newArrivals.length > 0) {
      newArrivals.forEach(id => {
        UI.showNotification(t('notif.viajero_arrived', { name: t('viajero.' + id + '.name') }), 'unlock')
      })
      UI.renderViajeros(state)
    }

    // Prestige live counter (updates every UI tick)
    UI.renderPrestige(state)

    _lastUITick = ts
  }

  requestAnimationFrame(loop)
}

// ── Lógica de click (interna) ─────────────────────────────────────────────────
function _doClick(advanceTutorial = true) {
  const power = Production.clickPower(state, Production.total(state))
  state.energy            = state.energy.add(power)
  state.totalEnergyEarned = state.totalEnergyEarned.add(power)
  state.totalClicks++

  state.missions.daily.clicks++
  if (advanceTutorial && state.tutorialStep === 0) Tutorial.advance(state, 1)

  const fresh = UnlockSystem.check(state)
  fresh.forEach(u => UI.applyUnlock(u, state))

  EventBus.emit('click', { totalClicks: state.totalClicks })
  return power
}

// Auto-click de Tormenta (no avanza tutorial, aplica multiplicador de nivel)
function _doAutoClick(mult = 1) {
  const power = Production.clickPower(state, Production.total(state)).mul(mult)
  state.energy            = state.energy.add(power)
  state.totalEnergyEarned = state.totalEnergyEarned.add(power)
  state.totalClicks++
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

  // C2: first portal of each type is free in a post-prestige run
  const isFree = PrestigeSystem.hasFreeFirstPortal(state) && (state.portals[portalId] || 0) === 0
  const costN  = isFree && n === 1 ? new Decimal(0) : portalCostN(portalId, isFree ? n - 1 : n)

  if (state.energy.lt(costN)) return false

  state.energy = state.energy.sub(costN)
  state.portals[portalId] = (state.portals[portalId] || 0) + n
  state.missions.daily.portalsBought   += n
  state.missions.weekly.portalsBought  += n

  if (state.tutorialStep === 1) Tutorial.advance(state, 2)
  if (state.tutorialStep === 2 && state.unlocks.panelUpgrades) Tutorial.advance(state, 3)

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

  if (upg.portalId !== 'click' && upg.portalId !== 'global') {
    if ((state.portals[upg.portalId] || 0) < upg.requires) return false
  }
  if (upg.portalId === 'global' && upg.requiresEnergy) {
    if (state.totalEnergyEarned.lt(upg.requiresEnergy)) return false
  }

  const prestigeDisc = PrestigeSystem.getUpgradeCostDiscount(state)
  const finalCost    = new Decimal(upg.cost).mul(1 - prestigeDisc)
  if (state.energy.lt(finalCost)) return false

  state.energy              = state.energy.sub(finalCost)
  state.upgrades[upgradeId] = true

  UI.renderUpgradeCard(upgradeId, state)
  if (state.tutorialStep === 3) Tutorial.advance(state, 4)
  const upgName = t('upgrade.' + upgradeId + '.name')
  const upgDesc = upg.portalId === 'click'
    ? (upg.prodMinutes
        ? t('upgrade.click_prod', { min: upg.prodMinutes })
        : t('upgrade.click_power', { mult: upg.multiplier }))
    : upg.portalId === 'global'
      ? t('upgrade.global_all', { mult: upg.multiplier })
      : t('upgrade.portal_mult', { portal: t('portal.' + upg.portalId + '.name'), mult: upg.multiplier })
  UI.showNotification(t('notif.upgrade_bought', { name: upgName, desc: upgDesc }), 'success')
  Analytics.track('upgrade_bought', { upgradeId })
  EventBus.emit('upgrade_bought', { upgradeId })
  return true
}

function activateAbility(abilityId) {
  const prod   = Production.total(state)
  const result = Abilities.activate(state, abilityId, prod)

  if (!result.ok) {
    if (result.reason === 'daily_limit') {
      UI.showNotification(t('notif.ability_daily_limit'), 'info')
    }
    return
  }

  // Pulso Nexo da energía instantánea
  if (result.energy) {
    state.energy            = state.energy.add(result.energy)
    state.totalEnergyEarned = state.totalEnergyEarned.add(result.energy)
    UI.showNotification(t('notif.pulso_energy', { energy: UI.fmtPublic(result.energy) }), 'success')
  }

  // Level up de la habilidad
  if (result.leveledUp) {
    const ast = state.abilities[abilityId]
    UI.showNotification(t('notif.ability_levelup', { name: t('ability.' + abilityId + '.name'), level: ast.level }), 'unlock')
  }

  state.missions.daily.abilitiesUsed++

  UI.renderAbilities(state)
  Analytics.track('ability_used', { abilityId })
  EventBus.emit('ability_used', { abilityId })
}

function clickRift() {
  const baseProd = Production.total(state)
  const reward = RiftSystem.click(state, baseProd)
  if (reward) {
    state.energy            = state.energy.add(reward)
    state.totalEnergyEarned = state.totalEnergyEarned.add(reward)
    UI.showNotification(t('ui.rift.reward', { energy: UI.fmtPublic(reward) }), 'success')
    UI.renderRift(state)
  }
}

function prestige() {
  const check = PrestigeSystem.canPrestige(state)
  if (!check.can) return

  UI.showPrestigeModal(state, () => {
    const earned     = check.fragments
    const runNumber  = (state.prestige?.runCount || 0) + 1
    const newState   = createInitialState()
    PrestigeSystem.applyReset(state, newState)
    state = newState

    UI.showNotification(
      t('notif.prestige_done', { n: runNumber, frags: earned }),
      'unlock'
    )

    RiftSystem.scheduleFirst(state)
    UI.build()
    UI.renderAll(state)
    Tutorial.render(state)
    UI.renderMissions(state)
    UI.renderNextObjective(state)
    UI.renderLorePanel(state)
    UI.renderViajeros(state)
    Analytics.track('prestige', { runCount: runNumber, fragments: earned })
    EventBus.emit('prestige', { runCount: runNumber })
  })
}

function sendExpedition(viajeroid) {
  const ok = ViajerosSystem.sendExpedition(state, viajeroid)
  if (ok) {
    UI.showNotification(t('notif.expedition_sent', { name: t('viajero.' + viajeroid + '.name') }), 'info')
    UI.renderViajeros(state)
  }
}

function assignGuardian(viajeroid, portalId) {
  const ok = ViajerosSystem.assignGuardian(state, viajeroid, portalId)
  if (ok) {
    UI.renderViajeros(state)
    EventBus.emit('guardian_assigned', { viajeroid, portalId })
  }
}

function gachaPull(n) {
  const result = ViajerosSystem.pull(state, n)
  if (!result.ok) {
    if (result.reason === 'no_crystals') {
      UI.showNotification(t('ui.viajero.gacha.no_crystals'), 'info')
    }
    return
  }
  result.results.forEach(r => {
    UI.showNotification(t('notif.viajero_pulled', {
      name:   t('viajero.' + r.id + '.name'),
      rarity: t('viajero.rarity.' + r.rarity),
    }), r.rarity === 'legendario' ? 'unlock' : 'success')
  })
  UI.renderViajeros(state)
  UI.renderCrystals(state)
  Analytics.track('gacha_pull', { n, results: result.results.map(r => r.rarity) })
  EventBus.emit('gacha_pull', { n })
}

function buyPrestigeNode(nodeId) {
  const result = PrestigeSystem.buyNode(state, nodeId)
  if (result.ok) {
    const name = t('prestige.node.' + nodeId + '.name')
    UI.showNotification(t('notif.prestige_node', { name }), 'unlock')
    UI.renderPrestige(state)
    // If c1 bought, offline cap updates immediately (already done inside buyNode → _applyNodeEffect)
  }
}

async function reset() {
  const confirmed = await UI.showConfirm(t('modal.reset.message'))
  if (!confirmed) return

  SaveManager.clear()
  state = createInitialState()
  UI.build()
  UI.renderAll(state)
  Tutorial.render(state)
  Analytics.track('reset')
  EventBus.emit('reset')
}

function manualSave() {
  state.lastSave = Date.now()
  SaveManager.save(state)
}

// ── Inicialización ────────────────────────────────────────────────────────────
function init() {
  i18n.init()
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
    clickRift,
    prestige,
    buyPrestigeNode,
    sendExpedition,
    assignGuardian,
    gachaPull,
    reset,
    manualSave,
    getState:        () => state,
    getPortalCost:   portalCost,
    getPortalCostN:  portalCostN,
    getPortalMax:    portalMaxBuyable,
  })

  UI.build()
  UI.renderAll(state)
  Tutorial.render(state)
  UI.renderMissions(state)
  UI.renderNextObjective(state)
  UI.renderLorePanel(state)
  UI.renderPrestige(state)
  UI.renderViajeros(state)

  RiftSystem.scheduleFirst(state)

  if (!state.lore.introSeen) {
    setTimeout(() => UI.showIntroModal(() => { state.lore.introSeen = true }), 400)
  }

  SaveManager.setupAutoSave(() => state)

  _lastTick = performance.now()
  requestAnimationFrame(loop)
}

window.addEventListener('load', init)
