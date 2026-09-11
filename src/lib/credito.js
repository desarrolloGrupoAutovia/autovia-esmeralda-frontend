/* Cotizador Autovía Credit — misma fórmula que usa autovia-dashboard/api/creditos.js
   y los mockups de Eduardo: tasa fija anual + IVA sobre intereses, más GPS,
   seguro de vida, comisión de apertura y seguro de unidad. */

export const PARAMS_CREDITO = {
  tasaAnual: 0.316,
  iva: 0.16,
  gps: 395,
  seguroVida: 195,
  comisionApertura: 0.03,
  seguroUnidadPct: 0.0619,
};

export const ENGANCHE_MINIMO_PCT = 35;

export function mxn(n) {
  return '$' + Math.round(n).toLocaleString('es-MX');
}

/* price: precio de contado. downPct: % de enganche (20-80). plazo: meses. */
export function cotizar(price, downPct, plazo) {
  const P = PARAMS_CREDITO;
  const rMes = (P.tasaAnual / 12) * (1 + P.iva);
  const enganche = (price * downPct) / 100;
  const financiado = price - enganche;
  const pmt = financiado > 0 ? (financiado * rMes) / (1 - Math.pow(1 + rMes, -plazo)) : 0;
  const extras = P.gps + P.seguroVida;
  const total = Math.round(pmt + extras);
  const comision = financiado * P.comisionApertura;
  const seguroUnidad = price * P.seguroUnidadPct;
  return {
    rMes, enganche, financiado, extras, total,
    base: total - extras,
    comision, seguroUnidad,
    inicial: enganche + comision + seguroUnidad,
    sumaPagos: total * plazo,
    desembolso: enganche + comision + seguroUnidad + total * plazo,
  };
}

/* Mensualidad estimada rápida para tarjetas de catálogo: enganche mínimo, a 48 meses. */
export function mensualidadEstimada(price) {
  return cotizar(price, ENGANCHE_MINIMO_PCT, 48).total;
}
