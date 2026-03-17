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
//      { type: 'energy', amount: N }
//      { type: 'productionMinutes', minutes: N }  ← calculado al colectar

// ── 20 Misiones de historia ───────────────────────────────────────────────────
export const HISTORY_MISSIONS = [
  { id: 'h1',  trigger: { type: 'totalClicks',    count: 1          }, reward: { type: 'energy', amount: 50           } },
  { id: 'h2',  trigger: { type: 'totalEnergy',    amount: 100       }, reward: { type: 'energy', amount: 200          } },
  { id: 'h3',  trigger: { type: 'totalPortals',   count: 1          }, reward: { type: 'energy', amount: 500          } },
  { id: 'h4',  trigger: { type: 'totalPortals',   count: 5          }, reward: { type: 'energy', amount: 2000         } },
  { id: 'h5',  trigger: { type: 'upgradesOwned',  count: 1          }, reward: { type: 'energy', amount: 5000         } },
  { id: 'h6',  trigger: { type: 'production',     rate: 1           }, reward: { type: 'energy', amount: 10000        } },
  { id: 'h7',  trigger: { type: 'portalUnlocked', portalId: 'abismal'  }, reward: { type: 'energy', amount: 25000    } },
  { id: 'h8',  trigger: { type: 'totalEnergy',    amount: 10000     }, reward: { type: 'energy', amount: 50000        } },
  { id: 'h9',  trigger: { type: 'totalPortals',   count: 25         }, reward: { type: 'energy', amount: 100000       } },
  { id: 'h10', trigger: { type: 'upgradesOwned',  count: 3          }, reward: { type: 'energy', amount: 250000       } },
  { id: 'h11', trigger: { type: 'portalUnlocked', portalId: 'temporal' }, reward: { type: 'energy', amount: 500000   } },
  { id: 'h12', trigger: { type: 'production',     rate: 100         }, reward: { type: 'energy', amount: 1000000      } },
  { id: 'h13', trigger: { type: 'totalPortals',   count: 50         }, reward: { type: 'energy', amount: 5000000      } },
  { id: 'h14', trigger: { type: 'portalUnlocked', portalId: 'vacio'    }, reward: { type: 'energy', amount: 10000000 } },
  { id: 'h15', trigger: { type: 'totalEnergy',    amount: 1000000   }, reward: { type: 'energy', amount: 25000000     } },
  { id: 'h16', trigger: { type: 'production',     rate: 1000        }, reward: { type: 'energy', amount: 50000000     } },
  { id: 'h17', trigger: { type: 'totalPortals',   count: 100        }, reward: { type: 'energy', amount: 100000000    } },
  { id: 'h18', trigger: { type: 'portalUnlocked', portalId: 'celestial'}, reward: { type: 'energy', amount: 500000000 } },
  { id: 'h19', trigger: { type: 'totalEnergy',    amount: 100000000 }, reward: { type: 'energy', amount: 1000000000   } },
  { id: 'h20', trigger: { type: 'production',     rate: 10000       }, reward: { type: 'energy', amount: 5000000000  } },
]

// ── 3 Misiones diarias (reset a medianoche) ────────────────────────────────────
export const DAILY_MISSIONS = [
  { id: 'd1', trigger: { type: 'clicksToday',       count: 100 }, reward: { type: 'productionMinutes', minutes: 2 } },
  { id: 'd2', trigger: { type: 'portalsBoughtToday', count: 25  }, reward: { type: 'productionMinutes', minutes: 5 } },
  { id: 'd3', trigger: { type: 'abilitiesUsedToday', count: 3   }, reward: { type: 'productionMinutes', minutes: 3 } },
]

// ── 1 Misión semanal (reset cada domingo a medianoche) ─────────────────────────
export const WEEKLY_MISSION =
  { id: 'w1', trigger: { type: 'portalsBoughtThisWeek', count: 100 }, reward: { type: 'productionMinutes', minutes: 30 } }
