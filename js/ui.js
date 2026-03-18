// ── UI ────────────────────────────────────────────────────────────────────────
//    Stage 3: buy mode selector (×1/×10/×MAX), ability panel, click upgrades

import { PORTAL_DATA }   from './data/portals.js'
import { UPGRADE_DATA }  from './data/upgrades.js'
import { ABILITY_DATA }  from './data/abilities.js'
import { Production }    from './core/production.js'
import { Abilities }     from './systems/abilities.js'
import { fmt, fmtTime }  from './utils/format.js'
import { t, i18n }       from './utils/i18n.js'
import { MissionSystem } from './systems/missions.js'
import { HISTORY_MISSIONS, DAILY_MISSIONS, WEEKLY_MISSION } from './data/missions.js'
import { LoreSystem }      from './systems/lore.js'
import { RiftSystem }      from './systems/rifts.js'
import { PORTAL_FRAGMENTS } from './data/lore.js'
import { PrestigeSystem }  from './systems/prestige.js'
import { PRESTIGE_NODES }  from './data/prestige.js'
import { ViajerosSystem }  from './systems/viajeros.js'
import { VIAJERO_DATA, ARTIFACT_DATA, GACHA_COST_SINGLE, GACHA_COST_TEN } from './data/viajeros.js'
import { BondSystem }     from './systems/bonds.js'
import { QuestSystem }    from './systems/quests.js'
import { BOND_DATA, FUSION_TABLE } from './data/bonds.js'
import { ComboSystem }   from './systems/combos.js'
import { PASSIVE_COMBOS, CONSUMABLE_COMBOS } from './data/combos.js'

// Callbacks inyectados desde game.js via UI.init()
let _actions = {}

// Buy mode: 1, 10, o 'max'
let _buyMode = 1

// Exportada para que game.js pueda formatear en notificaciones
export function fmtPublic(d) { return fmt(d) }

export const UI = {

  // ── Init ──────────────────────────────────────────────────────────────────
  init(actions) {
    _actions = actions
  },

  // ── Build DOM ─────────────────────────────────────────────────────────────
  build() {
    this._buildBuyMode()
    this._buildPortals()
    this._buildUpgrades()
    this._buildAbilities()
    this._buildMissions()
    this._bindButtons()
    this._bindRiftButton()
    this._bindViajerotabs()
  },

  _bindButtons() {
    document.getElementById('btn-nexo').addEventListener('click', e => {
      const power = _actions.click()
      this._spawnParticle(e, power)
      this.renderResources(_actions.getState(), Abilities.getProductionMultiplier(_actions.getState()))
    })
    document.getElementById('btn-save').addEventListener('click', () => {
      _actions.manualSave()
      this.showNotification(t('notif.saved'), 'success')
    })
    document.getElementById('btn-reset').addEventListener('click', () => _actions.reset())

    const btnLang = document.getElementById('btn-lang')
    if (btnLang) {
      btnLang.addEventListener('click', () => {
        const next = i18n.getLocale() === 'es' ? 'en' : 'es'
        i18n.setLocale(next)
        this._buildBuyMode()
        this._buildPortals()
        this._buildUpgrades()
        this._buildAbilities()
        this.renderAll(_actions.getState())
        this.renderViajeros(_actions.getState())
        this.renderCombos(_actions.getState())
      })
    }
    document.getElementById('offline-modal-close').addEventListener('click', () => {
      document.getElementById('offline-modal').style.display = 'none'
    })
  },

  _bindRiftButton() {
    const btn = document.getElementById('btn-rift')
    if (btn) btn.addEventListener('click', () => _actions.clickRift())
  },

  _bindViajerotabs() {
    const tabBar = document.getElementById('viajero-tabs')
    if (!tabBar) return
    tabBar.querySelectorAll('.viajero-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        const section = document.getElementById('section-viajeros')
        if (section) section.dataset.tab = btn.dataset.tab
        this.renderViajeros(_actions.getState())
      })
    })
  },

  // ── Intro modal ───────────────────────────────────────────────────────────
  showIntroModal(onClose) {
    const modal = document.getElementById('intro-modal')
    const body  = document.getElementById('intro-modal-body')
    const btn   = document.getElementById('intro-modal-begin')
    if (!modal || !btn) return

    const keys = ['modal.intro.p1', 'modal.intro.p2', 'modal.intro.p3']
    body.innerHTML = keys.map(k => `<p>${t(k)}</p>`).join('')
    modal.style.display = 'flex'

    btn.onclick = () => {
      modal.style.display = 'none'
      onClose()
    }
  },

  _buildBuyMode() {
    const container = document.getElementById('buy-mode-selector')
    if (!container) return
    container.innerHTML = ''
    const modes = [
      { value: 1,     label: '×1'   },
      { value: 10,    label: '×10'  },
      { value: 'max', label: '×MAX' },
    ]
    modes.forEach(m => {
      const btn = document.createElement('button')
      btn.className  = `btn-buy-mode${_buyMode === m.value ? ' active' : ''}`
      btn.textContent = m.label
      btn.dataset.mode = m.value
      btn.addEventListener('click', () => {
        _buyMode = m.value === 'max' ? 'max' : Number(m.value)
        container.querySelectorAll('.btn-buy-mode').forEach(b =>
          b.classList.toggle('active', b.dataset.mode === String(_buyMode))
        )
        this.renderAffordability(_actions.getState())
      })
      container.appendChild(btn)
    })
  },

  _buildPortals() {
    const list = document.getElementById('portals-list')
    list.innerHTML = ''
    PORTAL_DATA.forEach(p => {
      const card = document.createElement('div')
      card.className = 'portal-card cant-afford'
      card.id        = `portal-${p.id}`
      card.style.setProperty('--portal-color', p.color)
      card.style.display = 'none'
      card.innerHTML = `
        <div class="portal-icon">${p.icon}</div>
        <div class="portal-info">
          <div class="portal-name">${t('portal.' + p.id + '.name')}</div>
          <div class="portal-desc">${t('portal.' + p.id + '.desc')}</div>
          <div class="portal-prod" id="pprod-${p.id}">0/s</div>
        </div>
        <div class="portal-right">
          <div class="portal-count" id="pcnt-${p.id}">0</div>
          <div class="portal-cost"  id="pcost-${p.id}">—</div>
        </div>
      `
      card.addEventListener('click', () => {
        const state = _actions.getState()
        if (_buyMode === 'max') {
          _actions.buyPortalMax(p.id)
        } else {
          _actions.buyPortalN(p.id, _buyMode)
        }
        this.renderPortalCard(p.id, state)
      })
      list.appendChild(card)
    })
  },

  _buildUpgrades() {
    const list = document.getElementById('upgrades-list')
    list.innerHTML = ''
    UPGRADE_DATA.forEach(u => {
      const portal = PORTAL_DATA.find(p => p.id === u.portalId)
      const icon   = portal ? portal.icon : '🖱️'
      const card   = document.createElement('div')
      card.className = 'upgrade-card cant-afford'
      card.id        = `upgrade-${u.id}`
      card.style.display = 'none'
      const upgDesc = u.portalId === 'click'
        ? (u.prodMinutes
            ? t('upgrade.click_prod', { min: u.prodMinutes })
            : t('upgrade.click_power', { mult: u.multiplier }))
        : u.portalId === 'global'
          ? t('upgrade.global_all', { mult: u.multiplier })
          : t('upgrade.portal_mult', { portal: t('portal.' + u.portalId + '.name'), mult: u.multiplier })
      const reqText = (u.portalId === 'click' || u.portalId === 'global')
        ? upgDesc
        : upgDesc + ' · ' + (u.requires > 1
            ? t('upgrade.requires_pl', { n: u.requires })
            : t('upgrade.requires', { n: u.requires }))
      card.innerHTML = `
        <div class="upgrade-icon">${icon}</div>
        <div class="upgrade-info">
          <div class="upgrade-name">${t('upgrade.' + u.id + '.name')}</div>
          <div class="upgrade-req">${reqText}</div>
        </div>
        <div class="upgrade-cost">${fmt(new Decimal(u.cost))}</div>
      `
      card.addEventListener('click', () => _actions.buyUpgrade(u.id))
      list.appendChild(card)
    })
  },

  _buildAbilities() {
    const list = document.getElementById('abilities-list')
    if (!list) return
    list.innerHTML = ''
    ABILITY_DATA.forEach(ab => {
      const card = document.createElement('div')
      card.className = 'ability-card locked'
      card.id        = `ability-${ab.id}`
      card.innerHTML = `
        <div class="ability-icon">${ab.icon}</div>
        <div class="ability-info">
          <div class="ability-name-row">
            <span class="ability-name">${t('ability.' + ab.id + '.name')}</span>
            <span class="ability-level" id="ablv-${ab.id}">${t('ability.level', { n: 1 })}</span>
          </div>
          <div class="ability-desc" id="abdesc-${ab.id}">${t('ability.' + ab.id + '.desc')}</div>
          <div class="ability-exp-bar-wrap" id="abexp-wrap-${ab.id}">
            <div class="ability-exp-bar" id="abexp-${ab.id}" style="width:0%"></div>
          </div>
          <div class="ability-unlock-hint" id="abhint-${ab.id}">${t('ability.' + ab.id + '.unlock')}</div>
        </div>
        <div class="ability-right">
          <div class="ability-status" id="abst-${ab.id}">🔒</div>
          <div class="ability-daily" id="abday-${ab.id}"></div>
        </div>
      `
      card.addEventListener('click', () => _actions.activateAbility(ab.id))
      list.appendChild(card)
    })
  },

  _buildMissions() {
    // El contenido se renderiza dinámicamente en renderMissions()
    // Solo limpiamos el contenedor si existe
    const list = document.getElementById('missions-list')
    if (list) list.innerHTML = ''
  },

  // ── Renders ───────────────────────────────────────────────────────────────
  renderAll(state) {
    this.renderResources(state, Abilities.getProductionMultiplier(state))
    PORTAL_DATA.forEach(p => this.renderPortalCard(p.id, state))
    this.renderUpgradesSection(state)
    this.renderAffordability(state)
    this.renderAbilities(state)
    this.renderMissions(state)
    this.renderNextObjective(state)
    this.renderLorePanel(state)
    this.renderRift(state)
    this.renderPrestige(state)
    this.renderViajeros(state)
    this.renderCombos(state)
    this.renderCrystals(state)
  },

  renderResources(state, abilityMult = 1) {
    const baseProd   = Production.total(state)
    const effectProd = baseProd.mul(abilityMult)
    document.getElementById('res-energy').textContent        = fmt(state.energy)
    document.getElementById('res-production').textContent    = fmt(effectProd) + '/s'
    document.getElementById('stat-total-prod').textContent   = fmt(effectProd) + '/s'
    document.getElementById('stat-total-earned').textContent = fmt(state.totalEnergyEarned)
    document.getElementById('click-power').textContent       = fmt(Production.clickPower(state, baseProd))
    document.getElementById('stat-offline-cap').textContent  = fmtTime(PrestigeSystem.getOfflineCapHours(state) * 3600)
    document.getElementById('stat-offline-eff').textContent  = Math.round(state.offlineEfficiency * 100) + '%'
    this.renderCrystals(state)
  },

  renderCrystals(state) {
    const el    = document.getElementById('res-crystals')
    const block = document.getElementById('crystals-block')
    if (el) el.textContent = (state.crystals || 0)
    if (block) {
      const show = (state.crystals || 0) > 0 || Object.keys(state.viajeros?.roster || {}).length > 0
      block.style.display = show ? 'flex' : 'none'
    }
  },

  renderPortalCard(portalId, state) {
    const card = document.getElementById(`portal-${portalId}`)
    if (!card) return
    const key = 'portal' + portalId[0].toUpperCase() + portalId.slice(1)
    if (!state.unlocks[key]) { card.style.display = 'none'; return }
    card.style.display = 'flex'

    const count = state.portals[portalId] || 0
    const cost  = this._currentModeCost(portalId, state)
    const prod  = Production.ofPortal(state, portalId)

    document.getElementById(`pcnt-${portalId}`).textContent  = count
    document.getElementById(`pcost-${portalId}`).textContent = this._modeLabel(portalId, state, cost)
    document.getElementById(`pprod-${portalId}`).textContent = count > 0 ? fmt(prod) + '/s' : '0/s'
    card.classList.toggle('cant-afford', state.energy.lt(cost))
  },

  renderUpgradesSection(state) {
    const section = document.getElementById('section-upgrades')
    if (state.unlocks.panelUpgrades) {
      section.style.display = 'block'
      setTimeout(() => {
        const badge = document.getElementById('upgrades-badge')
        if (badge) badge.style.display = 'none'
      }, 5000)
    }
    UPGRADE_DATA.forEach(u => this.renderUpgradeCard(u.id, state))
  },

  renderUpgradeCard(upgradeId, state) {
    const card = document.getElementById(`upgrade-${upgradeId}`)
    if (!card) return
    const upg      = UPGRADE_DATA.find(u => u.id === upgradeId)
    const purchased = !!state.upgrades[upgradeId]

    // Ascended upgrades only visible when their prestige node is owned
    if (upg.ascended) {
      const nodeOwned = !!(state.prestige?.tree?.[upg.prestigeNode])
      card.style.display = nodeOwned ? 'flex' : 'none'
      if (nodeOwned) {
        card.classList.toggle('purchased',   purchased)
        card.classList.toggle('cant-afford', !purchased && !state.energy.gte(upg.cost))
      }
      return
    }

    const visible = upg.portalId === 'click'
      ? state.unlocks.panelUpgrades
      : upg.portalId === 'global'
        ? (state.totalEnergyEarned.gte(upg.requiresEnergy || 0) || purchased)
        : ((state.portals[upg.portalId] || 0) >= upg.requires || purchased)

    card.style.display = visible ? 'flex' : 'none'
    card.classList.toggle('purchased',   purchased)
    card.classList.toggle('cant-afford', !purchased && !state.energy.gte(upg.cost))
  },

  renderAffordability(state) {
    PORTAL_DATA.forEach(p => {
      const card = document.getElementById(`portal-${p.id}`)
      if (!card || card.style.display === 'none') return
      const cost = this._currentModeCost(p.id, state)
      card.classList.toggle('cant-afford', state.energy.lt(cost))
      document.getElementById(`pcost-${p.id}`).textContent = this._modeLabel(p.id, state, cost)
    })
    UPGRADE_DATA.forEach(u => {
      const card = document.getElementById(`upgrade-${u.id}`)
      if (!card || card.style.display === 'none' || state.upgrades[u.id]) return
      const hasPortals = u.portalId === 'click'
        || u.portalId === 'global'
        || (state.portals[u.portalId] || 0) >= u.requires
      card.classList.toggle('cant-afford', !hasPortals || !state.energy.gte(u.cost))
    })
  },

  renderAbilities(state) {
    ABILITY_DATA.forEach(ab => {
      const card    = document.getElementById(`ability-${ab.id}`)
      const stat    = document.getElementById(`abst-${ab.id}`)
      const dayEl   = document.getElementById(`abday-${ab.id}`)
      const lvEl    = document.getElementById(`ablv-${ab.id}`)
      const expBar  = document.getElementById(`abexp-${ab.id}`)
      const hint    = document.getElementById(`abhint-${ab.id}`)
      if (!card || !stat) return

      const ast      = state.abilities[ab.id]
      const unlocked = Abilities.isUnlocked(state, ab.id)

      // ── Estado locked ──────────────────────────────────────────────────────
      if (!unlocked) {
        card.classList.add('locked')
        card.classList.remove('on-cooldown', 'is-active', 'daily-limit')
        stat.textContent = t('ability.status.locked')
        if (dayEl)  dayEl.textContent  = ''
        if (hint)   hint.style.display = 'block'
        if (lvEl)   lvEl.style.display = 'none'
        if (expBar) expBar.style.width = '0%'
        return
      }

      // ── Desbloqueada ───────────────────────────────────────────────────────
      card.classList.remove('locked')
      if (hint) hint.style.display = 'none'
      if (lvEl) { lvEl.textContent = t('ability.level', { n: ast.level }); lvEl.style.display = 'inline' }

      // EXP bar (oculta si es L5)
      if (expBar) {
        const wrap = document.getElementById(`abexp-wrap-${ab.id}`)
        if (ast.level >= 5) {
          if (wrap) wrap.style.display = 'none'
        } else {
          if (wrap) wrap.style.display = 'block'
          expBar.style.width = Math.round(Abilities.expProgress(ast) * 100) + '%'
        }
      }

      // Usos restantes hoy
      if (dayEl) {
        const rem = Abilities.usesRemainingToday(state, ab.id)
        dayEl.textContent = rem > 0
          ? t('ability.daily.uses', { n: rem, max: ab.dailyFree })
          : t('ability.daily.limit')
        dayEl.className   = `ability-daily${rem === 0 ? ' limit-reached' : ''}`
      }

      // Estado: cooldown, activa, o lista
      const dailyLimit = Abilities.isDailyLimitReached(state, ab.id)
      if (Abilities.isActive(state, ab.id)) {
        const secs = Math.ceil(Abilities.activeRemaining(state, ab.id))
        stat.textContent = fmtTime(secs)
        card.classList.add('is-active')
        card.classList.remove('on-cooldown', 'daily-limit')
      } else if (Abilities.isOnCooldown(state, ab.id)) {
        const secs = Math.ceil(Abilities.cooldownRemaining(state, ab.id))
        stat.textContent = fmtTime(secs)
        card.classList.add('on-cooldown')
        card.classList.remove('is-active', 'daily-limit')
      } else if (dailyLimit) {
        stat.textContent = t('ability.status.tomorrow')
        card.classList.add('daily-limit')
        card.classList.remove('on-cooldown', 'is-active')
      } else {
        stat.textContent = t('ability.status.ready')
        card.classList.remove('on-cooldown', 'is-active', 'daily-limit')
      }
    })
  },

  // ── Desbloqueo de habilidad ───────────────────────────────────────────────
  applyAbilityUnlock(abilityId, state) {
    const ab = ABILITY_DATA.find(a => a.id === abilityId)
    if (!ab) return
    this.renderAbilities(state)
    this.showNotification(t('notif.ability_unlocked', { icon: ab.icon, name: t('ability.' + abilityId + '.name') }), 'unlock')
  },

  // ── Desbloqueos ───────────────────────────────────────────────────────────
  applyUnlock(unlock, state) {
    if (unlock.type === 'portal') {
      this.renderPortalCard(unlock.portal.id, state)
      const card = document.getElementById(`portal-${unlock.portal.id}`)
      if (card) {
        card.classList.add('just-unlocked')
        card.addEventListener('animationend', () => card.classList.remove('just-unlocked'), { once: true })
      }
      this.showNotification(t('notif.portal_unlocked', { name: t('portal.' + unlock.portal.id + '.name') }), 'unlock')
    } else if (unlock.type === 'panel') {
      this.renderUpgradesSection(state)
      this.showNotification(t('notif.panel_unlocked', { name: t('ui.section.' + (unlock.panelKey || 'upgrades')) }), 'unlock')
    }
  },

  // ── Helpers de buy mode ───────────────────────────────────────────────────
  _currentModeCost(portalId, state) {
    if (_buyMode === 'max') {
      const n = _actions.getPortalMax(portalId)
      return n === 0 ? _actions.getPortalCost(portalId) : _actions.getPortalCostN(portalId, n)
    }
    return _actions.getPortalCostN(portalId, _buyMode)
  },

  _modeLabel(portalId, state, cost) {
    if (_buyMode === 'max') {
      const n = _actions.getPortalMax(portalId)
      return n === 0 ? fmt(cost) : `×${n} · ${fmt(cost)}`
    }
    return fmt(cost)
  },

  // ── Modal offline ─────────────────────────────────────────────────────────
  showOfflineModal(off, offlineCap) {
    const modal = document.getElementById('offline-modal')
    const body  = document.getElementById('offline-modal-body')
    const eff   = Math.round(off.efficiency * 100)
    const cap   = fmtTime(offlineCap)

    let html = t('modal.offline.absent', { time: fmtTime(off.secondsAway) })
    if (off.wasCapped) {
      html += `<br><small>${t('modal.offline.capped', { cap })}</small>`
    }
    html += `<br>${t('modal.offline.efficiency', { pct: eff })}`
    html += `<span class="earned">${t('modal.offline.earned', { energy: fmt(off.earned) })}</span>`

    body.innerHTML = html
    modal.style.display = 'flex'
  },

  // ── Modal confirmación ────────────────────────────────────────────────────
  showConfirm(message) {
    return new Promise(resolve => {
      const modal = document.getElementById('confirm-modal')
      document.getElementById('confirm-modal-message').textContent = message
      modal.style.display = 'flex'

      function handleOk()     { cleanup(true)  }
      function handleCancel() { cleanup(false) }

      function cleanup(result) {
        modal.style.display = 'none'
        document.getElementById('confirm-modal-ok')
          .removeEventListener('click', handleOk)
        document.getElementById('confirm-modal-cancel')
          .removeEventListener('click', handleCancel)
        resolve(result)
      }

      document.getElementById('confirm-modal-ok').addEventListener('click', handleOk)
      document.getElementById('confirm-modal-cancel').addEventListener('click', handleCancel)
    })
  },

  // ── Notificaciones ────────────────────────────────────────────────────────
  showNotification(msg, type = 'info') {
    const container = document.getElementById('notifications')
    const el        = document.createElement('div')
    el.className    = `notification ${type}`
    el.textContent  = msg
    container.appendChild(el)
    setTimeout(() => {
      el.style.opacity    = '0'
      el.style.transition = 'opacity 0.4s'
      setTimeout(() => el.remove(), 400)
    }, 3200)
  },

  // ── Misiones ──────────────────────────────────────────────────────────────
  renderMissions(state) {
    const list = document.getElementById('missions-list')
    if (!list) return
    list.innerHTML = ''

    // ── Historia ──────────────────────────────────────────────────────────
    const storyCount = MissionSystem.historyCount(state)
    const storyHeader = document.createElement('div')
    storyHeader.className = 'mission-group-header'
    storyHeader.textContent = `${t('ui.missions.story')} ${storyCount.done}/${storyCount.total}`
    list.appendChild(storyHeader)

    HISTORY_MISSIONS.forEach(m => {
      const done = !!state.missions.history[m.id]
      const prog = done ? { current: 1, target: 1 } : MissionSystem.getProgress(state, m)
      list.appendChild(this._missionCard(m.id, done, prog))
    })

    // ── Diarias ───────────────────────────────────────────────────────────
    const dailyCount  = MissionSystem.dailyCount(state)
    const dailyMs     = MissionSystem.dailyTimeRemaining()
    const streak      = MissionSystem.getStreak(state)
    const streakText  = streak > 0 ? ` · ${t('ui.missions.streak', { days: streak })}` : ''
    const dailyHeader = document.createElement('div')
    dailyHeader.className = 'mission-group-header'
    dailyHeader.textContent = `${t('ui.missions.daily')} ${dailyCount.done}/${dailyCount.total} · ${t('ui.missions.resets_in', { time: fmtTime(Math.floor(dailyMs / 1000)) })}${streakText}`
    list.appendChild(dailyHeader)

    DAILY_MISSIONS.forEach(m => {
      const done = !!state.missions.daily.completed[m.id]
      const prog = done ? { current: 1, target: 1 } : MissionSystem.getProgress(state, m)
      list.appendChild(this._missionCard(m.id, done, prog))
    })

    // ── Semanal ───────────────────────────────────────────────────────────
    const weeklyMs   = MissionSystem.weeklyTimeRemaining()
    const weeklyDone = MissionSystem.weeklyDone(state)
    const weeklyHeader = document.createElement('div')
    weeklyHeader.className = 'mission-group-header'
    weeklyHeader.textContent = `${t('ui.missions.weekly')} · ${t('ui.missions.resets_in', { time: fmtTime(Math.floor(weeklyMs / 1000)) })}`
    list.appendChild(weeklyHeader)

    const wProg = weeklyDone ? { current: 1, target: 1 } : MissionSystem.getProgress(state, WEEKLY_MISSION)
    list.appendChild(this._missionCard(WEEKLY_MISSION.id, weeklyDone, wProg))
  },

  _missionCard(id, done, prog) {
    const card = document.createElement('div')
    card.className = `mission-card${done ? ' done' : ''}`
    const pct = prog.target > 0 ? Math.min(100, Math.round((prog.current / prog.target) * 100)) : 0
    card.innerHTML = `
      <div class="mission-body">
        <div class="mission-title">${t('mission.' + id + '.title')}</div>
        <div class="mission-desc">${t('mission.' + id + '.desc')}</div>
        ${!done ? `
          <div class="mission-bar-wrap">
            <div class="mission-bar" style="width:${pct}%"></div>
          </div>
        ` : ''}
      </div>
    `
    return card
  },

  // ── Próximo objetivo ──────────────────────────────────────────────────────
  renderNextObjective(state) {
    const el = document.getElementById('next-objective')
    if (!el) return
    const next = MissionSystem.getNextHistory(state)
    if (!next) { el.style.display = 'none'; return }
    const prog = MissionSystem.getProgress(state, next)
    const pct  = prog.target > 0 ? Math.min(100, Math.round((prog.current / prog.target) * 100)) : 0
    el.style.display = 'block'
    el.innerHTML = `
      <span class="next-obj-label">${t('ui.missions.next_obj')}</span>
      <span class="next-obj-title">${t('mission.' + next.id + '.title')}: ${t('mission.' + next.id + '.desc')}</span>
      <div class="next-obj-bar-wrap"><div class="next-obj-bar" style="width:${pct}%"></div></div>
    `
  },

  // ── Prestige panel ───────────────────────────────────────────────────────
  renderPrestige(state) {
    const section = document.getElementById('section-prestige')
    if (!section) return

    const check    = PrestigeSystem.canPrestige(state)
    const liveFrags = check.type === 'early'
      ? Math.round(PrestigeSystem.calcFragments(state) * 0.4)
      : PrestigeSystem.calcFragments(state)
    const runCount = state.prestige?.runCount || 0
    const frags    = state.prestige?.fragments || 0
    const total    = state.prestige?.totalEarned || 0

    // Show section once any prestige portal condition is approaching (all 8 portals unlocked)
    const anyUnlocked = ['ignea','abismal','temporal','vacio','celestial','caos','primordial','singular']
      .every(id => state.unlocks['portal' + id[0].toUpperCase() + id.slice(1)])
    if (!anyUnlocked && runCount === 0) { section.style.display = 'none'; return }
    section.style.display = 'block'

    const info = document.getElementById('prestige-info')
    const tree = document.getElementById('prestige-tree')
    if (!info || !tree) return

    // ── Info bar ─────────────────────────────────────────────────────────
    info.innerHTML = `
      <div class="prestige-stats">
        <span class="prestige-frags">${t('ui.prestige.fragments', { n: frags })}</span>
        <span class="prestige-total">${t('ui.prestige.total_earned', { n: total })}</span>
        ${runCount > 0 ? `<span class="prestige-runs">${t('ui.prestige.run_count', { n: runCount })}</span>` : ''}
      </div>
      <div class="prestige-live">
        ${check.can
          ? `<span class="prestige-live-frags">${t(check.type === 'early' ? 'ui.prestige.live_frags_early' : 'ui.prestige.live_frags', { n: liveFrags })}</span>`
          : `<span class="prestige-locked-hint">${check.fragments > 0 ? t('ui.prestige.live_frags', { n: check.fragments }) + ' (not yet)' : ''}</span>`
        }
      </div>
      ${check.can ? `<button class="btn-ascend" id="btn-ascend">${t('ui.prestige.ascend_btn')}</button>` : ''}
      ${!check.can && runCount === 0 ? `<div class="prestige-req">${t(state.unlocks.portalSingular ? 'ui.prestige.locked_full' : 'ui.prestige.locked_early')}</div>` : ''}
    `

    if (check.can) {
      document.getElementById('btn-ascend')?.addEventListener('click', () => _actions.prestige())
    }

    // ── Tree ─────────────────────────────────────────────────────────────
    const branches = ['A', 'B', 'C', 'D']
    const branchKeys = { A: 'ui.prestige.branch_a', B: 'ui.prestige.branch_b', C: 'ui.prestige.branch_c', D: 'ui.prestige.branch_d' }
    tree.innerHTML = `<div class="prestige-tree-title">${t('ui.prestige.tree_title')}</div>`
    branches.forEach(branch => {
      const nodes = PRESTIGE_NODES.filter(n => n.branch === branch)
      const branchEl = document.createElement('div')
      branchEl.className = 'prestige-branch prestige-branch-' + branch.toLowerCase()
      branchEl.innerHTML = `<div class="branch-label branch-${branch.toLowerCase()}">${t(branchKeys[branch])}</div>`
      nodes.forEach(node => {
        const status = node.auto
          ? (state.prestige?.storyUnlocked?.includes(node.effect.chapter) ? 'owned' : 'locked')
          : PrestigeSystem.getNodeStatus(state, node.id)
        const nodeEl = document.createElement('div')
        nodeEl.className = `prestige-node status-${status}`
        const costStr = node.auto ? '' : t('ui.prestige.cost', { n: node.cost })
        const statusStr = status === 'owned' ? (node.auto ? t('ui.prestige.auto') : t('ui.prestige.owned'))
          : status === 'locked' ? (node.tier === 2 && (state.prestige?.runCount || 0) < 1 ? t('ui.prestige.tier2_locked') : '🔒')
          : status === 'insufficient' ? costStr
          : `<button class="btn-buy-node" data-node="${node.id}">${costStr}</button>`
        nodeEl.innerHTML = `
          <div class="node-name">${t('prestige.node.' + node.id + '.name')}</div>
          <div class="node-desc">${t('prestige.node.' + node.id + '.desc')}</div>
          <div class="node-status">${statusStr}</div>
        `
        branchEl.appendChild(nodeEl)
      })
      tree.appendChild(branchEl)
    })

    // Wire buy buttons
    tree.querySelectorAll('.btn-buy-node').forEach(btn => {
      btn.addEventListener('click', () => _actions.buyPrestigeNode(btn.dataset.node))
    })
  },

  showPrestigeModal(state, onConfirm) {
    const check  = PrestigeSystem.canPrestige(state)
    if (!check.can) return

    const frags  = check.fragments
    const earned = `+${frags} ${t('ui.prestige.fragments', { n: frags }).replace(/^\💎\s*/, '')}`

    const msg = document.createElement('div')
    msg.className = 'prestige-modal-body'
    msg.innerHTML = `
      <div class="pm-title">${t('modal.prestige.title')}</div>
      <div class="pm-section">${t('modal.prestige.run_summary')}</div>
      <div class="pm-frags">${t('modal.prestige.frags_earn', { n: frags })}</div>
      ${check.type === 'early' ? `<div class="pm-note">${t('modal.prestige.early_note')}</div>` : ''}
      <hr class="pm-divider">
      <div class="pm-row pm-reset">⚠ ${t('modal.prestige.resets')}</div>
      <div class="pm-row pm-persist">✓ ${t('modal.prestige.persists')}</div>
    `

    const modal   = document.getElementById('confirm-modal')
    const msgEl   = document.getElementById('confirm-modal-message')
    const btnOk   = document.getElementById('confirm-modal-ok')
    const btnCancel = document.getElementById('confirm-modal-cancel')
    if (!modal || !msgEl) return

    msgEl.innerHTML = ''
    msgEl.appendChild(msg)
    btnOk.textContent     = t('modal.prestige.confirm')
    btnCancel.textContent = t('modal.prestige.cancel')
    modal.style.display   = 'flex'

    const cleanup = () => {
      modal.style.display = 'none'
      btnOk.textContent     = t('modal.confirm.ok')
      btnCancel.textContent = t('modal.confirm.cancel')
      btnOk.onclick     = null
      btnCancel.onclick = null
    }
    btnOk.onclick     = () => { cleanup(); onConfirm() }
    btnCancel.onclick = () => cleanup()
  },

  // ── Lore panel ───────────────────────────────────────────────────────────
  renderLorePanel(state) {
    const section = document.getElementById('section-lore')
    const list    = document.getElementById('lore-list')
    if (!section || !list) return
    const fragments = LoreSystem.getUnlockedFragments(state)
    if (fragments.length === 0) { section.style.display = 'none'; return }
    section.style.display = 'block'
    list.innerHTML = ''
    fragments.forEach(f => {
      const portal = PORTAL_DATA.find(p => p.id === f.portalId)
      const card = document.createElement('div')
      card.className = 'lore-card'
      card.style.borderLeftColor = portal?.color || 'var(--accent)'
      card.innerHTML = `
        <span class="lore-icon">${portal?.icon || '🌀'}</span>
        <div class="lore-body">
          <div class="lore-portal" style="color:${portal?.color || 'var(--accent)'}">${t('portal.' + f.portalId + '.name')}</div>
          <div class="lore-text">${t('lore.' + f.id + '.text')}</div>
        </div>
      `
      list.appendChild(card)
    })
  },

  // ── Dimensional Rift ──────────────────────────────────────────────────────
  renderRift(state) {
    const container = document.getElementById('rift-container')
    const timer     = document.getElementById('rift-timer')
    if (!container) return
    if (state.rifts.active) {
      container.style.display = 'block'
      if (timer) timer.textContent = t('ui.rift.timer', { secs: RiftSystem.timeRemaining(state) })
    } else {
      container.style.display = 'none'
    }
  },

  // ── Viajeros panel ────────────────────────────────────────────────────────
  renderViajeros(state) {
    const section = document.getElementById('section-viajeros')
    if (!section) return

    const owned = ViajerosSystem.getOwnedList(state)
    if (owned.length === 0) { section.style.display = 'none'; return }
    section.style.display = 'block'

    // Show Viajero mini-tutorial on first arrival
    if (!state.viajeros.tutorialSeen && owned.length > 0) {
      state.viajeros.tutorialSeen = true
      setTimeout(() => this._showViajerotutorial(), 300)
    }

    const activeTab = section.dataset.tab || 'guardians'
    section.dataset.tab = activeTab

    const tabBar = document.getElementById('viajero-tabs')
    if (tabBar) {
      tabBar.querySelectorAll('.viajero-tab').forEach(b => {
        b.classList.toggle('active', b.dataset.tab === activeTab)
      })
    }

    const allPanels = ['guardians', 'expeditions', 'gacha', 'bonds', 'council', 'quests']
    allPanels.forEach(tab => {
      document.getElementById(`viajero-panel-${tab}`)?.style.setProperty('display', activeTab === tab ? 'block' : 'none')
    })

    if (activeTab === 'guardians')    this._renderGuardiansTab(state, owned)
    if (activeTab === 'expeditions')  this._renderExpeditionsTab(state, owned)
    if (activeTab === 'gacha')        this._renderGachaTab(state, owned)
    if (activeTab === 'bonds')        this._renderBondsTab(state, owned)
    if (activeTab === 'council')      this._renderCouncilTab(state, owned)
    if (activeTab === 'quests')       this._renderQuestsTab(state, owned)
  },

  _showViajerotutorial() {
    const el = document.getElementById('viajero-tutorial-modal')
    if (!el) return
    el.style.display = 'flex'
    document.getElementById('viajero-tutorial-close')?.addEventListener('click', () => {
      el.style.display = 'none'
    }, { once: true })
  },

  _renderGuardiansTab(state, owned) {
    const container = document.getElementById('viajero-guardians-list')
    if (!container) return
    container.innerHTML = ''

    PORTAL_DATA.forEach(p => {
      if (!(state.portals[p.id] > 0) && !state.unlocks['portal' + p.id[0].toUpperCase() + p.id.slice(1)]) return
      const assignedId = state.viajeros.assignments[p.id] || null
      const assignedDef = assignedId ? VIAJERO_DATA.find(v => v.id === assignedId) : null

      const slot = document.createElement('div')
      slot.className = 'guardian-slot'
      slot.innerHTML = `
        <div class="guardian-portal-label" style="color:${p.color}">
          ${p.icon} ${t('portal.' + p.id + '.name')}
        </div>
        <div class="guardian-assigned">
          ${assignedDef
            ? `<div class="viajero-mini rarity-${assignedDef.rarity}">
                 <span class="vj-icon">${assignedDef.icon}</span>
                 <span class="vj-name">${t('viajero.' + assignedDef.id + '.name')}</span>
                 <button class="btn-vj-unassign" data-portal="${p.id}">${t('ui.viajero.unassign')}</button>
               </div>`
            : `<div class="guardian-empty">${t('ui.viajero.empty_slot')}</div>`
          }
        </div>
      `
      container.appendChild(slot)
    })

    // Unassigned guardians available to assign
    const available = owned.filter(o =>
      (o.def.role === 'guardian' || o.def.role === 'special' || o.def.role === 'council') &&
      !ViajerosSystem.isOnExpedition(state, o.id) &&
      !ViajerosSystem.getAssignment(state, o.id)
    )
    if (available.length > 0) {
      const header = document.createElement('div')
      header.className = 'viajero-section-header'
      header.textContent = t('ui.viajero.available_guardians')
      container.appendChild(header)

      available.forEach(o => {
        const card = this._viajeroCard(o, state, 'assign')
        container.appendChild(card)
      })
    }

    container.querySelectorAll('.btn-vj-unassign').forEach(btn => {
      btn.addEventListener('click', () => {
        const vid = state.viajeros.assignments[btn.dataset.portal]
        if (vid) {
          ViajerosSystem.unassignGuardian(state, vid)
          this.renderViajeros(state)
        }
      })
    })

    container.querySelectorAll('.btn-vj-assign').forEach(btn => {
      btn.addEventListener('click', () => {
        this._showAssignModal(state, btn.dataset.viajero)
      })
    })
  },

  _renderExpeditionsTab(state, owned) {
    const container = document.getElementById('viajero-expeditions-list')
    if (!container) return
    container.innerHTML = ''

    const activeExps = state.viajeros.expeditions || []

    // Active expeditions
    if (activeExps.length > 0) {
      const header = document.createElement('div')
      header.className = 'viajero-section-header'
      header.textContent = t('ui.viajero.active_expeditions')
      container.appendChild(header)

      activeExps.forEach(exp => {
        const def  = VIAJERO_DATA.find(v => v.id === exp.viajeroid)
        if (!def) return
        const secs = ViajerosSystem.expeditionTimeRemaining(state, exp.viajeroid)
        const card = document.createElement('div')
        card.className = 'expedition-card active'
        card.innerHTML = `
          <span class="vj-icon">${def.icon}</span>
          <div class="exp-info">
            <div class="exp-name">${t('viajero.' + def.id + '.name')}</div>
            <div class="exp-timer">${t('ui.viajero.returns_in', { time: fmtTime(secs) })}</div>
          </div>
        `
        container.appendChild(card)
      })
    }

    // Available explorers
    const maxSlots  = ViajerosSystem.getExpeditionSlotsMax(state)
    const usedSlots = activeExps.length
    const slotsInfo = document.createElement('div')
    slotsInfo.className = 'expedition-slots-info'
    slotsInfo.textContent = t('ui.viajero.slots', { used: usedSlots, max: maxSlots })
    container.appendChild(slotsInfo)

    if (usedSlots < maxSlots) {
      const available = owned.filter(o =>
        !ViajerosSystem.isOnExpedition(state, o.id) &&
        !ViajerosSystem.getAssignment(state, o.id)
      )
      if (available.length > 0) {
        const header2 = document.createElement('div')
        header2.className = 'viajero-section-header'
        header2.textContent = t('ui.viajero.send_expedition')
        container.appendChild(header2)

        available.forEach(o => {
          const card = this._viajeroCard(o, state, 'send')
          container.appendChild(card)
        })
      }
    }

    container.querySelectorAll('.btn-vj-send').forEach(btn => {
      btn.addEventListener('click', () => {
        _actions.sendExpedition(btn.dataset.viajero)
      })
    })
  },

  _renderGachaTab(state, owned) {
    const container = document.getElementById('viajero-gacha-content')
    if (!container) return

    const crystals  = state.crystals || 0
    const pity      = state.viajeros?.gacha?.pityCount || 0
    const history   = (state.viajeros?.gacha?.history || []).slice(0, 10)

    const canPull1  = crystals >= GACHA_COST_SINGLE
    const canPull10 = crystals >= GACHA_COST_TEN
    const histHtml  = history.map(h => {
      const def = VIAJERO_DATA.find(v => v.id === h.id)
      return `<div class="gacha-history-item rarity-${h.rarity}">${def?.icon || '?'} ${t('viajero.' + h.id + '.name')}</div>`
    }).join('')

    container.innerHTML = `
      <div class="gacha-crystals">${t('ui.viajero.crystals', { n: crystals })} 💎</div>
      <div class="gacha-pity">${t('ui.viajero.gacha.pity', { n: pity, max: 80 })}</div>
      <div class="gacha-buttons">
        <button class="btn-gacha-pull" id="btn-pull-1" ${canPull1 ? '' : 'disabled'}>
          ${t('ui.viajero.gacha.pull_1', { cost: GACHA_COST_SINGLE })}
        </button>
        <button class="btn-gacha-pull btn-pull-10" id="btn-pull-10" ${canPull10 ? '' : 'disabled'}>
          ${t('ui.viajero.gacha.pull_10', { cost: GACHA_COST_TEN })}
        </button>
      </div>
      ${!canPull1 ? `<div class="gacha-hint">${t('ui.viajero.gacha.no_crystals')}</div>` : ''}
      ${history.length > 0 ? `<div class="gacha-history-title">${t('ui.viajero.gacha.recent')}</div><div class="gacha-history">${histHtml}</div>` : ''}
    `

    container.querySelector('#btn-pull-1')?.addEventListener('click', () => {
      _actions.gachaPull(1)
    })
    container.querySelector('#btn-pull-10')?.addEventListener('click', () => {
      _actions.gachaPull(10)
    })

    // Fusion section — show Viajeros with 2+ copies (gacha only)
    const fusionCandidates = owned.filter(o => {
      const path = FUSION_TABLE.find(f => f.source === o.id)
      return path && (o.copies || 0) >= 2
    })
    if (fusionCandidates.length > 0) {
      const fusionHeader = document.createElement('div')
      fusionHeader.className = 'viajero-section-header'
      fusionHeader.textContent = t('ui.viajero.fusion.title')
      container.appendChild(fusionHeader)

      fusionCandidates.forEach(o => {
        const path    = FUSION_TABLE.find(f => f.source === o.id)
        const targetDef = VIAJERO_DATA.find(v => v.id === path.target)
        const row = document.createElement('div')
        row.className = 'fusion-row'
        row.innerHTML = `
          <span class="fusion-source rarity-label-${o.def.rarity}">${o.def.icon} ${t('viajero.' + o.id + '.name')}</span>
          <span class="fusion-copies">(×${(o.copies || 0) + 1})</span>
          <span class="fusion-arrow">→</span>
          <span class="fusion-target rarity-label-${targetDef?.rarity || 'common'}">${targetDef?.icon || '?'} ${t('viajero.' + (path.target) + '.name')}</span>
          <button class="btn-fuse btn-vj-action" data-source="${o.id}">${t('ui.viajero.fusion.btn')}</button>
        `
        container.appendChild(row)
      })

      container.querySelectorAll('.btn-fuse').forEach(btn => {
        btn.addEventListener('click', () => _actions.fuseViajero(btn.dataset.source))
      })
    }
  },

  // ── Bond Web tab ───────────────────────────────────────────────────────────
  _renderBondsTab(state, owned) {
    const container = document.getElementById('viajero-panel-bonds')
    if (!container) return
    container.innerHTML = ''

    const ownedIds = new Set(owned.map(o => o.id))

    BOND_DATA.forEach(bond => {
      const [idA, idB] = bond.viajeros
      const defA = VIAJERO_DATA.find(v => v.id === idA)
      const defB = VIAJERO_DATA.find(v => v.id === idB)
      if (!defA || !defB) return

      const hasA    = ownedIds.has(idA)
      const hasB    = ownedIds.has(idB)
      const active  = BondSystem.isBondActive(state, bond.id)
      const resA    = state.viajeros.roster[idA]?.resonance || 0
      const resB    = state.viajeros.roster[idB]?.resonance || 0
      const combined = resA + resB
      const pct     = Math.min(100, Math.round(combined / bond.resonanceRequired * 100))

      const card = document.createElement('div')
      card.className = `bond-card ${active ? 'bond-active' : (hasA && hasB ? 'bond-pending' : 'bond-locked')}`
      card.innerHTML = `
        <div class="bond-viajeros">
          <span class="bond-vj ${hasA ? 'owned' : 'missing'}">${defA.icon} ${t('viajero.' + idA + '.name')}</span>
          <span class="bond-link">🔗</span>
          <span class="bond-vj ${hasB ? 'owned' : 'missing'}">${defB.icon} ${t('viajero.' + idB + '.name')}</span>
        </div>
        <div class="bond-effect">${t('bond.' + bond.id + '.effect')}</div>
        ${hasA && hasB ? `
          <div class="bond-res-track">
            <div class="bond-res-fill" style="width:${pct}%"></div>
          </div>
          <div class="bond-res-label">${t('ui.bond.res_label', { n: combined, req: bond.resonanceRequired })}</div>
        ` : `<div class="bond-hint">${t('ui.bond.need_both')}</div>`}
        <div class="bond-status-badge ${active ? 'status-active' : 'status-locked'}">${active ? t('ui.bond.active') : t('ui.bond.locked')}</div>
      `
      container.appendChild(card)
    })
  },

  // ── Council of the Nexo tab ────────────────────────────────────────────────
  _renderCouncilTab(state, owned) {
    const container = document.getElementById('viajero-panel-council')
    if (!container) return
    container.innerHTML = ''

    const council = state.viajeros?.council || []
    const MAX_SLOTS = 3

    const slotsHeader = document.createElement('div')
    slotsHeader.className = 'viajero-section-header'
    slotsHeader.textContent = t('ui.council.title', { used: council.length, max: MAX_SLOTS })
    container.appendChild(slotsHeader)

    // Current council slots
    for (let i = 0; i < MAX_SLOTS; i++) {
      const slot = document.createElement('div')
      slot.className = 'council-slot'
      const vid = council[i]
      if (vid) {
        const def = VIAJERO_DATA.find(v => v.id === vid)
        slot.innerHTML = `
          <span class="vj-icon">${def?.icon || '?'}</span>
          <span class="council-name rarity-label-legendario">${t('viajero.' + vid + '.name')}</span>
          <button class="btn-council-remove btn-vj-action" data-viajero="${vid}">${t('ui.council.remove')}</button>
        `
      } else {
        slot.innerHTML = `<div class="council-empty">${t('ui.council.empty')}</div>`
      }
      container.appendChild(slot)
    }

    // Available Legendaries not in Council
    const availableLegendaries = owned.filter(o =>
      o.def.rarity === 'legendario' && !council.includes(o.id)
    )
    if (availableLegendaries.length > 0 && council.length < MAX_SLOTS) {
      const header2 = document.createElement('div')
      header2.className = 'viajero-section-header'
      header2.textContent = t('ui.council.available')
      container.appendChild(header2)

      availableLegendaries.forEach(o => {
        const row = document.createElement('div')
        row.className = `council-available rarity-${o.def.rarity}`
        row.innerHTML = `
          <span class="vj-icon">${o.def.icon}</span>
          <span class="council-name rarity-label-legendario">${t('viajero.' + o.id + '.name')}</span>
          <button class="btn-council-assign btn-vj-action" data-viajero="${o.id}">${t('ui.council.assign')}</button>
        `
        container.appendChild(row)
      })
    }

    container.querySelectorAll('.btn-council-assign').forEach(btn => {
      btn.addEventListener('click', () => _actions.assignCouncil(btn.dataset.viajero))
    })
    container.querySelectorAll('.btn-council-remove').forEach(btn => {
      btn.addEventListener('click', () => _actions.removeFromCouncil(btn.dataset.viajero))
    })
  },

  // ── Quest chains tab ───────────────────────────────────────────────────────
  _renderQuestsTab(state, owned) {
    const container = document.getElementById('viajero-panel-quests')
    if (!container) return
    container.innerHTML = ''

    const unclaimedCount = QuestSystem.getUnclaimedCount(state)
    if (unclaimedCount > 0) {
      const banner = document.createElement('div')
      banner.className = 'quests-unclaimed-banner'
      banner.textContent = t('ui.quests.unclaimed', { n: unclaimedCount })
      container.appendChild(banner)
    }

    owned.forEach(o => {
      const chain = QuestSystem.getChain(state, o.id)
      if (chain.every(item => !item.unlocked)) return  // nothing visible yet

      const section = document.createElement('div')
      section.className = 'quest-chain'

      const header = document.createElement('div')
      header.className = 'quest-chain-header'
      header.innerHTML = `<span class="vj-icon">${o.def.icon}</span> ${t('viajero.' + o.id + '.name')}`
      section.appendChild(header)

      chain.forEach(({ quest, unlocked, conditionMet, completed, claimed }) => {
        if (!unlocked) return

        const row = document.createElement('div')
        row.className = `quest-row ${claimed ? 'quest-done' : conditionMet ? 'quest-ready' : 'quest-pending'}`
        row.innerHTML = `
          <div class="quest-title">${t(quest.key + '.title')}</div>
          <div class="quest-desc">${t(quest.key + '.desc')}</div>
          <div class="quest-reward">${t('ui.quests.reward.' + quest.rewardType, { n: quest.rewardAmt })}</div>
          ${conditionMet && !claimed
            ? `<button class="btn-quest-claim btn-vj-action" data-quest="${quest.id}">${t('ui.quests.claim')}</button>`
            : claimed
              ? `<span class="quest-claimed-badge">✓</span>`
              : ''
          }
        `
        section.appendChild(row)
      })

      container.appendChild(section)
    })

    container.querySelectorAll('.btn-quest-claim').forEach(btn => {
      btn.addEventListener('click', () => _actions.claimQuestReward(btn.dataset.quest))
    })
  },

  _viajeroCard(o, state, action) {
    const card = document.createElement('div')
    card.className = `viajero-card rarity-${o.def.rarity}`
    const isExplorer = o.def.role === 'explorer'
    const actionBtn = action === 'assign' && !isExplorer
      ? `<button class="btn-vj-assign btn-vj-action" data-viajero="${o.id}">${t('ui.viajero.assign_guardian')}</button>`
      : action === 'send'
        ? `<button class="btn-vj-send btn-vj-action" data-viajero="${o.id}">${t('ui.viajero.send_btn')}</button>`
        : ''
    const resonance  = o.resonance || 0
    const copies     = o.copies || 0
    card.innerHTML = `
      <div class="vj-header">
        <span class="vj-icon">${o.def.icon}</span>
        <div class="vj-info">
          <div class="vj-name">${t('viajero.' + o.id + '.name')}</div>
          <div class="vj-rarity rarity-label-${o.def.rarity}">${t('viajero.rarity.' + o.def.rarity)}</div>
          <div class="vj-resonance">
            <div class="vj-res-bar" style="width:${Math.round(resonance / 9 * 100)}%"></div>
          </div>
          <div class="vj-res-label">${t('ui.viajero.resonance', { n: resonance })}</div>
          <div class="vj-desc">${t('viajero.' + o.id + '.desc')}</div>
          ${copies > 0 ? `<div class="vj-copies">${t('ui.viajero.copies', { n: copies })}</div>` : ''}
        </div>
      </div>
      <div class="vj-artifacts">
        ${['head', 'weapon', 'relic'].map(slot => {
          const instId = o.artifacts?.[slot]
          const entry  = instId ? state.viajeros.artifacts?.[instId] : null
          const artDef = entry ? ARTIFACT_DATA.find(a => a.id === entry.defId) : null
          return `<div class="vj-artifact-slot slot-${slot}" title="${t('ui.viajero.artifact.' + slot)}">
            ${artDef ? `<span class="art-stars">${'★'.repeat(entry.stars)}</span> ${t('artifact.' + entry.defId + '.name')}` : '—'}
          </div>`
        }).join('')}
      </div>
      ${actionBtn}
    `
    return card
  },

  _showAssignModal(state, viajeroid) {
    // Build portal selection options
    const def = VIAJERO_DATA.find(v => v.id === viajeroid)
    if (!def) return

    const validPortals = PORTAL_DATA.filter(p =>
      (state.portals[p.id] > 0) || state.unlocks['portal' + p.id[0].toUpperCase() + p.id.slice(1)]
    )

    const modal   = document.getElementById('confirm-modal')
    const msgEl   = document.getElementById('confirm-modal-message')
    const btnOk   = document.getElementById('confirm-modal-ok')
    const btnCancel = document.getElementById('confirm-modal-cancel')
    if (!modal || !msgEl) return

    const body = document.createElement('div')
    body.innerHTML = `
      <div class="pm-title">${t('ui.viajero.assign_title', { name: t('viajero.' + viajeroid + '.name') })}</div>
      <select id="assign-portal-select" class="assign-select">
        ${validPortals.map(p => `<option value="${p.id}">${p.icon} ${t('portal.' + p.id + '.name')}</option>`).join('')}
      </select>
    `
    msgEl.innerHTML = ''
    msgEl.appendChild(body)
    btnOk.textContent     = t('ui.viajero.assign_guardian')
    btnCancel.textContent = t('modal.confirm.cancel')
    modal.style.display   = 'flex'

    const cleanup = () => {
      modal.style.display = 'none'
      btnOk.textContent     = t('modal.confirm.ok')
      btnCancel.textContent = t('modal.confirm.cancel')
      btnOk.onclick = null; btnCancel.onclick = null
    }
    btnOk.onclick = () => {
      const portalId = document.getElementById('assign-portal-select')?.value
      if (portalId) _actions.assignGuardian(viajeroid, portalId)
      cleanup()
    }
    btnCancel.onclick = () => cleanup()
  },

  // ── Combos de Portales panel ──────────────────────────────────────────────
  renderCombos(state) {
    const section = document.getElementById('section-combos')
    if (!section) return

    // Show once all basic portals are unlocked
    const basicUnlocked = ['ignea','abismal','temporal','vacio'].every(id => (state.portals[id] || 0) >= 1)
    if (!basicUnlocked) { section.style.display = 'none'; return }
    section.style.display = 'block'

    const passiveEl    = document.getElementById('combos-passive-list')
    const consumableEl = document.getElementById('combos-consumable-list')
    if (!passiveEl || !consumableEl) return

    // ── Passive combos ────────────────────────────────────────────────────
    passiveEl.innerHTML = ''
    PASSIVE_COMBOS.forEach(combo => {
      const active = !!(state.combos?.passive?.[combo.id])
      const portals = state.portals || {}

      // Progress: pick the portal with highest % toward its threshold
      const progList = combo.portals.map(p => ({
        id: p.id, have: portals[p.id] || 0, need: p.count,
      }))
      const allMet = progList.every(p => p.have >= p.need)

      const card = document.createElement('div')
      card.className = `combo-card ${active ? 'combo-active' : 'combo-pending'}`

      const requiresStr = combo.portals.map(p =>
        `${t('portal.' + p.id + '.name')} ×${p.count}`
      ).join(', ')

      const progBars = progList.map(p => {
        const pct = Math.min(Math.round(p.have / p.need * 100), 100)
        return `<div class="combo-prog-row">
          <span class="combo-prog-label">${t('portal.' + p.id + '.name')} ${p.have}/${p.need}</span>
          <div class="combo-prog-track"><div class="combo-prog-fill" style="width:${pct}%"></div></div>
        </div>`
      }).join('')

      card.innerHTML = `
        <div class="combo-header">
          <span class="combo-status-icon">${active ? '✅' : '🔓'}</span>
          <span class="combo-name">${t('combo.' + combo.id + '.name')}</span>
        </div>
        <div class="combo-effect">${t('combo.' + combo.id + '.effect')}</div>
        <div class="combo-requires">${t('combo.requires')}: ${requiresStr}</div>
        ${!active ? `<div class="combo-progress">${progBars}</div>` : ''}
      `
      passiveEl.appendChild(card)
    })

    // ── Consumable combos ─────────────────────────────────────────────────
    consumableEl.innerHTML = ''
    CONSUMABLE_COMBOS.forEach(combo => {
      const done = !!(state.combos?.consumed?.[combo.id])
      const can  = ComboSystem.canConsume(state, combo.id)

      const card = document.createElement('div')
      card.className = `combo-card combo-consumable ${done ? 'combo-done' : can ? 'combo-can-consume' : 'combo-locked'}`

      const costStr = combo.cost.map(c =>
        `${t('portal.' + c.id + '.name')} ×${c.count} (${t('combo.have')}: ${state.portals[c.id] || 0})`
      ).join(', ')

      card.innerHTML = `
        <div class="combo-header">
          <span class="combo-status-icon">${done ? '💫' : '⚡'}</span>
          <span class="combo-name">${t('combo.' + combo.id + '.name')}</span>
        </div>
        <div class="combo-effect">${t('combo.' + combo.id + '.effect')}</div>
        <div class="combo-cost-label">${t('combo.sacrifice')}: ${costStr}</div>
        ${!done && can
          ? `<button class="btn-consume-combo" data-combo="${combo.id}">${t('combo.sacrifice_btn')}</button>`
          : done ? `<span class="combo-done-label">${t('combo.done')}</span>` : ''
        }
      `
      consumableEl.appendChild(card)
    })

    // Wire sacrifice buttons
    consumableEl.querySelectorAll('.btn-consume-combo').forEach(btn => {
      btn.addEventListener('click', () => _actions.executeConsumeCombo(btn.dataset.combo))
    })
  },

  // ── Partícula de click ────────────────────────────────────────────────────
  _spawnParticle(event, power) {
    const container = document.getElementById('click-particles')
    const el        = document.createElement('div')
    el.className    = 'click-float'
    el.textContent  = '+' + fmt(power)
    el.style.left   = (event.clientX - 16) + 'px'
    el.style.top    = (event.clientY - 16) + 'px'
    container.appendChild(el)
    setTimeout(() => el.remove(), 900)
  },
}
