import { ingredientById, SHOPPING_CATEGORIES } from '../data/lookups.js'
import { PLANNER_SLOTS } from '../data/lookups.js'

export function pantryKeyFor(item) {
  return (item.ingredientId || item.ingredientName || '').toLowerCase()
}

// Pantry keys are per-ingredient (not per unit), so "I already have this"
// stays true across recipes/weeks regardless of which unit a given recipe
// happens to use.
export function combinedPantryKey(entry) {
  return (entry.ingredientId || entry.name || '').toLowerCase()
}

function itemKey(item) {
  return `${pantryKeyFor(item)}::${(item.unit || '').toLowerCase()}`
}

// Builds a categorized, combined shopping list from every recipe currently
// assigned to slots within a single week's plan.
export function buildShoppingList(weekPlan, recipesById) {
  const combined = new Map()

  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const day = weekPlan?.[dayIndex]
    if (!day) continue
    for (const slot of PLANNER_SLOTS) {
      const assignment = day[slot]
      if (!assignment?.recipeId) continue
      const recipe = recipesById.get(assignment.recipeId)
      if (!recipe) continue
      if (recipe.options && recipe.options.includeInShoppingList === false) continue

      for (const section of recipe.ingredientSections || []) {
        for (const item of section.items || []) {
          const key = itemKey(item)
          const shoppingCategory = ingredientById.get(item.ingredientId)?.shoppingCategory || 'Other'
          if (!combined.has(key)) {
            combined.set(key, {
              key,
              ingredientId: item.ingredientId,
              name: item.ingredientName,
              unit: item.unit || '',
              quantity: 0,
              hasQuantity: false,
              optionalOnly: true,
              category: SHOPPING_CATEGORIES.includes(shoppingCategory) ? shoppingCategory : 'Other',
              recipes: new Set(),
            })
          }
          const entry = combined.get(key)
          if (typeof item.quantity === 'number' && Number.isFinite(item.quantity)) {
            entry.quantity += item.quantity
            entry.hasQuantity = true
          }
          if (!item.optional) entry.optionalOnly = false
          entry.recipes.add(recipe.title)
        }
      }
    }
  }

  const items = [...combined.values()].map((entry) => ({
    ...entry,
    recipes: [...entry.recipes],
  }))

  const byCategory = new Map(SHOPPING_CATEGORIES.map((c) => [c, []]))
  for (const item of items) {
    byCategory.get(item.category).push(item)
  }
  for (const list of byCategory.values()) {
    list.sort((a, b) => a.name.localeCompare(b.name))
  }

  return SHOPPING_CATEGORIES.map((category) => ({ category, items: byCategory.get(category) })).filter(
    (group) => group.items.length > 0
  )
}
