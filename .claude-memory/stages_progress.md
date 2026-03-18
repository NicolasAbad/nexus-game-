
---
name: NEXUS stages progress tracker
description: Listado completo de stages con descripción detallada y estado de completado
type: project 
---

# NEXUS: Lords of Dimensions — Stage Tracker

---

### ✅ Stage 1 — Core Loop — DONE
- 4 portales: Ígnea, Abismal, Temporal, Vacío con producción pasiva
- 12 mejoras (×2, ×3, ×5 por portal)
- Offline income engine, auto-save localStorage
- Tutorial de 3 pasos, notificaciones, partículas de click, modal offline
- EventBus, Analytics stub

---

### ✅ Stage 2 — Fixes Técnicos + Arquitectura de Módulos — DONE
- Descargar break_infinity.js localmente (CDN falla en Capacitor offline)
- Reemplazar `confirm()` con modal personalizado (bloqueado en iOS/Android)
- Agregar `visibilitychange` al SaveManager (beforeunload no funciona en móvil)
- Refactor a módulos ES6 (`data/`, `core/`, `systems/`, `ui/`, `utils/`)
- Sistema de migración de saves (versión 1 → 2 → 3)

---

### ✅ Stage 3 — QoL Esencial + Habilidades — DONE
### ✅ Stage 3.5 — Sistema Multiidioma (ES/EN) — DONE
- Selector global de compra ×1 / ×10 / ×MAX para portales
- Click power upgrades: Guante de Energía (×5), Impulso Manual (×10), Mano del Nexo (×25)
- `clickPower()` escala con mejoras compradas
- **5 habilidades activas** con sistema de EXP (cada uso da +1 EXP → sube de nivel al llegar al umbral):
  - EXP thresholds: L2=15 usos | L3=55 | L4=135 | L5=285 usos acumulados
  - **3 usos gratuitos/día** por habilidad + **4 usos extra con anuncio** (Stage 19)
  - Reset diario a medianoche

  | Habilidad | Desbloqueo | CD L1→L5 | Efecto máximo (L5) |
  |---|---|---|---|
  | 🔮 Convergencia | Generá 50K energía total | 6h→3h | ×3 producción · 60s |
  | ⚡ Tormenta | Comprá 25 portales total | 8h→4h | Auto-click 80ms + ×3 click · 25s |
  | 💫 Pulso Nexo | Comprá primer Portal del Vacío | 8h→4h | Energía = 25 min producción |
  | ❄️ Cristalización | Comprá 100 portales total | 24h | -50% costo portales · 40s |
  | 🔗 Resonancia en Cadena | 1 de cada tipo de portal activo | 24h | +30% acumulado por portal · 40s |

---

### ✅ Stage 4 — Contenido Profundo — DONE
- 4 portales nuevos: Celestial (400/s), Caos (2,500/s), Primordial (15,000/s), Singular (100,000/s)
- Actualizar baseCosts a 25/300/4K/50K + costMultiplier 1.15 → 1.13 + migración de save
- 5 tiers de mejora por portal (×2 en 1, ×3 en 5, ×5 en 10, ×10 en 25, ×25 en 50) → 40 mejoras totales
- 3 mejoras globales (afectan todos los portales, desbloqueadas por energía total)
- Click upgrades que escalan clickPower con la producción total
- Sinergias cross-portal: tener X de portal A + X de portal B activa bonus permanente

---

### Stage 5 — Tutorial + Sistema de Misiones
- Tutorial completo rediseñado (5 pasos, guía hasta el primer idle period)
- 20 misiones de historia permanentes (guían las primeras 2 semanas)
  - Incluyen las misiones de desbloqueo de las 5 habilidades
- 3 misiones diarias (reset 24h: clicks, compras, gasto de energía)
- 1 misión semanal con reward importante
- Panel de misiones en UI + "próximo objetivo" siempre visible en pantalla
- **Daily mission streak**: complete all 3 daily missions X consecutive days → bonus reward (Prestige Fragment, crystals, or Viajero shard). Counter visible in missions panel. ← *added from market research*

---

### Stage 6 — Historia + Sistema de Lore
- Fragmentos de lore para los 8 portales (se revelan al desbloquear cada uno)
- Panel de lore en UI (historial scrolleable de fragmentos desbloqueados)
- Secuencia de intro (quién sos, qué es el Nexo, por qué importa) — player IS the Nexo, one paragraph before first click
- Cada desbloqueo de portal = momento narrativo + fragmento de historia
- Stubs de historia para los 7 tiers de prestige (se completan en Stage 14)
- **Dimensional Rifts**: random 30-second active windows where a rift appears on screen. Clicking it generates bonus energy proportional to current production. Rifts upgradeable (longer duration, higher multiplier). Keeps clicking meaningful at all stages of the game. ← *added from market research*

---

### Stage 7 — Prestige: Ascensión Dimensional (Tiers 1 y 2)

**Modelo: prestige horizontal — cada run permite llegar MÁS LEJOS, no más rápido al mismo lugar.**

**Condición de desbloqueo (optimal):** `portals.singular >= 1` + `totalEnergyEarned >= 500,000,000`
El botón aparece visible (pero bloqueado) desde que se desbloquea Portal Singular.

**Early prestige option (casual path):** All 8 portal types unlocked (≥1 each) → early prestige available with reduced Fragment yield (~40% of normal scoring). Teaches the mechanic earlier, doesn't lock casual players out for weeks. Same reset rules apply. ← *added from market research*

**Moneda: Fragmentos Dimensionales**
Calculados por puntos de la run actual:
- Cada portal desbloqueado (más allá de Ígnea): +2 (máx +14)
- Total portales: ≥10 → +2, ≥25 → +3, ≥50 → +4, ≥100 → +5
- Cada 5 mejoras compradas: +1 (máx ~10)
- Cada sinergia activa: +3 (máx +12)
- Cada habilidad en L5: +2 (máx +10)
Primera run bien jugada: ~25-35 Frags. Run perfecta: ~50-55.

**Qué resetea:** energía, portales, mejoras compradas, cooldowns de habilidades
**Qué NO resetea:** niveles EXP de habilidades, árbol de prestige, Viajeros ya desbloqueados, lore visto, misiones historia completadas

**Árbol de prestige — 10 nodos, 4 ramas:**

Rama A — Viajeros (Tier 1 + 2):
- A1: Kael Awakens (5 Frags) → Kael arrives at the start of the next run. Ígnea +20%.
- A2: Lyra Arrives (10 Frags, Tier 2) → Lyra arrives. First expedition slot active.
- A3: Initial Resonance (15 Frags, Tier 2, req A2) → Resonance system active. Ability EXP gives +50% bonus.

Rama B — Ascended Upgrades / new production ceiling (tier 6 ×150 per portal):
- B1: Ignea Ascension (4 Frags) → tier 6 Ígnea (×150, req 100 portals, cost 10^11 energy)
- B2: Deep Ascension (6 Frags, req B1) → tier 6 Abismal + Temporal
- B3: Void Ascension (8 Frags, req B2) → tier 6 Vacío + Celestial
- B4: Total Ascension (12 Frags, Tier 2, req B3) → tier 6 Caos + Primordial + Singular

Rama C — Permanent quality of life:
- C1: Echo of Time (3 Frags) → offline cap 2h → 4h
- C2: Eternal First Portal (4 Frags, req C1) → 1st portal of each type costs 0 in new run
- C3: Inscribed Knowledge (5 Frags, req C2) → upgrade costs -15% permanent

Rama D — Story (automatic, no cost):
- D1: first prestige → chapter "The Awakening"
- D2: second prestige → chapter "The Fracture"

**UI:**
- Panel prestige en panel derecho: Fragmentos disponibles/total + árbol visual
- Indicador en vivo: "Si prestigi-aras ahora: +X Fragmentos"
- Modal de confirmación: resumen de run + qué resetea/persiste + botón Ascender

---

### ✅ Stage 8 — Viajeros Sistema Core — DONE
- Datos de 24 Viajeros definidos (3 por dimensión + 2 Legendarios especiales)
- Sistema de llegada narrativa (vinculado a misiones + portales desbloqueados)
- Rol Guardián: asignado a portal (multiplicador de producción O auto-compra)
- Rol Explorador: expediciones con duración X horas + tabla de loot definida
- Panel de Viajeros en UI
- Mini-tutorial al llegar el primer Viajero
- **Gacha pull system**: basic pull UI functional here (single pull + 10-pull). Pity counter starts. Uses Dimensional Crystals from Stage 16, but the pull mechanic and UI is built here. ← *added from market research*
- **Viajero Artifacts**: 3 artifact slots per Viajero (Head, Weapon, Relic). Artifacts drop from expeditions (Common→Legendary rarity). Each artifact grants a stat bonus (production %, expedition speed, cooldown reduction, click power). Artifacts have star levels (upgrade with duplicate artifacts). Creates a permanent long-term progression sink beyond resonance 9. ← *added from market research*

---

### Stage 9 — Viajeros Avanzado
- Sistema de Resonancia (0-9 por Viajero, sube con uso)
- Lore personal desbloqueado en resonancia 3, 6 y 9
- Diálogos reactivos via EventBus (prestige, milestones, volver tras 8h)
- Bond Web UI (pantalla visual de todos los vínculos locked/unlocked)
- 6 pares de vínculos con relaciones narrativas y bonuses
- Quest Chains personales (3 misiones por Viajero)
- Sistema de Fusión (3× misma rareza → 1 rareza superior)
- Consejo del Nexo (slot separado para Legendarios, bonuses globales)

---

### ✅ Stage 10 — Combos de Portales — DONE
- 8 combos pasivos con efectos diversos: portal pair mult, offline cap +h, offline eff +%, click power mult, prestige frag mult, global mult
- 5 combos consumibles que sacrifican portales para bonus permanente
- Consumed combos persisten en prestige; passive combos resetean (requieren re-alcanzar threshold)
- ComboSystem integrado en production, offline, prestige fragment scoring
- Pantalla de combos en UI con grid de pasivos + lista de sacrificios con barra de progreso

---

### Stage 11 — Login Streak + Retorno Diario
- Streak de 7 días con rewards escalantes (Day 7: Épico Viajero o Cristales)
- Grace period de 24h antes de resetear el streak
- Modal de retorno (muestra streak status + offline income juntos)
- Stub de push notifications (se activa en Stage 18 con Capacitor)

---

### Stage 11b — Guild System ← *added from market research*
- Player creates or joins a guild (name + tag, up to 30 members)
- Guild chest: fills passively based on combined member production per hour → all members collect shared rewards daily
- Weekly guild goal: combined portal purchases or energy produced this week → milestone rewards for all members
- Guild chat (basic, text only)
- Guild rank: based on total combined production — top guilds on a server leaderboard
- **Weekly Dimensional Ranking**: individual leaderboard ranked by energy produced in current week. Top 10% receive small crystal bonus. Uses Firebase Firestore. Built on same infrastructure as guild leaderboard.
- Firebase implementation: guild data lives in Firestore. Local mock (NPC guild members) available during development before Firebase is wired in Stage 17.

---

### Stage 12 — Logros (150+)
- 150+ logros definidos en data
- Panel de logros con % de completado por categoría
- Categorías: clicks, energía, portales, mejoras, prestige, viajeros, historia, vínculos, playtime, eventos, secretos
- Reward por cada logro desbloqueado (energía, cristales, o cosméticos)
- Logros secretos/ocultos (no se revelan hasta que se desbloquean)

---

### Stage 13 — Sistema de Eventos ("Dimensiones Inestables")
- 4 tipos de evento rotando: Unstable Dimension, Crisis Expedition, The Vacant Advances, Fractured Nexo
- Calendario: L-X mini-evento (48h) + J-D evento mayor (72h) + primer viernes mega-evento (14 días)
- Moneda de evento + track de rewards con 90% alcanzable F2P
- UI "ya falta poco" cuando el jugador está al 85% de la moneda del evento
- Stub de push notification 24h antes del cierre (se activa en Stage 18)
- Leaderboard local (mock) para mega-evento mensual
- **Limited-time Viajero banners**: each major event (72h+) features 1 limited Viajero available only during the event window. After 3 months, rotates into permanent pool. Drives urgency and gacha spending that permanent banners cannot. ← *added from market research*

---

### Stage 14 — Prestige Tiers 3-7 (Historia Completa)
- Contenido narrativo de los Tiers 3-7:
  - Tier 3: The Vacant — it has a name and a purpose
  - Tier 4: The Origin — it was created as a tool
  - Tier 5: The Primordial Artifacts — epic 24-48h expeditions
  - Tier 6: The Sacrifice — The Presence fuses with the Nexo
  - Tier 7: The Last Nexus — final confrontation, free The Vacant
- Sistema de Expediciones Épicas (artefactos de historia, riesgo real)
- Transformación visual final del Nexo
- Secuencia de créditos + finales individuales de cada Viajero
- New Game+ (conserva bonuses de prestige, reempieza historia)

---

### Stage 15 — Challenge Runs
- 3 tipos de challenge con restricciones (ej: "sin Portal Ígnea", "sin mejoras")
- Rewards únicos por completar cada challenge (multiplicadores exclusivos, cosméticos)
- Panel de challenges en UI con historial de completados

---

### Stage 16 — Monetización
- Sistema de Cristales Dimensionales con checksum anti-cheat en localStorage
- Gacha de Viajeros (pity garantizado en 80 pulls, soft pity desde 60)
- Packs de cristales: $0.99 / $2.99 / $5.99 / $11.99 / $24.99 / $49.99
- Banner "Primera Recarga: Doble Cristales" permanente hasta primera compra
- Growth Fund ($9.99: paga por cada prestige realizado)
- Nexo Pass Básico ($4.99/mes) y Legendario ($9.99/mes)
- Time boosters + cosméticos (skins de portales, UI themes, frames de Viajeros)
- Rewarded ads: **3 gratis/día por habilidad + 4 extra con anuncio** (reset habilidades en cooldown)
- Costo extra de habilidades con cristales: 💎5 por uso adicional
- Panel de tienda completo en UI

---

### Stage 17 — Firebase Completo + Settings
- **Firebase Authentication**: login anónimo automático → upgrade a Google/Apple con un tap
- **Firebase Firestore**: cloud saves reales — Firestore como fuente de verdad, localStorage como cache offline
- **Firebase Analytics**: funnel completo — new_game, first_portal, first_prestige, first_purchase, D1/D7/D30
- **Firebase Remote Config**: cambiar valores de balance sin actualizar la app
- **Firebase Cloud Functions**: validar compras IAP server-side (anti-fraude)
- **Firebase Cloud Messaging**: push notifications reales
- Pantalla de configuración (sonido, notificaciones, idioma placeholder, reset, privacidad)
- Privacy Policy + TOS (requeridos para App Store y Google Play)
- Pantalla de disclosure de probabilidades gacha (requerido por App Store)
- **Costo estimado**: $0/mes hasta ~50,000 usuarios/día (Firebase free tier)

---

### Stage 18 — Conversión Mobile (Capacitor)
- CSS responsive para portrait mobile (layout vertical optimizado)
- Tap targets más grandes, feedback táctil
- Setup proyecto Capacitor (iOS + Android)
- Haptic feedback en click, compra, logro desbloqueado
- Portrait orientation lock (ScreenOrientation plugin)
- AdMob integration para rewarded ads (activa el sistema de ads de habilidades)
- Push notifications reales: expediciones retornan, eventos terminan, login streak
- App icon + splash screen

---

### Stage 19 — App Store Submission
- Submission a iOS App Store
- Submission a Google Play Store
- Age rating questionnaire (gacha → 12+ típicamente)
- Screenshots + descripciones en español e inglés
- Beta testing con TestFlight (iOS) + Internal Track (Android)

---

### Stage 20 — Polish + Live Operations
- Sound effects + música ambient dimensional
- Eventos estacionales (Navidad, Halloween, Año Nuevo Chino)
- Social sharing: "Llegué al Prestige 3" con Web Share API → installs orgánicos
- Balance tuning basado en datos reales de Firebase Analytics
- Performance audit (animaciones, memory leaks, consumo de batería)
- Ongoing: nuevos Viajeros, tipos de evento, capítulos de story DLC
