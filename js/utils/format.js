// ── Formato de números y tiempo ───────────────────────────────────────────────

const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc']

export function fmt(decimal) {
  if (!decimal || decimal.isNaN()) return '0'
  const n = decimal.toNumber()

  if (n < 0)    return '-' + fmt(new Decimal(-n))
  if (n < 1)    return n.toFixed(2)
  if (n < 1000) return Math.floor(n).toString()

  const exp = Math.floor(Math.log10(n) / 3)

  if (exp < SUFFIXES.length) {
    const val      = n / Math.pow(1000, exp)
    const decimals = val < 10 ? 2 : val < 100 ? 1 : 0
    return val.toFixed(decimals) + SUFFIXES[exp]
  }

  return decimal.toExponential(2)
}

export function fmtTime(seconds) {
  if (seconds < 60)   return `${Math.round(seconds)}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}
