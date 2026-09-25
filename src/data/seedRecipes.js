// Builds the initial seed recipe catalog from the supplied project-assets
// CSV files (recipes.csv, recipe_ingredients.csv, recipe_steps.csv). These
// files are treated as immutable source data - we only read from them here.
import recipesRaw from '../../project-assets/recipes.csv?raw'
import recipeIngredientsRaw from '../../project-assets/recipe_ingredients.csv?raw'
import recipeStepsRaw from '../../project-assets/recipe_steps.csv?raw'
import { parseCsv, splitIds, toNumber, toBool } from './csv.js'

function groupBy(list, keyFn) {
  const map = new Map()
  for (const item of list) {
    const key = keyFn(item)
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(item)
  }
  return map
}

function buildIngredientSections(rows) {
  const sections = []
  const sectionIndex = new Map()
  const sorted = [...rows].sort((a, b) => toNumber(a.display_order) - toNumber(b.display_order))
  for (const row of sorted) {
    const sectionName = row.section_name || 'Main'
    if (!sectionIndex.has(sectionName)) {
      sectionIndex.set(sectionName, sections.length)
      sections.push({ id: `sec-${sections.length}-${sectionName}`, name: sectionName, items: [] })
    }
    const section = sections[sectionIndex.get(sectionName)]
    section.items.push({
      id: `${row.recipe_id}-ing-${row.display_order}`,
      ingredientId: row.ingredient_id || '',
      ingredientName: row.ingredient_name || '',
      quantity: row.quantity === '' ? '' : toNumber(row.quantity, ''),
      unit: row.unit || '',
      notes: row.notes || '',
      optional: toBool(row.optional),
    })
  }
  return sections
}

function buildSteps(rows) {
  return [...rows]
    .sort((a, b) => toNumber(a.step_number) - toNumber(b.step_number))
    .map((row) => ({
      id: `${row.recipe_id}-step-${row.step_number}`,
      instruction: row.instruction || '',
      timerMinutes: toNumber(row.timer_minutes, 0),
    }))
}

function buildSeedRecipes() {
  const recipeRows = parseCsv(recipesRaw)
  const ingredientRows = parseCsv(recipeIngredientsRaw)
  const stepRows = parseCsv(recipeStepsRaw)

  const ingredientsByRecipe = groupBy(ingredientRows, (r) => r.recipe_id)
  const stepsByRecipe = groupBy(stepRows, (r) => r.recipe_id)

  return recipeRows.map((row) => ({
    id: row.recipe_id,
    title: row.title,
    shortDescription: row.short_description || '',
    sourceName: row.source_name || '',
    sourceUrl: row.source_url || '',
    cuisineId: row.cuisine_id || '',
    mealTypeId: row.meal_type_id || '',
    dietaryTagIds: splitIds(row.dietary_tag_ids),
    categoryIds: splitIds(row.category_ids),
    servings: toNumber(row.servings, 1),
    prepTimeMinutes: toNumber(row.prep_time_minutes, 0),
    cookTimeMinutes: toNumber(row.cook_time_minutes, 0),
    totalTimeMinutes: toNumber(row.total_time_minutes, toNumber(row.prep_time_minutes) + toNumber(row.cook_time_minutes)),
    difficulty: toNumber(row.difficulty_1_to_5, 0),
    spiceLevel: toNumber(row.spice_level_0_to_5, 0),
    accentColor: row.accent_color || '#D97757',
    coverImageUrl: row.cover_image_url || '',
    ingredientSections: buildIngredientSections(ingredientsByRecipe.get(row.recipe_id) || []),
    steps: buildSteps(stepsByRecipe.get(row.recipe_id) || []),
    options: {
      includeInShoppingList: true,
      showNutrition: false,
      allowSubstitutions: true,
      measurementSystem: 'us',
    },
    availableForSuggestions: String(row.include_in_meal_suggestions).trim().toLowerCase() === 'true',
    isUserCreated: false,
    createdAt: 0,
  }))
}

export const seedRecipes = buildSeedRecipes()

// Every distinct cover image URL that appears in the supplied seed data.
// These are safe, pre-approved remote URLs that user-created recipes are
// also allowed to pick as a cover image.
export const seedCoverImageUrls = [...new Set(seedRecipes.map((r) => r.coverImageUrl).filter(Boolean))]
