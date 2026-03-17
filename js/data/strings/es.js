// ── Strings en Español ────────────────────────────────────────────────────────

export const STRINGS_ES = {

  // ── Portales ────────────────────────────────────────────────────────────────
  'portal.ignea.name':    'Portal Ígnea',
  'portal.ignea.desc':    'Dimensión de fuego primordial',
  'portal.abismal.name':  'Portal Abismal',
  'portal.abismal.desc':  'Dimensión de las profundidades oscuras',
  'portal.temporal.name': 'Portal Temporal',
  'portal.temporal.desc': 'Dimensión suspendida fuera del tiempo',
  'portal.vacio.name':    'Portal del Vacío',
  'portal.vacio.desc':    'El espacio entre todas las dimensiones',

  // ── Mejoras — nombres ───────────────────────────────────────────────────────
  'upgrade.ck1.name': 'Guante de Energía',
  'upgrade.ck2.name': 'Impulso Manual',
  'upgrade.ck3.name': 'Mano del Nexo',
  'upgrade.ig1.name': 'Llama Azul',
  'upgrade.ig2.name': 'Núcleo Solar',
  'upgrade.ig3.name': 'Nova Dimensional',
  'upgrade.ab1.name': 'Corriente Profunda',
  'upgrade.ab2.name': 'Vorágine Oscura',
  'upgrade.ab3.name': 'Abismo Infinito',
  'upgrade.tm1.name': 'Eco del Pasado',
  'upgrade.tm2.name': 'Bucle Eterno',
  'upgrade.tm3.name': 'Convergencia Eterna',
  'upgrade.va1.name': 'Eco del Vacío',
  'upgrade.va2.name': 'Singularidad',
  'upgrade.va3.name': 'Colapso Dimensional',

  // ── Mejoras — descripciones (generadas dinámicamente con {portal} y {mult}) ─
  'upgrade.portal_mult':  '{portal} ×{mult}',
  'upgrade.click_power':  'Click power ×{mult}',
  'upgrade.requires':     'requiere {n} portal',
  'upgrade.requires_pl':  'requiere {n} portales',

  // ── Habilidades ─────────────────────────────────────────────────────────────
  'ability.convergencia.name':   'Convergencia',
  'ability.convergencia.desc':   'Multiplica toda la producción temporalmente',
  'ability.convergencia.unlock': 'Generá 50,000 de energía total',
  'ability.tormenta.name':       'Tormenta',
  'ability.tormenta.desc':       'Auto-click frenético por unos segundos',
  'ability.tormenta.unlock':     'Comprá 25 portales en total',
  'ability.pulso.name':          'Pulso Nexo',
  'ability.pulso.desc':          'Energía instantánea equivalente a minutos de producción',
  'ability.pulso.unlock':        'Comprá tu primer Portal del Vacío',
  'ability.cristalizacion.name': 'Cristalización',
  'ability.cristalizacion.desc': 'Reduce el costo de todos los portales temporalmente',
  'ability.cristalizacion.unlock': 'Comprá 100 portales en total',
  'ability.resonancia.name':     'Resonancia en Cadena',
  'ability.resonancia.desc':     'Cada portal amplifica al siguiente en la cadena',
  'ability.resonancia.unlock':   'Tenés al menos 1 de cada tipo de portal activo',

  // ── Habilidades — UI ────────────────────────────────────────────────────────
  'ability.status.ready':    'LISTO',
  'ability.status.tomorrow': 'MAÑANA',
  'ability.status.locked':   '🔒',
  'ability.daily.uses':      '{n}/{max} hoy',
  'ability.daily.limit':     'límite',
  'ability.level':           'N{n}',

  // ── Tutorial ────────────────────────────────────────────────────────────────
  'tutorial.step0': '⬡ Hacé click en el Nexo para generar tu primera Energía',
  'tutorial.step1': '✦ ¡Comprá tu primer Portal para automatizar la producción!',
  'tutorial.step2': '⚙ Comprá más portales — cuando tengas suficientes, aparecerán Mejoras',

  // ── HUD ─────────────────────────────────────────────────────────────────────
  'ui.hud.save':          'Guardar',
  'ui.hud.reset':         'Reset',
  'ui.hud.lang':          '🌐 EN',

  // ── Nexo ────────────────────────────────────────────────────────────────────
  'ui.nexo.subtitle':     'El Nexo',
  'ui.nexo.click_label':  '+{n} Energía',
  'ui.nexo.energy':       'Energía',

  // ── Stats ───────────────────────────────────────────────────────────────────
  'ui.stat.total_prod':    'Producción total',
  'ui.stat.total_earned':  'Energía total ganada',
  'ui.stat.offline_cap':   'Límite offline',
  'ui.stat.offline_eff':   'Eficiencia offline',

  // ── Secciones ───────────────────────────────────────────────────────────────
  'ui.section.abilities':  'Habilidades',
  'ui.section.portals':    'Portales Dimensionales',
  'ui.section.upgrades':   'Mejoras',
  'ui.badge.new':          'NUEVO',
  'ui.buy_mode.label':     'Comprar',

  // ── Recursos HUD ────────────────────────────────────────────────────────────
  'ui.res.energy':         'Energía Nexus',
  'ui.res.production':     'Producción',

  // ── Modales ─────────────────────────────────────────────────────────────────
  'modal.offline.title':      '¡Bienvenido de vuelta!',
  'modal.offline.absent':     'Estuviste ausente <strong>{time}</strong>.',
  'modal.offline.capped':     'Tus portales solo acumulan hasta {cap} de producción offline.',
  'modal.offline.efficiency': 'Tus portales trabajaron al <strong>{pct}%</strong> de eficiencia offline:',
  'modal.offline.earned':     '+{energy} Energía',
  'modal.offline.collect':    'Recolectar',
  'modal.confirm.cancel':     'Cancelar',
  'modal.confirm.ok':         'Confirmar',
  'modal.reset.message':      '¿Seguro? Se borrará todo el progreso.',

  // ── Notificaciones ───────────────────────────────────────────────────────────
  'notif.portal_unlocked':    '¡{name} descubierto!',
  'notif.panel_unlocked':     '¡Panel de {name} desbloqueado!',
  'notif.upgrade_bought':     '{name} activada — {desc}',
  'notif.ability_unlocked':   '¡{icon} {name} desbloqueada!',
  'notif.ability_levelup':    '¡{name} subió a Nivel {level}!',
  'notif.ability_daily_limit':'Límite diario alcanzado — volvé mañana',
  'notif.pulso_energy':       'Pulso Nexo — +{energy} Energía',
  'notif.saved':              'Partida guardada',
}
