// ── Datos de misiones ─────────────────────────────────────────────────────────
//    Texto en js/data/strings/es.js y en.js via t('mission.' + id + '.title')
//
//    Trigger types (history):
//      totalClicks, totalEnergy, totalPortals, portalUnlocked,
//      upgradesOwned, production
//    Trigger types (daily):
//      clicksToday, portalsBoughtToday, abilitiesUsedToday
//    Trigger types (weekly):
//      portalsBoughtThisWeek
//
//    Rewards:
//      { type: 'energy', amount: N }              ← energía fija
//      { type: 'productionMinutes', minutes: N }  ← calculado al colectar
//
//    BALANCE: h1-h2 usan energía fija porque la producción es 0 al inicio.
//    h3-h20 usan productionMinutes para que la recompensa escale con el
//    progreso del jugador y no cree el efecto cascada.

// ── 20 Misiones de historia ───────────────────────────────────────────────────
export const HISTORY_MISSIONS = [
  { id: 'h1',  trigger: { type: 'totalClicks',    count: 1          }, reward: { type: 'energy',            amount:  25          } },
  { id: 'h2',  trigger: { type: 'totalEnergy',    amount: 100       }, reward: { type: 'energy',            amount:  50          } },
  { id: 'h3',  trigger: { type: 'totalPortals',   count: 1          }, reward: { type: 'productionMinutes', minutes:  5          } },
  { id: 'h4',  trigger: { type: 'totalPortals',   count: 5          }, reward: { type: 'productionMinutes', minutes: 10          } },
  { id: 'h5',  trigger: { type: 'upgradesOwned',  count: 1          }, reward: { type: 'productionMinutes', minutes: 15          } },
  { id: 'h6',  trigger: { type: 'production',     rate: 1           }, reward: { type: 'productionMinutes', minutes: 20          } },
  { id: 'h7',  trigger: { type: 'portalUnlocked', portalId: 'abismal'  }, reward: { type: 'productionMinutes', minutes: 30       } },
  { id: 'h8',  trigger: { type: 'totalEnergy',    amount: 10000     }, reward: { type: 'productionMinutes', minutes: 30          } },
  { id: 'h9',  trigger: { type: 'totalPortals',   count: 25         }, reward: { type: 'productionMinutes', minutes: 45          } },
  { id: 'h10', trigger: { type: 'upgradesOwned',  count: 3          }, reward: { type: 'productionMinutes', minutes: 60          } },
  { id: 'h11', trigger: { type: 'portalUnlocked', portalId: 'temporal' }, reward: { type: 'productionMinutes', minutes: 60      } },
  { id: 'h12', trigger: { type: 'production',     rate: 100         }, reward: { type: 'productionMinutes', minutes: 90          } },
  { id: 'h13', trigger: { type: 'totalPortals',   count: 50         }, reward: { type: 'productionMinutes', minutes: 120         } },
  { id: 'h14', trigger: { type: 'portalUnlocked', portalId: 'vacio'    }, reward: { type: 'productionMinutes', minutes: 120     } },
  { id: 'h15', trigger: { type: 'totalEnergy',    amount: 1000000   }, reward: { type: 'productionMinutes', minutes: 150         } },
  { id: 'h16', trigger: { type: 'production',     rate: 1000        }, reward: { type: 'productionMinutes', minutes: 180         } },
  { id: 'h17', trigger: { type: 'totalPortals',   count: 100        }, reward: { type: 'productionMinutes', minutes: 180         } },
  { id: 'h18', trigger: { type: 'portalUnlocked', portalId: 'celestial'}, reward: { type: 'productionMinutes', minutes: 240     } },
  { id: 'h19', trigger: { type: 'totalEnergy',    amount: 100000000 }, reward: { type: 'productionMinutes', minutes: 240         } },
  { id: 'h20', trigger: { type: 'production',     rate: 10000       }, reward: { type: 'productionMinutes', minutes: 300         } },
]

// ── 3 Misiones diarias (reset a medianoche) ────────────────────────────────────
export const DAILY_MISSIONS = [
  { id: 'd1', trigger: { type: 'clicksToday',        count: 100 }, reward: { type: 'productionMinutes', minutes: 2  } },
  { id: 'd2', trigger: { type: 'portalsBoughtToday', count: 25  }, reward: { type: 'productionMinutes', minutes: 5  } },
  { id: 'd3', trigger: { type: 'abilitiesUsedToday', count: 3   }, reward: { type: 'productionMinutes', minutes: 3  } },
]

// ── 1 Misión semanal (reset cada domingo a medianoche) ─────────────────────────
export const WEEKLY_MISSION =
  { id: 'w1', trigger: { type: 'portalsBoughtThisWeek', count: 100 }, reward: { type: 'productionMinutes', minutes: 30 } }
