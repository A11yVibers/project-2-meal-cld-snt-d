export const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const DAY_LABELS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function toIsoDate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// Returns the Monday (as an ISO date string) of the week containing `date`.
export function getWeekStart(date = new Date()) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay() // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return toIsoDate(d)
}

export function addDaysToIso(isoDate, days) {
  const d = new Date(`${isoDate}T00:00:00`)
  d.setDate(d.getDate() + days)
  return toIsoDate(d)
}

export function addWeeksToIso(isoDate, weeks) {
  return addDaysToIso(isoDate, weeks * 7)
}

export function weekDates(weekStartIso) {
  return Array.from({ length: 7 }, (_, i) => addDaysToIso(weekStartIso, i))
}

export function formatFriendlyDate(isoDate) {
  if (!isoDate) return ''
  const d = new Date(`${isoDate}T00:00:00`)
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

export function formatWeekRangeLabel(weekStartIso) {
  const start = new Date(`${weekStartIso}T00:00:00`)
  const end = new Date(`${weekStartIso}T00:00:00`)
  end.setDate(end.getDate() + 6)
  const startLabel = start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  const endLabel = end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
  return `${startLabel} - ${endLabel}`
}

export function isSameWeek(isoDate, weekStartIso) {
  return getWeekStart(new Date(`${isoDate}T00:00:00`)) === weekStartIso
}

export function todayIso() {
  return toIsoDate(new Date())
}

export function dayIndexInWeek(weekStartIso, dateIso) {
  const start = new Date(`${weekStartIso}T00:00:00`)
  const date = new Date(`${dateIso}T00:00:00`)
  const diff = Math.round((date - start) / 86400000)
  return Math.min(6, Math.max(0, diff))
}
