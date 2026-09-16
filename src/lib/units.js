// Lightweight, approximate US customary <-> Metric conversion for display
// purposes only. Quantities are always *stored* exactly as the recipe author
// entered them; conversion only affects what is rendered on screen when a
// recipe's "measurement system" preference is set to the opposite system.

const MASS_TO_GRAMS = { oz: 28.3495, lb: 453.592, g: 1, kg: 1000 }
const VOLUME_TO_ML = { tsp: 4.92892, tbsp: 14.7868, cup: 236.588, ml: 1, L: 1000 }

const US_MASS = ['oz', 'lb']
const METRIC_MASS = ['g', 'kg']
const US_VOLUME = ['tsp', 'tbsp', 'cup']
const METRIC_VOLUME = ['ml', 'L']

function round(value) {
  if (!Number.isFinite(value)) return value
  const rounded = Math.round(value * 100) / 100
  return rounded
}

function formatNumber(value) {
  const r = round(value)
  if (Number.isInteger(r)) return String(r)
  return String(r)
}

export function convertQuantity(quantity, unit) {
  const qty = parseFloat(quantity)
  if (!Number.isFinite(qty) || !unit) return { quantity, unit }

  if (US_MASS.includes(unit) || METRIC_MASS.includes(unit)) {
    const grams = qty * MASS_TO_GRAMS[unit]
    const toMetric = US_MASS.includes(unit)
    if (toMetric) {
      return grams >= 1000 ? { quantity: formatNumber(grams / 1000), unit: 'kg' } : { quantity: formatNumber(grams), unit: 'g' }
    }
    const lb = grams / MASS_TO_GRAMS.lb
    return lb >= 1 ? { quantity: formatNumber(lb), unit: 'lb' } : { quantity: formatNumber(grams / MASS_TO_GRAMS.oz), unit: 'oz' }
  }

  if (US_VOLUME.includes(unit) || METRIC_VOLUME.includes(unit)) {
    const ml = qty * VOLUME_TO_ML[unit]
    const toMetric = US_VOLUME.includes(unit)
    if (toMetric) {
      return ml >= 1000 ? { quantity: formatNumber(ml / 1000), unit: 'L' } : { quantity: formatNumber(ml), unit: 'ml' }
    }
    if (ml >= 177) return { quantity: formatNumber(ml / VOLUME_TO_ML.cup), unit: 'cup' }
    if (ml >= 11) return { quantity: formatNumber(ml / VOLUME_TO_ML.tbsp), unit: 'tbsp' }
    return { quantity: formatNumber(ml / VOLUME_TO_ML.tsp), unit: 'tsp' }
  }

  return { quantity, unit }
}

export function unitSystemOf(unit) {
  if (US_MASS.includes(unit) || US_VOLUME.includes(unit)) return 'us'
  if (METRIC_MASS.includes(unit) || METRIC_VOLUME.includes(unit)) return 'metric'
  return 'neutral'
}

export function displayQuantity(quantity, unit, targetSystem) {
  const system = unitSystemOf(unit)
  if (system === 'neutral' || system === targetSystem) {
    return { quantity, unit }
  }
  return convertQuantity(quantity, unit)
}
