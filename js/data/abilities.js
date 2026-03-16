// ── Habilidades activas ───────────────────────────────────────────────────────

export const ABILITY_DATA = [
  {
    id:          'convergencia',
    name:        'Convergencia',
    icon:        '🔮',
    desc:        '×2 producción por 30s',
    type:        'buff',        // multiplica producción mientras dura
    duration:    30,            // segundos activa
    cooldown:    300,           // segundos de cooldown (5 min)
    buffValue:   2,             // multiplicador de producción
  },
  {
    id:          'tormenta',
    name:        'Tormenta',
    icon:        '⚡',
    desc:        'Auto-click por 10s',
    type:        'autoclicker', // clickea automáticamente mientras dura
    duration:    10,
    cooldown:    480,           // 8 min
    clickRate:   0.15,          // un click cada 150ms
  },
  {
    id:          'pulso',
    name:        'Pulso Nexo',
    icon:        '💫',
    desc:        'Energía = 10 min de producción',
    type:        'instant',     // se aplica de inmediato, sin duración
    duration:    0,
    cooldown:    900,           // 15 min
    prodSeconds: 600,           // segundos de producción que otorga
  },
]
