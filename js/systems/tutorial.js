// ── Sistema de tutorial ───────────────────────────────────────────────────────
//    Stage 5 reemplaza esto con un tutorial completo de 5+ pasos

const TUTORIAL_STEPS = [
  '⬡ Hacé click en el Nexo para generar tu primera Energía',
  '✦ ¡Comprá tu primer Portal para automatizar la producción!',
  '⚙ Comprá más portales — cuando tengas suficientes, aparecerán Mejoras',
  null,  // null = ocultar banner
]

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

    if (step === -1 || TUTORIAL_STEPS[step] === null) {
      banner.classList.add('hidden')
      return
    }

    text.textContent = TUTORIAL_STEPS[step]
    banner.classList.remove('hidden')
  },
}
