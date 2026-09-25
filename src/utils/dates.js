// Lightweight date helpers for the weekly planner. Weeks run Monday -> Sunday.

export function toIsoDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseIsoDate(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// Returns the ISO date string (YYYY-MM-DD) of the Monday that starts the
// week containing `date`.
export function startOfWeek(date = new Date()) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const dow = d.getDay() // 0 = Sunday .. 6 = Saturday
  const diffToMonday = dow === 0 ? -6 : 1 - dow
  d.setDate(d.getDate() + diffToMonday)
  return toIsoDate(d)
}

export function addDays(iso, days) {
  const d = parseIsoDate(iso)
  d.setDate(d.getDate() + days)
  return toIsoDate(d)
}

export function addWeeks(iso, weeks) {
  return addDays(iso, weeks * 7)
}

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function formatShortDate(iso) {
  const d = parseIsoDate(iso)
  return `${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`
}

export function formatWeekRange(weekStartIso) {
  const start = parseIsoDate(weekStartIso)
  const end = parseIsoDate(addDays(weekStartIso, 6))
  const startLabel = `${MONTHS_SHORT[start.getMonth()]} ${start.getDate()}`
  const endLabel =
    start.getMonth() === end.getMonth()
      ? `${end.getDate()}`
      : `${MONTHS_SHORT[end.getMonth()]} ${end.getDate()}`
  return `${startLabel} - ${endLabel}, ${end.getFullYear()}`
}

export function formatLongDate(iso) {
  const d = parseIsoDate(iso)
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
}

export const CURRENT_WEEK_START = startOfWeek(new Date())
