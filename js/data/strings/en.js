// ── Strings in English ────────────────────────────────────────────────────────

export const STRINGS_EN = {

  // ── Portals ─────────────────────────────────────────────────────────────────
  'portal.ignea.name':    'Igneous Portal',
  'portal.ignea.desc':    'A dimension of primordial fire',
  'portal.abismal.name':  'Abyssal Portal',
  'portal.abismal.desc':  'A dimension of dark depths',
  'portal.temporal.name': 'Temporal Portal',
  'portal.temporal.desc': 'A dimension frozen outside of time',
  'portal.vacio.name':    'Void Portal',
  'portal.vacio.desc':    'The space between all dimensions',

  // ── Upgrades — names ────────────────────────────────────────────────────────
  'upgrade.ck1.name': 'Energy Gauntlet',
  'upgrade.ck2.name': 'Manual Surge',
  'upgrade.ck3.name': 'Nexus Hand',
  'upgrade.ig1.name': 'Blue Flame',
  'upgrade.ig2.name': 'Solar Core',
  'upgrade.ig3.name': 'Dimensional Nova',
  'upgrade.ab1.name': 'Deep Current',
  'upgrade.ab2.name': 'Dark Vortex',
  'upgrade.ab3.name': 'Infinite Abyss',
  'upgrade.tm1.name': 'Echo of the Past',
  'upgrade.tm2.name': 'Eternal Loop',
  'upgrade.tm3.name': 'Eternal Convergence',
  'upgrade.va1.name': 'Void Echo',
  'upgrade.va2.name': 'Singularity',
  'upgrade.va3.name': 'Dimensional Collapse',

  // ── Upgrades — descriptions ─────────────────────────────────────────────────
  'upgrade.portal_mult':  '{portal} ×{mult}',
  'upgrade.click_power':  'Click power ×{mult}',
  'upgrade.requires':     'requires {n} portal',
  'upgrade.requires_pl':  'requires {n} portals',

  // ── Abilities ───────────────────────────────────────────────────────────────
  'ability.convergencia.name':   'Convergence',
  'ability.convergencia.desc':   'Temporarily multiplies all production',
  'ability.convergencia.unlock': 'Generate 50,000 total energy',
  'ability.tormenta.name':       'Storm',
  'ability.tormenta.desc':       'Frantic auto-clicking for a few seconds',
  'ability.tormenta.unlock':     'Buy 25 portals in total',
  'ability.pulso.name':          'Nexus Pulse',
  'ability.pulso.desc':          'Instant energy equal to minutes of production',
  'ability.pulso.unlock':        'Buy your first Void Portal',
  'ability.cristalizacion.name': 'Crystallization',
  'ability.cristalizacion.desc': 'Temporarily reduces the cost of all portals',
  'ability.cristalizacion.unlock': 'Buy 100 portals in total',
  'ability.resonancia.name':     'Chain Resonance',
  'ability.resonancia.desc':     'Each portal amplifies the next one in the chain',
  'ability.resonancia.unlock':   'Have at least 1 of each portal type active',

  // ── Abilities — UI ──────────────────────────────────────────────────────────
  'ability.status.ready':    'READY',
  'ability.status.tomorrow': 'TOMORROW',
  'ability.status.locked':   '🔒',
  'ability.daily.uses':      '{n}/{max} today',
  'ability.daily.limit':     'limit',
  'ability.level':           'L{n}',

  // ── Tutorial ────────────────────────────────────────────────────────────────
  'tutorial.step0': '⬡ Click the Nexus to generate your first Energy',
  'tutorial.step1': '✦ Buy your first Portal to automate production!',
  'tutorial.step2': '⚙ Buy more portals — once you have enough, Upgrades will appear',

  // ── HUD ─────────────────────────────────────────────────────────────────────
  'ui.hud.save':          'Save',
  'ui.hud.reset':         'Reset',
  'ui.hud.lang':          '🌐 ES',

  // ── Nexo ────────────────────────────────────────────────────────────────────
  'ui.nexo.subtitle':     'The Nexus',
  'ui.nexo.click_label':  '+{n} Energy',
  'ui.nexo.energy':       'Energy',

  // ── Stats ───────────────────────────────────────────────────────────────────
  'ui.stat.total_prod':    'Total production',
  'ui.stat.total_earned':  'Total energy earned',
  'ui.stat.offline_cap':   'Offline cap',
  'ui.stat.offline_eff':   'Offline efficiency',

  // ── Sections ────────────────────────────────────────────────────────────────
  'ui.section.abilities':  'Abilities',
  'ui.section.portals':    'Dimensional Portals',
  'ui.section.upgrades':   'Upgrades',
  'ui.badge.new':          'NEW',
  'ui.buy_mode.label':     'Buy',

  // ── Resources HUD ───────────────────────────────────────────────────────────
  'ui.res.energy':         'Nexus Energy',
  'ui.res.production':     'Production',

  // ── Modals ──────────────────────────────────────────────────────────────────
  'modal.offline.title':      'Welcome back!',
  'modal.offline.absent':     'You were away for <strong>{time}</strong>.',
  'modal.offline.capped':     'Your portals can only accumulate up to {cap} of offline production.',
  'modal.offline.efficiency': 'Your portals worked at <strong>{pct}%</strong> offline efficiency:',
  'modal.offline.earned':     '+{energy} Energy',
  'modal.offline.collect':    'Collect',
  'modal.confirm.cancel':     'Cancel',
  'modal.confirm.ok':         'Confirm',
  'modal.reset.message':      'Are you sure? All progress will be lost.',

  // ── Notifications ────────────────────────────────────────────────────────────
  'notif.portal_unlocked':    '{name} discovered!',
  'notif.panel_unlocked':     '{name} panel unlocked!',
  'notif.upgrade_bought':     '{name} activated — {desc}',
  'notif.ability_unlocked':   '{icon} {name} unlocked!',
  'notif.ability_levelup':    '{name} reached Level {level}!',
  'notif.ability_daily_limit':'Daily limit reached — come back tomorrow',
  'notif.pulso_energy':       'Nexus Pulse — +{energy} Energy',
  'notif.saved':              'Game saved',
}
