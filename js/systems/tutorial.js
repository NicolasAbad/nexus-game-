// ── Sistema de tutorial ───────────────────────────────────────────────────────
//    Stage 5 reemplaza esto con un tutorial completo de 5+ pasos

import { t } from '../utils/i18n.js'

const TUTORIAL_STEP_COUNT = 3  // índices 0-2; paso 3 = null (ocultar)

export const Tutorial = {
  advance(state, toStep) {
    if (state.tutorialStep === -1) return
    if (toStep <= state.tutorialStep) return
    state.tutorialStep = toStep
    this._render(state)
  },

  complete(state) {
    state.tutorialStep = -1
    this._render(state)
  },

  _render(state) {
    const banner = document.getElementById('tutorial-banner')
    const text   = document.getElementById('tutorial-text')
    const step   = state.tutorialStep

    if (step === -1 || step >= TUTORIAL_STEP_COUNT) {
      banner.classList.add('hidden')
      return
    }

    text.textContent = t(`tutorial.step${step}`)
    banner.classList.remove('hidden')
  },
}
