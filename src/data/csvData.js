// Reads the project's seed CSVs (as raw text, via Vite's `?raw` import) and
// normalizes them into lookup tables + seed recipe objects. The CSV files
// themselves are treated as immutable source data - this module only reads
// and derives from them, never writes back.
import cuisinesRaw from '../../project-assets/cuisines.csv?raw'
import dietaryTagsRaw from '../../project-assets/dietary_tags.csv?raw'
import ingredientsRaw from '../../project-assets/ingredients.csv?raw'
import mealTypesRaw from '../../project-assets/meal_types.csv?raw'
import recipeCategoriesRaw from '../../project-assets/recipe_categories.csv?raw'
import recipeIngredientsRaw from '../../project-assets/recipe_ingredients.csv?raw'
import recipeStepsRaw from '../../project-assets/recipe_steps.csv?raw'
import recipesRaw from '../../project-assets/recipes.csv?raw'
import unitsRaw from '../../project-assets/units.csv?raw'
import { parseCSV, splitList } from '../lib/csv.js'

export const CUISINES = parseCSV(cuisinesRaw).map((r) => ({ id: r.cuisine_id, name: r.cuisine_name }))
export const DIETARY_TAGS = parseCSV(dietaryTagsRaw).map((r) => ({ id: r.dietary_tag_id, name: r.dietary_tag_name }))
export const MEAL_TYPES = parseCSV(mealTypesRaw).map((r) => ({ id: r.meal_type_id, name: r.meal_type_name }))
export const RECIPE_CATEGORIES = parseCSV(recipeCategoriesRaw).map((r) => ({
  id: r.category_id,
  name: r.category_name,
}))
export const UNITS = parseCSV(unitsRaw).map((r) => ({ id: r.unit_id, name: r.unit_name }))
export const INGREDIENTS = parseCSV(ingredientsRaw).map((r) => ({
  id: r.ingredient_id,
  name: r.ingredient_name,
  category: r.shopping_category,
}))

export const INGREDIENTS_BY_ID = Object.fromEntries(INGREDIENTS.map((i) => [i.id, i]))
export const CUISINES_BY_ID = Object.fromEntries(CUISINES.map((c) => [c.id, c]))
export const DIETARY_TAGS_BY_ID = Object.fromEntries(DIETARY_TAGS.map((c) => [c.id, c]))
export const MEAL_TYPES_BY_ID = Object.fromEntries(MEAL_TYPES.map((c) => [c.id, c]))
export const RECIPE_CATEGORIES_BY_ID = Object.fromEntries(RECIPE_CATEGORIES.map((c) => [c.id, c]))

function buildSeedRecipes() {
  const recipeRows = parseCSV(recipesRaw)
  const ingredientRows = parseCSV(recipeIngredientsRaw)
  const stepRows = parseCSV(recipeStepsRaw)

  return recipeRows.map((r) => {
    const ownIngredients = ingredientRows
      .filter((x) => x.recipe_id === r.recipe_id)
      .sort((a, b) => Number(a.display_order) - Number(b.display_order))

    const sectionOrder = []
    const sectionsMap = new Map()
    ownIngredients.forEach((x) => {
      const name = x.section_name || 'Main'
      if (!sectionsMap.has(name)) {
        sectionsMap.set(name, [])
        sectionOrder.push(name)
      }
      sectionsMap.get(name).push({
        id: `${x.recipe_id}-ing-${x.display_order}`,
        ingredientId: x.ingredient_id || null,
        ingredientName: x.ingredient_name,
        quantity: x.quantity,
        unit: x.unit,
        notes: x.notes || '',
        optional: String(x.optional).trim().toLowerCase() === 'true',
      })
    })

    const ingredientSections = sectionOrder.map((name, idx) => ({
      id: `${r.recipe_id}-sec-${idx}`,
      name,
      items: sectionsMap.get(name),
    }))

    const steps = stepRows
      .filter((x) => x.recipe_id === r.recipe_id)
      .sort((a, b) => Number(a.step_number) - Number(b.step_number))
      .map((x) => ({
        id: `${r.recipe_id}-step-${x.step_number}`,
        number: Number(x.step_number),
        instruction: x.instruction,
        timerMinutes: Number(x.timer_minutes) || 0,
      }))

    return {
      id: r.recipe_id,
      title: r.title,
      shortDescription: r.short_description || '',
      sourceName: r.source_name || '',
      sourceUrl: r.source_url || '',
      servings: Number(r.servings) || 1,
      prepTime: Number(r.prep_time_minutes) || 0,
      cookTime: Number(r.cook_time_minutes) || 0,
      totalTime: Number(r.total_time_minutes) || Number(r.prep_time_minutes) + Number(r.cook_time_minutes) || 0,
      cuisineId: r.cuisine_id || '',
      mealTypeId: r.meal_type_id || '',
      dietaryTagIds: splitList(r.dietary_tag_ids),
      categoryIds: splitList(r.category_ids),
      difficulty: Number(r.difficulty_1_to_5) || null,
      spiceLevel: Number(r.spice_level_0_to_5) || 0,
      accentColor: r.accent_color || '#D97757',
      coverImageUrl: r.cover_image_url || '',
      includeInMealSuggestions: String(r.include_in_meal_suggestions).trim().toLowerCase() === 'true',
      ingredientSections,
      steps,
      options: {
        includeInShoppingList: true,
        showNutrition: false,
        allowSubstitutions: false,
        measurementSystem: 'us',
      },
      isUserCreated: false,
      createdAt: 0,
    }
  })
}

export const SEED_RECIPES = buildSeedRecipes()

// Curated set of image URLs the recipe form is allowed to offer as a cover
// image choice: the approved placeholder, plus any cover images already
// present in the seed recipe data. No other image sources are introduced.
export function buildApprovedCoverImageChoices(approvedImages) {
  const seen = new Set()
  const choices = []
  if (approvedImages?.placeholder) {
    choices.push({ label: 'Placeholder', url: approvedImages.placeholder })
    seen.add(approvedImages.placeholder)
  }
  SEED_RECIPES.forEach((r) => {
    if (r.coverImageUrl && !seen.has(r.coverImageUrl)) {
      seen.add(r.coverImageUrl)
      choices.push({ label: r.title, url: r.coverImageUrl })
    }
  })
  return choices
}
