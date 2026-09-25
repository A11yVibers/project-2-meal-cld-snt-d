// Loads the immutable lookup tables provided in project-assets/ as CSV.
// These are read-only reference/vocabulary lists used throughout the app
// (dropdowns, filters, badges, shopping categories, etc).

import cuisinesRaw from '../../project-assets/cuisines.csv?raw'
import dietaryTagsRaw from '../../project-assets/dietary_tags.csv?raw'
import mealTypesRaw from '../../project-assets/meal_types.csv?raw'
import categoriesRaw from '../../project-assets/recipe_categories.csv?raw'
import ingredientsRaw from '../../project-assets/ingredients.csv?raw'
import unitsRaw from '../../project-assets/units.csv?raw'

import { parseCsv } from './csvLoader.js'

export const CUISINES = parseCsv(cuisinesRaw).map((r) => ({
  id: r.cuisine_id,
  name: r.cuisine_name,
}))

export const DIETARY_TAGS = parseCsv(dietaryTagsRaw).map((r) => ({
  id: r.dietary_tag_id,
  name: r.dietary_tag_name,
}))

export const MEAL_TYPES = parseCsv(mealTypesRaw).map((r) => ({
  id: r.meal_type_id,
  name: r.meal_type_name,
}))

export const RECIPE_CATEGORIES = parseCsv(categoriesRaw).map((r) => ({
  id: r.category_id,
  name: r.category_name,
}))

export const INGREDIENTS = parseCsv(ingredientsRaw).map((r) => ({
  id: r.ingredient_id,
  name: r.ingredient_name,
  shoppingCategory: r.shopping_category,
}))

export const UNITS = parseCsv(unitsRaw).map((r) => ({
  id: r.unit_id,
  name: r.unit_name,
}))

// Fallback category for freeform/custom ingredients that aren't in the
// supplied ingredients.csv lookup.
export const OTHER_SHOPPING_CATEGORY = 'Other'

export const SHOPPING_CATEGORY_ORDER = [
  'Produce',
  'Meat & seafood',
  'Dairy & eggs',
  'Grains & pantry',
  'Oils & condiments',
  'Canned & jarred',
  'Spices',
  OTHER_SHOPPING_CATEGORY,
]

function buildIndex(list) {
  const byId = new Map()
  for (const item of list) byId.set(item.id, item)
  return byId
}

export const CUISINES_BY_ID = buildIndex(CUISINES)
export const DIETARY_TAGS_BY_ID = buildIndex(DIETARY_TAGS)
export const MEAL_TYPES_BY_ID = buildIndex(MEAL_TYPES)
export const RECIPE_CATEGORIES_BY_ID = buildIndex(RECIPE_CATEGORIES)
export const INGREDIENTS_BY_ID = buildIndex(INGREDIENTS)
export const UNITS_BY_ID = buildIndex(UNITS)

// Case-insensitive lookup by ingredient name, used when a user types a
// freeform ingredient that happens to match a known one.
export const INGREDIENTS_BY_NAME = new Map(
  INGREDIENTS.map((i) => [i.name.trim().toLowerCase(), i])
)

export function cuisineName(id) {
  return CUISINES_BY_ID.get(id)?.name ?? 'Other'
}

export function mealTypeName(id) {
  return MEAL_TYPES_BY_ID.get(id)?.name ?? 'Meal'
}

export function dietaryTagNames(ids = []) {
  return ids.map((id) => DIETARY_TAGS_BY_ID.get(id)?.name).filter(Boolean)
}

export function categoryNames(ids = []) {
  return ids.map((id) => RECIPE_CATEGORIES_BY_ID.get(id)?.name).filter(Boolean)
}

export function shoppingCategoryForIngredient({ ingredientId, ingredientName }) {
  if (ingredientId && INGREDIENTS_BY_ID.has(ingredientId)) {
    return INGREDIENTS_BY_ID.get(ingredientId).shoppingCategory
  }
  const match = INGREDIENTS_BY_NAME.get(String(ingredientName || '').trim().toLowerCase())
  if (match) return match.shoppingCategory
  return OTHER_SHOPPING_CATEGORY
}
