export const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const MEAL_SLOTS = ['Breakfast', 'Lunch', 'Dinner', 'Snack']

export function startOfWeek(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay() // 0 = Sunday
  const diff = (day === 0 ? -6 : 1) - day
  d.setDate(d.getDate() + diff)
  return d
}

export function addDays(date, amount) {
  const d = new Date(date)
  d.setDate(d.getDate() + amount)
  return d
}

export function addWeeks(date, amount) {
  return addDays(date, amount * 7)
}

export function toKey(date) {
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function fromKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function weekdayIndexFromKey(key) {
  const d = fromKey(key)
  const day = d.getDay()
  return day === 0 ? 6 : day - 1
}

export function formatShort(date) {
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function formatWeekRange(weekStartDate) {
  const end = addDays(weekStartDate, 6)
  const now = new Date()
  const yearSuffix = weekStartDate.getFullYear() !== now.getFullYear() ? `, ${weekStartDate.getFullYear()}` : ''
  return `${formatShort(weekStartDate)} – ${formatShort(end)}${yearSuffix}`
}

export function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}
