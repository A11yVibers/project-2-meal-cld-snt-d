// Static lookup / reference data loaded from the supplied project-assets CSV
// files. These files are treated as immutable source data: we only read and
// parse them here, never write back to them.
import cuisinesRaw from '../../project-assets/cuisines.csv?raw'
import dietaryTagsRaw from '../../project-assets/dietary_tags.csv?raw'
import mealTypesRaw from '../../project-assets/meal_types.csv?raw'
import recipeCategoriesRaw from '../../project-assets/recipe_categories.csv?raw'
import unitsRaw from '../../project-assets/units.csv?raw'
import ingredientsRaw from '../../project-assets/ingredients.csv?raw'
import { parseCsv } from './csv.js'

function toMap(list, idKey) {
  const map = new Map()
  for (const item of list) map.set(item[idKey], item)
  return map
}

export const cuisines = parseCsv(cuisinesRaw).map((r) => ({
  id: r.cuisine_id,
  name: r.cuisine_name,
}))

export const dietaryTags = parseCsv(dietaryTagsRaw).map((r) => ({
  id: r.dietary_tag_id,
  name: r.dietary_tag_name,
}))

export const mealTypes = parseCsv(mealTypesRaw).map((r) => ({
  id: r.meal_type_id,
  name: r.meal_type_name,
}))

export const recipeCategories = parseCsv(recipeCategoriesRaw).map((r) => ({
  id: r.category_id,
  name: r.category_name,
}))

export const units = parseCsv(unitsRaw).map((r) => ({
  id: r.unit_id,
  name: r.unit_name,
}))

export const ingredients = parseCsv(ingredientsRaw).map((r) => ({
  id: r.ingredient_id,
  name: r.ingredient_name,
  shoppingCategory: r.shopping_category,
}))

export const cuisineById = toMap(cuisines, 'id')
export const dietaryTagById = toMap(dietaryTags, 'id')
export const mealTypeById = toMap(mealTypes, 'id')
export const recipeCategoryById = toMap(recipeCategories, 'id')
export const unitById = toMap(units, 'id')
export const ingredientById = toMap(ingredients, 'id')

export const SHOPPING_CATEGORIES = [
  'Produce',
  'Meat & seafood',
  'Dairy & eggs',
  'Grains & pantry',
  'Oils & condiments',
  'Canned & jarred',
  'Spices',
  'Other',
]

export function cuisineName(id) {
  return cuisineById.get(id)?.name ?? 'Other'
}

export function mealTypeName(id) {
  return mealTypeById.get(id)?.name ?? ''
}

export function dietaryTagNames(ids = []) {
  return ids.map((id) => dietaryTagById.get(id)?.name).filter(Boolean)
}

export function categoryNames(ids = []) {
  return ids.map((id) => recipeCategoryById.get(id)?.name).filter(Boolean)
}

export function unitName(id) {
  return unitById.get(id)?.name ?? id ?? ''
}

// Meal slots used throughout the weekly planner. These intentionally mirror
// the four meal types that make sense as daily planner slots.
export const PLANNER_SLOTS = ['Breakfast', 'Lunch', 'Dinner', 'Snack']
