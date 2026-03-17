// ── UI ────────────────────────────────────────────────────────────────────────
//    Stage 3: buy mode selector (×1/×10/×MAX), ability panel, click upgrades

import { PORTAL_DATA }   from './data/portals.js'
import { UPGRADE_DATA }  from './data/upgrades.js'
import { ABILITY_DATA }  from './data/abilities.js'
import { Production }    from './core/production.js'
import { Abilities }     from './systems/abilities.js'
import { fmt, fmtTime }  from './utils/format.js'
import { t, i18n }       from './utils/i18n.js'

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
    this._bindButtons()
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
        this.build()
        this.renderAll(_actions.getState())
      })
    }
    document.getElementById('offline-modal-close').addEventListener('click', () => {
      document.getElementById('offline-modal').style.display = 'none'
    })
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
          b.classList.toggle('active', b.dataset.mode == String(_buyMode))
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
        ? t('upgrade.click_power', { mult: u.multiplier })
        : t('upgrade.portal_mult', { portal: t('portal.' + u.portalId + '.name'), mult: u.multiplier })
      const reqText = u.portalId === 'click'
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

  // ── Renders ───────────────────────────────────────────────────────────────
  renderAll(state) {
    this.renderResources(state, Abilities.getProductionMultiplier(state))
    PORTAL_DATA.forEach(p => this.renderPortalCard(p.id, state))
    this.renderUpgradesSection(state)
    this.renderAffordability(state)
    this.renderAbilities(state)
  },

  renderResources(state, abilityMult = 1) {
    const baseProd   = Production.total(state)
    const effectProd = baseProd.mul(abilityMult)
    document.getElementById('res-energy').textContent        = fmt(state.energy)
    document.getElementById('res-production').textContent    = fmt(effectProd) + '/s'
    document.getElementById('stat-total-prod').textContent   = fmt(effectProd) + '/s'
    document.getElementById('stat-total-earned').textContent = fmt(state.totalEnergyEarned)
    document.getElementById('click-power').textContent       = fmt(Production.clickPower(state))
    document.getElementById('stat-offline-cap').textContent  = fmtTime(state.offlineCap)
    document.getElementById('stat-offline-eff').textContent  = Math.round(state.offlineEfficiency * 100) + '%'
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

    // Click upgrades: visibles en cuanto el panel esté abierto
    const visible = upg.portalId === 'click'
      ? state.unlocks.panelUpgrades
      : (state.portals[upg.portalId] || 0) >= upg.requires || purchased

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
      const hasPortals = u.portalId === 'click' || (state.portals[u.portalId] || 0) >= u.requires
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
        stat.textContent = '🔒'
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
