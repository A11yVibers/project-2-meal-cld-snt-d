import { shoppingCategoryForIngredient, SHOPPING_CATEGORY_ORDER } from '../data/lookups.js'

function normalizedIngredientKey(item) {
  return item.ingredientId || `name:${String(item.ingredientName || '').trim().toLowerCase()}`
}

function parseQty(qty) {
  const n = Number(qty)
  return Number.isFinite(n) ? n : null
}

// Builds a categorized, de-duplicated shopping list from the recipes
// currently assigned to a set of planner slots (typically "this week").
// `assignments` is an array of { recipeId } (or anything with a recipeId).
export function buildShoppingList(recipes, assignments) {
  const recipesById = new Map(recipes.map((r) => [r.id, r]))
  const groups = new Map()

  const usedRecipeIds = new Set(assignments.map((a) => a.recipeId).filter(Boolean))

  for (const recipeId of usedRecipeIds) {
    const recipe = recipesById.get(recipeId)
    if (!recipe) continue
    if (recipe.options && recipe.options.includeInShoppingList === false) continue

    for (const section of recipe.ingredientSections ?? []) {
      for (const item of section.items ?? []) {
        const ingredientKey = normalizedIngredientKey(item)
        const unitKey = String(item.unit || '').trim().toLowerCase()
        const groupKey = `${ingredientKey}::${unitKey}`

        if (!groups.has(groupKey)) {
          groups.set(groupKey, {
            key: groupKey,
            ingredientKey,
            name: item.ingredientName || 'Ingredient',
            unit: item.unit || '',
            quantity: 0,
            quantityIsExact: true,
            optional: true,
            recipeTitles: new Set(),
          })
        }
        const group = groups.get(groupKey)
        const qty = parseQty(item.quantity)
        if (qty == null) group.quantityIsExact = false
        else group.quantity += qty
        if (!item.optional) group.optional = false
        group.recipeTitles.add(recipe.title)
      }
    }
  }

  const byCategory = new Map()
  for (const group of groups.values()) {
    const category = shoppingCategoryForIngredient({
      ingredientId: group.ingredientKey.startsWith('name:') ? null : group.ingredientKey,
      ingredientName: group.name,
    })
    if (!byCategory.has(category)) byCategory.set(category, [])
    byCategory.get(category).push({
      key: group.key,
      ingredientKey: group.ingredientKey,
      name: group.name,
      unit: group.unit,
      quantity: group.quantityIsExact ? Math.round(group.quantity * 100) / 100 : null,
      optional: group.optional,
      recipeTitles: Array.from(group.recipeTitles).sort(),
    })
  }

  const categories = Array.from(byCategory.entries())
    .map(([category, items]) => ({
      category,
      items: items.sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => {
      const ai = SHOPPING_CATEGORY_ORDER.indexOf(a.category)
      const bi = SHOPPING_CATEGORY_ORDER.indexOf(b.category)
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi)
    })

  return categories
}
