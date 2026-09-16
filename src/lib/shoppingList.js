export const SHOPPING_CATEGORY_ORDER = [
  'Produce',
  'Meat & seafood',
  'Dairy & eggs',
  'Grains & pantry',
  'Oils & condiments',
  'Canned & jarred',
  'Spices',
  'Other',
]

function keyFor(item) {
  const idOrName = (item.ingredientId || item.ingredientName || '').toLowerCase().trim()
  const unit = (item.unit || '').toLowerCase().trim()
  return `${idOrName}|${unit}`
}

// Aggregates ingredients across a set of recipes (as currently placed in the
// meal plan) into a de-duplicated, category-grouped shopping list. Recipes
// whose "include in shopping list" option is turned off are skipped
// entirely; optional ingredients are still included but flagged.
export function buildShoppingItems(recipes, ingredientLookupById) {
  const map = new Map()

  recipes.forEach((recipe) => {
    if (recipe.options && recipe.options.includeInShoppingList === false) return
    recipe.ingredientSections.forEach((section) => {
      section.items.forEach((item) => {
        if (!item.ingredientName) return
        const key = keyFor(item)
        const qty = parseFloat(item.quantity)
        const category = (item.ingredientId && ingredientLookupById[item.ingredientId]?.category) || 'Other'

        if (!map.has(key)) {
          map.set(key, {
            key,
            name: item.ingredientName,
            unit: item.unit || '',
            quantity: 0,
            hasQuantity: false,
            category,
            optional: true,
            recipeTitles: new Set(),
          })
        }
        const entry = map.get(key)
        if (Number.isFinite(qty)) {
          entry.quantity += qty
          entry.hasQuantity = true
        }
        if (!item.optional) entry.optional = false
        entry.recipeTitles.add(recipe.title)
      })
    })
  })

  return Array.from(map.values())
    .map((entry) => ({
      ...entry,
      recipeTitles: Array.from(entry.recipeTitles),
      quantity: entry.hasQuantity ? Math.round(entry.quantity * 100) / 100 : null,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function groupByCategory(items) {
  const groups = new Map(SHOPPING_CATEGORY_ORDER.map((c) => [c, []]))
  items.forEach((item) => {
    const cat = groups.has(item.category) ? item.category : 'Other'
    groups.get(cat).push(item)
  })
  return SHOPPING_CATEGORY_ORDER.map((category) => ({ category, items: groups.get(category) })).filter(
    (g) => g.items.length > 0
  )
}
