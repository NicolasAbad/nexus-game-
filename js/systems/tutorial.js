// ── Sistema de tutorial ───────────────────────────────────────────────────────
//    Stage 5 reemplaza esto con un tutorial completo de 5+ pasos

import { t } from '../utils/i18n.js'

const TUTORIAL_STEP_COUNT = 5  // índices 0-4; step -1 = completado

export const Tutorial = {
  advance(state, toStep) {
    if (state.tutorialStep === -1) return
    if (toStep <= state.tutorialStep) return
    state.tutorialStep = toStep
    this.render(state)
    // Step 4 es solo informativo — se auto-completa después de 4s
    if (toStep === 4) {
      setTimeout(() => {
        if (state.tutorialStep === 4) this.complete(state)
      }, 4000)
    }
  },

  complete(state) {
    state.tutorialStep = -1
    this.render(state)
  },

  render(state) {
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
