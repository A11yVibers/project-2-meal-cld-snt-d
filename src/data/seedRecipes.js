// Transforms the seed recipes.csv + recipe_ingredients.csv + recipe_steps.csv
// rows into the same unified Recipe shape used for user-created recipes
// (see state/RecipesContext.jsx). This keeps the rest of the app agnostic to
// where a recipe originally came from.

import recipesRaw from '../../project-assets/recipes.csv?raw'
import recipeIngredientsRaw from '../../project-assets/recipe_ingredients.csv?raw'
import recipeStepsRaw from '../../project-assets/recipe_steps.csv?raw'

import { parseCsv, splitIds, toNumber, toBool } from './csvLoader.js'
import { makeId } from '../utils/ids.js'

function groupBy(rows, key) {
  const map = new Map()
  for (const row of rows) {
    const k = row[key]
    if (!map.has(k)) map.set(k, [])
    map.get(k).push(row)
  }
  return map
}

export function loadSeedRecipes() {
  const recipeRows = parseCsv(recipesRaw)
  const ingredientRows = parseCsv(recipeIngredientsRaw)
  const stepRows = parseCsv(recipeStepsRaw)

  const ingredientsByRecipe = groupBy(ingredientRows, 'recipe_id')
  const stepsByRecipe = groupBy(stepRows, 'recipe_id')

  return recipeRows.map((row) => {
    const recipeId = row.recipe_id

    const ingredientRowsForRecipe = (ingredientsByRecipe.get(recipeId) ?? []).sort(
      (a, b) => toNumber(a.display_order) - toNumber(b.display_order)
    )

    // Fold flat ingredient rows into ordered sections, preserving the order
    // sections first appear in the source data.
    const sections = []
    const sectionByName = new Map()
    for (const ing of ingredientRowsForRecipe) {
      const sectionName = ing.section_name || 'Main'
      let section = sectionByName.get(sectionName)
      if (!section) {
        section = { id: makeId('section'), name: sectionName, items: [] }
        sectionByName.set(sectionName, section)
        sections.push(section)
      }
      section.items.push({
        id: makeId('ing'),
        ingredientId: ing.ingredient_id || null,
        ingredientName: ing.ingredient_name,
        quantity: ing.quantity,
        unit: ing.unit,
        notes: ing.notes || '',
        optional: toBool(ing.optional, false),
      })
    }

    const stepRowsForRecipe = (stepsByRecipe.get(recipeId) ?? []).sort(
      (a, b) => toNumber(a.step_number) - toNumber(b.step_number)
    )
    const steps = stepRowsForRecipe.map((s) => ({
      id: makeId('step'),
      instruction: s.instruction,
      timerMinutes: toNumber(s.timer_minutes, 0),
    }))

    return {
      id: recipeId,
      title: row.title,
      shortDescription: row.short_description || '',
      sourceName: row.source_name || '',
      sourceUrl: row.source_url || '',
      servings: toNumber(row.servings, 4),
      prepTimeMinutes: toNumber(row.prep_time_minutes, 0),
      cookTimeMinutes: toNumber(row.cook_time_minutes, 0),
      totalTimeMinutes: toNumber(row.total_time_minutes, 0),
      cuisineId: row.cuisine_id || '',
      mealTypeId: row.meal_type_id || '',
      dietaryTagIds: splitIds(row.dietary_tag_ids),
      categoryIds: splitIds(row.category_ids),
      difficulty: toNumber(row.difficulty_1_to_5, 1),
      spiceLevel: toNumber(row.spice_level_0_to_5, 0),
      accentColor: row.accent_color || '#D97757',
      coverImageUrl: row.cover_image_url || '',
      includeInMealSuggestions: toBool(row.include_in_meal_suggestions, true),
      ingredientSections: sections,
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
