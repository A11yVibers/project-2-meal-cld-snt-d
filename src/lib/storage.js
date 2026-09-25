// Small helpers for persisting JSON-serializable state to localStorage so
// user recipes, meal-plan changes, and shopping-list state survive a page
// refresh.
const PREFIX = 'mealPlanner:'

export function loadJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch (err) {
    console.warn(`Failed to read "${key}" from localStorage`, err)
    return fallback
  }
}

export function saveJSON(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch (err) {
    console.warn(`Failed to write "${key}" to localStorage`, err)
  }
}

export const STORAGE_KEYS = {
  userRecipes: 'userRecipes.v1',
  plan: 'plan.v1',
  shopping: 'shopping.v1',
}
