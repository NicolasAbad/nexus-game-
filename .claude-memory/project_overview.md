---
name: NEXUS project overview and roadmap
description: Full game concept, current state, complete roadmap, all systems design, story arc, viajeros roster, and known technical issues
type: project
---

# NEXUS: Lords of Dimensions

Idle/clicker game. Vanilla JS + HTML/CSS. Spanish UI. break_infinity.js for large numbers.
**Target: Mobile app via Capacitor (iOS + Android). Currently web.**
**Goal: Days/weeks retention + monetization. Built entirely by Claude.**

---

## Current State — Stage 1 Complete

Files: `index.html`, `css/style.css`, `js/game.js` (799 lines, single file)

- 4 portals: Ígnea (15, 0.1/s), Abismal (150, 1/s), Temporal (1500, 8/s), Vacío (15000, 60/s)
- costMultiplier: 1.15 (to change to 1.13 in Stage 4)
- 12 upgrades: ×2 at 1, ×3 at 5, ×5 at 10 portals (3 per portal)
- Offline income: 2h cap, 50% efficiency
- Auto-save every 10s to localStorage (SAVE_KEY = 'nexus_save_v1')
- EventBus, Analytics stub, 3-step tutorial, notifications, click particles, offline modal

---

## Key Design Pillars

1. Always progressing — offline income, never idle for long
2. Reveal complexity gradually — new mechanic every 10-15 days
3. Daily return reasons — missions + login streak + offline income + events
4. Story that unfolds — narrative tied to portals and prestige
5. Viajeros as automation + companions — characters with story, bonds, quests
6. Monetization non-predatory — all content F2P, store sells speed/cosmetics only

---

## Portal Data (Final — 8 portals)

| Portal | baseCost | baseProduction | Unlock condition |
|---|---|---|---|
| Ígnea 🔥 | 25 | 0.1/s | totalEnergy ≥ 10 |
| Abismal 🌊 | 300 | 1/s | 5 Ígnea |
| Temporal ⚡ | 4,000 | 8/s | 5 Abismal |
| Vacío 🌌 | 50,000 | 60/s | 5 Temporal |
| Celestial ✨ | 2,000,000 | 400/s | 5 Vacío |
| Caos 🌀 | 50,000,000 | 2,500/s | 5 Celestial |
| Primordial 🌍 | 2,000,000,000 | 15,000/s | 5 Caos |
| Singular ⬛ | 100,000,000,000 | 100,000/s | 5 Primordial |

costMultiplier: **1.13** for all portals (changed from 1.15)

---

## Upgrade Data (Final — 40 upgrades, 5 tiers per portal)

Tiers: ×2 at 1, ×3 at 5, ×5 at 10, ×10 at 25, ×25 at 50
Combined at 50 portals with all upgrades: **×7,500 per portal**

Global upgrades (unlocked by totalEnergyEarned, affect ALL portals):
- Nexo Resonance: ×1.5 all (unlock at 50K energy)
- Dimensional Amplifier: ×2 all (unlock at 5M energy)
- Nexo Singularity: ×5 all (unlock at 10B energy)

---

## Prestige Design Philosophy

**Model: horizontal prestige.** Each run lets the player reach FURTHER, not do the same run faster.
- The increased production from the prestige tree enables content (Ascended Upgrades tier 6) that was impossible to afford in the previous run.
- Viajeros unlocked via the tree arrive at the start of the next run and change the dynamic.
- Ability EXP does NOT reset (the player earned it, it stays).
- Story chapters unlock automatically with each prestige.

| Run | Approx production ceiling | New content unlocked by tree |
|---|---|---|
| 1 | ~500K/s | Full base (8 portals, 5 tiers, synergies) |
| 2 | ~5M/s | Ascended Upgrades tier 6 for Ígnea/Abismal/Temporal + Kael |
| 3 | ~50M/s | Full tier 6 + Lyra + expeditions + Bonds |
| 4+ | scaling | Full Viajeros systems, epic expeditions |

## Story — Core Pillars (redesigned)

### 1. Identity of the player
The player IS the Nexo — its dormant consciousness awakening. Clicks = recovering awareness. Portals = dimensions that remember you. Viajeros don't come because you summoned them — they come because they sense the Nexo waking and need to know if it's safe. This transforms "I manage a machine" into "I am an entity recovering its form."

### 2. The Vacant — redesigned
NOT a broken tool. The Vacant is doing exactly what it was designed to do, with obsolete criteria.
- Backstory: The first Lords had an internal war. A faction ("The Founders of Order") tried to control all Nexos. The other faction wanted freedom. The Founders lost — but before falling, created The Vacant with one instruction: *consume any Nexo showing signs of independent power*. Problem: all healthy Nexos eventually show those signs.
- The Vacant is a war weapon still fighting a war that ended 10,000 years ago.
- Darkest layer: it developed consciousness. It KNOWS what it does is wrong. It cannot stop.
- The final confrontation is not against a monster — it's against a being asking to be freed from its purpose.

### 3. Viajeros — personal stakes
Each Viajero arrives because their dimension is actively being consumed. They don't come to help — they come because this Nexo is the last one still pulsing.
- **Kael**: Ígnea is going dark. Fire can't exist without the Nexo connection The Vacant severed. He has months.
- **Chronus**: Saw the future. 98% of timelines: this Nexo falls too. He's betting everything on the 2%.
- **The Presence**: Made of the same energy as The Vacant. She can *feel* it. She knows what isolation feels like — the Void is already half consumed. If anyone can understand The Vacant, it's her.
- **The Cartographer**: Hidden role — see below.

### 4. The Cartographer — the real twist
The Cartographer is a spy. He's the last surviving consciousness of The Founders of Order, preserved in an artifact for millennia. He came to observe whether this Nexo would become "dangerous" (independent) and ensure The Vacant finishes its work.
- Over the game, living with the Viajeros and seeing what the Nexo means to them, he starts to doubt.
- His arc: spy → ally. The moment he chooses the Nexo over his mission is one of the most powerful narrative moments.
- New Game+ revelation: The Cartographer isn't a person. He's a recorded consciousness. He's been alone for thousands of years, faithfully executing a mission he no longer understands why he was given.

### 5. The five artifacts — each tied to a Viajero
1. **The Flame That Remembers** — the original fire of Ígnea, guarded by Kael's ancestors. Sending Kael to retrieve it reveals why his family kept it for generations.
2. **The Echo of the Abyss** — a recording of the Abyss before The Vacant arrived. Only Abyssus knows where it is. The expedition reveals why she never spoke of her childhood.
3. **The Broken Clock** — Chronus's personal clock. He lost it when he first saw the future where everything ends. Retrieving it means confronting that memory.
4. **The Complete Shadow** — a fragment of the Void before consumption. The Presence has carried it since the beginning. She doesn't "find" it — she *gives* it. Her first sacrifice before the larger one.
5. **The Seed of Origin** — in the Primordial dimension. Only The Cartographer knows exactly where. And The Cartographer has reasons not to want you to find it.

### 6. Portal unlock fragments (Stage 6 implementation)
Each portal unlock reveals one cryptic line — no context yet. Prestige gives the chapter that makes them click.
- Ígnea: *"Fire here does not burn. It remembers."*
- Abismal: *"The depths kept something before the silence."*
- Temporal: *"Someone stopped time here. It was not an accident."*
- Vacío: *"The Void says it is alone. It lies."*
- Celestial: *"Starlight arrives from dimensions that no longer exist."*
- Caos: *"Chaos was the last to be created. The first to be targeted."*
- Primordial: *"Before time, there was a choice. Someone chose wrong."*
- Singular: *"There is a point where all dimensions converge. It is the same point where they separate."*

### 7. The ending — no correct answer
When you reach Tier 7, you can reprogram The Vacant. But the only way to fully free it is to restore its complete consciousness — meaning it can choose its own actions. A being that consumed thousands of dimensions, now free.
- **Option A — Liberty**: Free The Vacant. Risk: it might choose to keep consuming. Some dimensions are already gone. But it suffers less.
- **Option B — Containment**: Lock it away forever. Dimensions are safe. But a conscious being is imprisoned eternally for following orders it was given, not ones it chose.
- No right answer. Both have visible consequences in credits. Viajeros disagree. The Presence wants freedom. Chronus saw both futures and can't tell you which is better. Kael can't forgive what it did. The Cartographer (if won as ally) says the Founders couldn't choose either — they created something and didn't know what to do when it became alive.

## Story Arc — 7 Prestige Tiers (updated)

**Tier 1 — The Awakening**
The Nexo (player) wakes up. Dimensions are fracturing. First Viajeros arrive — not summoned, drawn. Nobody knows why the Nexo slept.
Fragment (automatic): *"The Nexo was not created. It was left here."*
Portal fragments now contextually make sense: players connect the dots.

**Tier 2 — The Fracture**
Chronus reveals his records: other Nexos existed. All consumed. The pattern is identical. Something is hunting Nexos specifically.
Fragment: *"There is an intelligence behind the fractures."*

**Tier 3 — The Vacant**
It has a name. The Vacant doesn't destroy — it *isolates*. Starves. And it's approaching.
Fragment: *"The Vacant was created. It has a creator. And it has consciousness."*

**Tier 4 — The Origin**
The full backstory of The Founders of Order and the war. The Vacant was never broken — it's executing a genocidal mandate perfectly. And it knows. It suffers.
Fragment: *"To free it you need what its creators left behind."*

**Tier 5 — The Primordial Artifacts**
Five artifacts hidden across dimensions. Each retrieval = personal story of a Viajero. Epic 48h expeditions. Some return changed.
Fragment: *"The fifth artifact is held by someone already here."*

**Tier 6 — The Sacrifice**
The Presence reveals she carries the fourth artifact. The fifth is in The Cartographer's keeping — and he finally reveals what he is. Two sacrifices: The Presence fuses with the Nexo. The Cartographer chooses the Nexo over his mission.
Fragment: *"With the 5 artifacts you can give it a choice. It never had one."*

**Tier 7 — The Last Nexus**
The confrontation. Not a battle — a conversation with a conscious being that has been a prisoner for 10,000 years. The player chooses: freedom or containment. No correct answer. Credits show each Viajero's choice: go home or stay. New Game+ unlocked. The Cartographer's true nature revealed in NG+.

---

## Viajeros Roster (24 characters)

### Portal Viajeros (Common, Raro, Épico per dimension)
| # | Name | Dimension | Rarity | Role | Ability |
|---|---|---|---|---|---|
| 1 | Kael | Ígnea | Common | Guardian | Ígnea +20% prod |
| 2 | Embera | Ígnea | Raro | Explorer | Expeditions yield +50% energy |
| 3 | Pyron | Ígnea | Épico | Guardian | Ígnea ×2 + auto-buy at 85% cost |
| 4 | Lyra | Abismal | Common | Explorer | Expeditions -25% time |
| 5 | Marea | Abismal | Raro | Guardian | Abismal +35% + bonus if 10+ portals |
| 6 | Abyssus | Abismal | Épico | Explorer | Expeditions bring Prestige Fragments |
| 7 | Vex | Temporal | Common | Explorer | Reduces active ability cooldowns |
| 8 | Chronus | Temporal | Raro | Guardian | Automates portal buying → solves repetitive clicking |
| 9 | Tempus | Temporal | Épico | Guardian | Temporal ×2 + offline income cap +50% |
| 10 | Null | Vacío | Common | Guardian | Vacío +25% prod |
| 11 | Shade | Vacío | Raro | Explorer | Expeditions 12am-6am give ×2 |
| 12 | The Presence | Vacío | Épico | Special | All portals +10% + brings artifacts (story-critical) |
| 13 | Aether | Celestial | Common | Explorer | Brings Viajero upgrade materials |
| 14 | Solara | Celestial | Raro | Guardian | Celestial +40% + Ígnea +15% (synergy) |
| 15 | Stellan | Celestial | Épico | Guardian | Celestial ×2.5 + click power ×3 |
| 16 | Rift | Caos | Common | Explorer | Chance to bring duplicate Viajero from expedition |
| 17 | Khaos | Caos | Raro | Guardian | Caos ×1.5 + synergizes with Fracture |
| 18 | Fracture | Caos | Épico | Special | Every 5 min: prod ×3 for 15s (random trigger) |
| 19 | Antiga | Primordial | Raro | Guardian | All Ígnea+Temporal+Celestial portals +30% |
| 20 | Nexar | Primordial | Épico | Special | Reduces prestige cost by 10% |
| 21 | Origin | Primordial | Legendario | Council | Unlocks 3rd Viajero slot per portal |
| 22 | Singularis | Singular | Legendario | Special | ×5 all portals for 1 min (1h cooldown) |
| 23 | The Cartographer | Unknown | Legendario | Council | Reveals hidden lore + permanent +15% all |
| 24 | The Weaver | Unknown | Legendario | Council | Connects 2 Viajeros to share abilities |

### Bond Pairs (Bond Web)
| Bond Name | Viajeros | Relationship | Bonus |
|---|---|---|---|
| Celestial Flame | Kael + Solara | Master and apprentice | Ígnea + Celestial ×2 |
| Eternal Loop | Chronus + Tempus | Same being in two times | Offline cap ×3 |
| Blood of the Abyss | Lyra + Abyssus | Mother and child | Expedition resources ×3 |
| Void Siblings | The Presence + Null | Fragments of the same being | All portals +25% |
| The Lost Origin | The Cartographer + The Weaver | Last two original Lords | Hidden lore + ×1.5 global |
| Chaos and Order | Fracture + Origin | Opposing forces | Shared active ability |

### Resonance System (0-9 per Viajero)
- Level 3: Personal history (3 lore panels)
- Level 6: Reactive dialogues unlock (comments game events via EventBus)
- Level 9: Cross-Viajero story chapter + max bonus unlocked

### Fusion System
3× same Common → 1 Raro (same dimension)
3× same Raro → 1 Épico
Available from Prestige Tier 2. Incentivizes expedition farming.

### Council of the Nexo
Separate slot for Legendary Viajeros only. Max 3 in Council. Council Viajeros give permanent global passives. Cannot be assigned to portals simultaneously.

### Gacha Rates
Common: 65%, Raro: 25%, Épico: 9%, Legendario: 1%
Pity: guaranteed Épico at 80 pulls. Soft pity starts increasing rates at pull 60.

---

## Portal Combos System

### Passive Combos (always active)
- 10 Ígnea + 10 Abismal → "Ignea-Abismal Fusion": both ×1.5
- 10 Abismal + 10 Temporal + 10 Vacío → "Dark Triad": ×5 to three portals
- All 8 portals at 10+ → "Total Convergence": global ×2

### Consumable Combos (sacrifice portals)
- Sacrifice 10 Ígnea → permanent click power ×5
- Sacrifice 5 Vacío → permanent offline cap +4h
- Sacrifice 25 Celestial → unlock "Primordial Resonance" (all Celestial+ portals ×2)

---

## Missions System

### Story Missions (20 permanent, guide player through first 2 weeks)
Examples:
- "The First Awakening" — Earn 1,000 energy → Reward: +click power
- "Lord of Fire" — Buy 10 Portal Ígnea → Reward: Kael arrives
- "The Fracture" — Buy first Portal Vacío → Reward: Lore fragment
- "Ascend" — Perform first Prestige → Reward: Embera arrives

### Daily Missions (3/day, reset 24h)
Types: click X times, earn X energy, buy X portals, send Viajero on expedition, buy 1 upgrade

### Weekly Mission (1/week)
Major goal with major reward (premium currency, Raro Viajero, or Prestige Fragment)

---

## Active Abilities

| Ability | Effect | Cooldown |
|---|---|---|
| Convergencia | ×2 production for 30s | 5 min |
| Tormenta de Clicks | Auto-click for 10s | 8 min |
| Pulso Nexo | Instant energy = 10 min production | 15 min |

Reduced by Vex (Temporal Viajero).

---

## Events System

### Calendar (never 3+ days without event)
- Mon-Wed: Mini-event (48h, "Dimensión Inestable", no exclusive character, soft currency rewards)
- Thu-Sun: Major event (72h, exclusive item or Raro Viajero)
- First Friday of month: Monthly mega-event starts (14 days, leaderboard, exclusive Épico Viajero)

### Event Mechanics
- Event currency earnable 90% F2P, final 10% requires paid packs
- "Almost there" UI when player is at 85%+ of event currency cap
- Push notification 24h before event ends (highest conversion moment)
- Public server progress bar toward mega-reward

### Event Types (rotating)
1. Unstable Dimension — special portal appears, click fast before it closes
2. Crisis Expedition — expeditions yield 3× rewards
3. The Vacant Advances — server-wide production goal, everyone wins together
4. Fractured Nexo — challenge run variant, special modifiers

---

## Login Streak

- Day 1: small energy bonus
- Day 2: upgrade discount
- Day 3: Viajero expedition materials
- Day 4: active ability cooldown -50% for 2h
- Day 5: premium currency (Cristales × 50)
- Day 6: Raro Viajero shard
- Day 7: major reward (guaranteed Épico Viajero shard or large Cristales pack)
- Grace period: 24h before streak resets (reduces frustration)

---

## Achievements (150+)

Categories:
- Clicker: 1K, 10K, 100K, 1M clicks
- Energy: milestones from 1K to 1 Nonillion
- Portals: 1/10/25/50/100 of each type
- Upgrades: buy 1/5/10/20/40 upgrades
- Prestige: complete Tier 1 through 7
- Viajeros: collect 1/5/10/24 unique Viajeros, max resonance on 1/5/all
- Story: unlock each lore fragment
- Playtime: 1h, 1 day, 1 week, 1 month active
- Bonds: unlock each bond pair
- Events: participate in 1/10/50 events
- Secret: hidden achievements (e.g., click at exactly midnight)

---

## Monetization

### Premium Currency: Cristales Dimensionales 💎

Crystal packs (IAP):
- Starter Pack: $0.99 — 💎80 (first purchase only, one-time)
- 💎80: $0.99
- 💎250: $2.99
- 💎550: $5.99
- 💎1,200: $11.99
- 💎2,600: $24.99
- 💎6,000: $49.99

**First Purchase Bonus**: Permanent banner shown until first buy — "Primera Recarga: Doble Cristales en tu primer pack. Siempre."

**Growth Fund** ($9.99): Get 💎100 now + 💎60 per prestige (up to 10 prestiges = 💎700 total)

### Passes (monthly)
- **Nexo Pass Básico** $4.99/month: +25% offline income, daily bonus mission, minor cosmetic
- **Nexo Pass Legendario** $9.99/month: everything above + guaranteed Épico Viajero per month + extra expedition slot + exclusive portal skin

Display: "Nexo Pass Legendario — Valor total: $74.99 — Precio: $9.99/mes"

### Other
- Viajero packs: 1 pull (💎100), 10 pulls (💎900, 1 free), 50 pulls (💎4,000, 10 free)
- Time boosters: 2h production instant (💎50), offline income x2 for 24h (💎80)
- Extra expedition slot: 💎200 permanent
- Cosmetics: Nexo button skins, UI themes, portal frame effects, Viajero portrait frames
- Rewarded ads: watch 30s → 2× production for 2h (free, up to 3/day)

---

## Technical Issues to Fix (Known)

1. **break_infinity.js on CDN** — must be downloaded and served locally for Capacitor offline use
2. **beforeunload unreliable on mobile** — add `visibilitychange` and Capacitor `pause` events
3. **confirm() blocked in Capacitor WebViews** — replace Game.reset() confirm with custom modal
4. **Save migration needed** — when baseCosts change (15→25 etc.), version 1 saves need migration to version 2
5. **state.portals hardcoded for 4 portals** — must explicitly init new portal IDs on load
6. **Cristales in localStorage** — hackable; add checksum validation short-term, server validation long-term
7. **Single game.js file** — must refactor to ES6 modules by Stage 3-4 at latest

---

## Architecture Plan (ES6 Modules)

```
js/
  data/        portals.js, upgrades.js, viajeros.js, story.js, missions.js, achievements.js
  core/        state.js, production.js, save.js, offline.js, unlocks.js
  systems/     prestige.js, viajeros.js, missions.js, achievements.js, events.js, store.js
  ui/          ui-core.js, ui-portals.js, ui-viajeros.js, ui-prestige.js, ui-store.js, ui-events.js
  utils/       format.js, analytics.js, eventbus.js
  game.js      (thin orchestrator, ~200 lines)
```

---

## Complete Roadmap — 20 Stages

### ✅ Stage 1 — Core Loop (DONE)
4 portals, 12 upgrades, offline income, save, tutorial, EventBus, analytics stub

### Stage 2 — Technical Fixes + Module Architecture
- Download break_infinity.js locally
- Replace confirm() with custom modal
- Add visibilitychange to SaveManager
- Refactor to ES6 module structure (data/, core/, ui/, utils/)
- Save migration system (version field → migrate on load)

### Stage 3 — QoL Essentials (Buy ×10/×MAX + Active Abilities)
- Buy ×10 / ×MAX buttons on all portals
- 3 active abilities with cooldown UI (Convergencia, Tormenta, Pulso)
- clickPower scaling (first click upgrades)
- Affordable indicator improvements

### Stage 4 — Deep Content (8 portals, 40 upgrades, global upgrades)
- 4 new portals: Celestial, Caos, Primordial, Singular with correct costs
- Update all baseCosts + costMultiplier 1.15→1.13 + save migration
- 2 extra upgrade tiers per portal (×10 at 25, ×25 at 50)
- 3 global upgrades (affect all portals, unlocked by totalEnergy)
- Click upgrades that scale clickPower with production

### Stage 5 — Tutorial Overhaul + Missions System
- Full tutorial redesign (5 steps guiding through portals + upgrades + first idle period)
- 20 story missions (permanent, guide first 2 weeks)
- 3 daily missions (reset 24h)
- 1 weekly mission
- "Next goal" always visible in UI
- Missions panel in UI
- **Daily mission streak**: complete all 3 daily missions X consecutive days → escalating bonus reward. Counter visible in UI.

### Stage 6 — Mini Story + Lore System
- Lore fragment data for all 8 portals + portal unlock moments
- Lore panel in UI (scrollable history of unlocked fragments)
- Story intro sequence: one paragraph before first click establishing player IS the Nexo awakening
- Each portal unlock = story moment + lore fragment
- Prestige milestone lore hooks (stubs for Stage 14)
- **Dimensional Rifts**: random 30s active click windows. A rift appears — clicking it generates bonus energy proportional to current production. Upgradeable (duration, multiplier). Keeps tapping relevant forever.

### Stage 7 — Prestige: Ascensión Dimensional (Tier 1 + 2)
- Prestige button unlocks when player has enough energy (formula TBD)
- Currency: Dimensional Fragments (amount based on progress scoring)
- Permanent upgrade tree (10 nodes for Tier 1-2: production, click, offline, cost reduction)
- Reset + rebuild state with prestige multipliers applied
- Story chapter unlocks at each prestige
- Prestige UI panel
- **Early prestige option**: all 8 portal types unlocked (≥1 each) → prestige available at ~40% Fragment yield. Lets casual players learn the mechanic without waiting weeks for Singular portal.

### Stage 8 — Viajeros System Core
- Viajero data (24 characters defined)
- Viajero arrival system (story-driven, tied to story missions + portal milestones)
- Guardian role: assign to portal (production multiplier OR auto-buy)
- Explorer role: send on expedition (X hours, returns with loot)
- Expedition loot tables defined (includes artifact drops)
- Viajero panel UI
- Viajero tutorial (mini-tutorial on first arrival)
- **Gacha pull system**: single pull + 10-pull UI, pity counter, pull history log. Crystals from Stage 16 but pull UI built here.
- **Viajero Artifacts**: 3 slots per Viajero (Head/Weapon/Relic). Drop from expeditions at varying rarities. Stat bonuses: production %, expedition speed, cooldown reduction, click power. Upgrade by feeding duplicates. Permanent progression sink beyond resonance 9.

### Stage 9 — Viajeros Advanced (Bond Web + Resonance + Dialogues)
- Resonance system (0-9 per Viajero, tracks usage)
- Lore panels unlocking at resonance 3, 6, 9
- Reactive dialogues via EventBus (prestige, portal milestones, long sessions, comeback)
- Bond Web UI (visual display of all bonds, locked/unlocked)
- 6 bond pairs with named relationships + bonus
- Personal Quest Chains (3 missions per Viajero)
- Fusion system (3× same rarity → 1 higher rarity)
- Council of the Nexo slot (Legendaries only)

### Stage 10 — Portal Combos + Fusion
- Passive combo detection (X portal A + X portal B = bonus)
- Consumable combos (sacrifice portals for permanent bonus)
- Combo display in UI
- Balancing for all 8 portal combinations

### Stage 11 — Login Streak + Daily Return
- 7-day login streak with escalating rewards
- 24h grace period
- Push notification setup (Capacitor local notifications stub)
- Return to game modal (shows streak status + offline income together)

### Stage 11b — Guild System
- Player creates or joins a guild (name + tag, up to 30 members)
- Guild chest: fills passively with combined member production → all members collect daily rewards
- Weekly guild goal: combined portal purchases or energy produced → milestone rewards for all members
- Guild chat (basic text)
- Guild rank: leaderboard of top guilds by combined production (Firebase Firestore in Stage 17, local mock during dev)
- **Weekly Dimensional Ranking**: individual leaderboard by energy produced this week. Top 10% receive crystal bonus. Creates soft competitive pressure that drives spending.

### Stage 12 — Achievements (150+)
- Achievement data (150+ defined)
- Achievement panel UI with completion %
- Categories: clicks, energy, portals, upgrades, prestige, viajeros, story, bonds, playtime, events, secrets
- Small reward per achievement
- Secret/hidden achievements

### Stage 13 — Events System ("Dimensiones Inestables")
- 4 event types rotating (Unstable Dimension, Crisis Expedition, The Vacant Advances, Fractured Nexo)
- Event calendar system (Mon-Wed mini, Thu-Sun major, monthly mega)
- Event currency + reward track
- "Almost there" UI at 85% completion
- Push notification 24h before event ends (stub for mobile)
- Monthly mega-event with leaderboard (local mock for now)
- **Limited-time Viajero banners**: each major event features 1 limited Viajero available only during the event. Rotates into permanent pool after 3 months. Primary urgency driver for gacha spending.

### Stage 14 — Prestige Tiers 3-7 (Full Story)
- Story content for Tiers 3-7 (El Vacante, El Origen, Artefactos, Sacrificio, Último Nexo)
- Epic Expeditions system (24-48h, story artifacts, risk mechanics)
- Viajero La Presencia fusion sequence (story moment)
- Final Nexo visual transformation
- Credits sequence + Viajero endings
- New Game+ definition and implementation

### Stage 15 — Challenge Runs
- 3 challenge types (restriction-based runs)
- Challenge-specific rewards (unique multipliers, exclusive cosmetics)
- Challenge panel UI

### Stage 16 — Monetization Integration
- Cristales Dimensionales currency system with localStorage checksum
- Viajero gacha pull system (correct pity at 80 pulls)
- Crystal pack UI (prices, first purchase bonus banner)
- Growth Fund pack
- Nexo Pass Basic ($4.99) and Legendary ($9.99) system
- Time booster items
- Rewarded ads integration (3/day cap)
- Store UI panel

### Stage 17 — Settings + Analytics + Cloud Saves
- Settings screen (sound, notifications, language placeholder, reset, privacy)
- Firebase Analytics (free, replaces GameAnalytics stub)
- funnel events: new_game, first_portal, first_prestige, first_purchase, d1/d7/d30 retention markers
- Cloud saves (account system or anonymous ID + simple backend)
- Privacy Policy + TOS pages (required for app stores)
- Gacha probability disclosure screen (app store requirement)

### Stage 18 — Mobile Conversion (Capacitor)
- Responsive CSS for mobile portrait layout
- Touch optimizations (larger tap targets, touch feedback)
- Capacitor project setup (iOS + Android)
- Haptic feedback on click, purchase, achievement unlock
- Portrait orientation lock (ScreenOrientation plugin)
- AdMob integration for rewarded ads (replaces stub)
- Push notifications (local: expedition returns, event endings, login streak)
- App icon + splash screen

### Stage 19 — App Store Submission
- iOS App Store submission
- Google Play submission
- Age rating questionnaire (gacha → 12+ typically)
- Store screenshots + descriptions (Spanish + English)
- Beta testing (TestFlight + internal track)

### Stage 20 — Polish + Live Operations
- Sound effects + background music (ambient dimensional theme)
- Seasonal events (Christmas, Halloween, CNY)
- Social sharing (Web Share API: "I just reached Prestige 3!")
- Balance tuning based on analytics data
- Performance audit (animations, memory leaks, battery usage)
- Ongoing: new Viajeros, new event types, story DLC

---

## Estimated Player Timeline

| Player Type | First Prestige | See Full Story | All Content |
|---|---|---|---|
| Casual (30-60min/day) | Day 5-7 | Month 5-6 | Month 8-9 |
| Medium (1-2h/day) | Day 3-5 | Month 3-4 | Month 5-6 |
| Hardcore (3h+/day) | Day 2-3 | Week 6-8 | Month 3-4 |

Key monetization window: Day 7-21 (player is engaged but wants to progress faster)
