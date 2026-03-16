// ── Decimal fallback — se activa si break_infinity.js no cargó ───────────────
//    Nota: el fallback usa Number nativo — se rompe con >9 cuatrillones.
//    Para producción siempre servir libs/break_infinity.min.js localmente.

if (typeof Decimal === 'undefined') {
  window.Decimal = class {
    constructor(n) { this.v = Number(n) || 0 }
    add(b) { return new Decimal(this.v + Number(b)) }
    sub(b) { return new Decimal(this.v - Number(b)) }
    mul(b) { return new Decimal(this.v * Number(b)) }
    div(b) { return new Decimal(this.v / Number(b)) }
    pow(b) { return new Decimal(Math.pow(this.v, Number(b))) }
    gte(b) { return this.v >= Number(b) }
    gt(b)  { return this.v >  Number(b) }
    lt(b)  { return this.v <  Number(b) }
    lte(b) { return this.v <= Number(b) }
    eq(b)  { return this.v === Number(b) }
    isNaN()          { return isNaN(this.v) }
    toNumber()       { return this.v }
    toString()       { return String(this.v) }
    toExponential(n) { return this.v.toExponential(n) }
  }
}
