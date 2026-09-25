import { makeId } from './ids.js'
import { DEFAULT_ACCENT_COLOR } from './constants.js'
import { CURRENT_WEEK_START } from './dates.js'

export function makeEmptyIngredientItem() {
  return { id: makeId('ing'), ingredientId: null, ingredientName: '', quantity: '', unit: '', notes: '', optional: false }
}

export function makeEmptySection(name = '') {
  return { id: makeId('section'), name, items: [makeEmptyIngredientItem()] }
}

export function makeEmptyStep() {
  return { id: makeId('step'), instruction: '', timerMinutes: 0 }
}

export function makeEmptyDraft() {
  return {
    title: '',
    shortDescription: '',
    sourceUrl: '',
    cuisineId: '',
    mealTypeId: '',
    dietaryTagIds: [],
    categoryIds: [],
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    spiceLevel: 0,
    accentColor: DEFAULT_ACCENT_COLOR,
    coverImageUrl: '',
    ingredientSections: [makeEmptySection('Main')],
    steps: [makeEmptyStep()],
    includeInMealSuggestions: true,
    options: {
      includeInShoppingList: true,
      showNutrition: false,
      allowSubstitutions: false,
      measurementSystem: 'us',
    },
    planning: {
      addToPlanNow: false,
      weekStart: CURRENT_WEEK_START,
      dayIndex: 0,
      mealSlotKey: 'dinner',
      useExactDateTime: false,
      exactDateTime: '',
    },
  }
}

// Strips empty ingredient rows / sections and empty steps, and computes
// derived fields, ready to hand off to RecipesContext.addRecipe.
export function finalizeDraft(draft) {
  const ingredientSections = draft.ingredientSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => item.ingredientName.trim() !== ''),
    }))
    .filter((section) => section.items.length > 0)

  const steps = draft.steps.filter((s) => s.instruction.trim() !== '')

  return {
    ...draft,
    title: draft.title.trim(),
    ingredientSections,
    steps,
  }
}
