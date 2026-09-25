export const SPICE_LEVELS = [
  { value: 0, label: 'Mild' },
  { value: 1, label: 'Light heat' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'Medium-hot' },
  { value: 4, label: 'Hot' },
  { value: 5, label: 'Very spicy' },
]

export function spiceLevelLabel(value) {
  return SPICE_LEVELS.find((s) => s.value === Number(value))?.label ?? 'Mild'
}

// Meal slots used by the weekly planner. Ids match the meal_types.csv
// vocabulary so recipes' primary meal type can be cross-referenced, but the
// planner only exposes these four slots per day.
export const MEAL_SLOTS = [
  { id: 'MT01', key: 'breakfast', label: 'Breakfast' },
  { id: 'MT02', key: 'lunch', label: 'Lunch' },
  { id: 'MT03', key: 'dinner', label: 'Dinner' },
  { id: 'MT04', key: 'snack', label: 'Snack' },
]

export const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const DAY_LABELS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// Preset accent color swatches offered in the recipe form. Includes the two
// colors already used by the seed recipes plus a handful of complementary
// options so user-created recipes can stand out on their cards.
export const ACCENT_COLOR_PRESETS = [
  { value: '#D97757', label: 'Terracotta' },
  { value: '#8A9A5B', label: 'Sage' },
  { value: '#4C7CA8', label: 'Slate blue' },
  { value: '#C9A227', label: 'Amber' },
  { value: '#B0524D', label: 'Brick' },
  { value: '#6B5B95', label: 'Plum' },
  { value: '#3C8D77', label: 'Teal' },
  { value: '#A85C8A', label: 'Berry' },
]

export const DEFAULT_ACCENT_COLOR = ACCENT_COLOR_PRESETS[0].value

// Infers a meal slot key from an hour-of-day (0-23), used when a recipe is
// scheduled with a specific date & time rather than a week/day/slot combo.
export function inferSlotFromHour(hour) {
  if (hour < 11) return 'breakfast'
  if (hour < 16) return 'lunch'
  if (hour < 21) return 'dinner'
  return 'snack'
}
