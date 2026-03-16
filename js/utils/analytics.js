// ── Analytics stub — conectar Firebase en Stage 17 ───────────────────────────

export const Analytics = {
  _on: false,

  init(key) {
    if (!key) return
    // TODO Stage 17: Firebase Analytics init
    this._on = true
  },

  track(event, data = {}) {
    if (this._on) console.log('[Analytics]', event, data)
  },
}
