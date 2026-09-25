import { makeId } from '../../lib/id.js'
import { getWeekStart, todayIso } from '../../lib/date.js'

export function emptyIngredientItem() {
  return { id: makeId('item'), ingredientId: '', ingredientName: '', quantity: '', unit: '', optional: false }
}

export function emptySection(name = 'Main') {
  return { id: makeId('section'), name, items: [emptyIngredientItem()] }
}

export function emptyStep() {
  return { id: makeId('step'), instruction: '', timerMinutes: 0 }
}

export function emptyDraft() {
  return {
    title: '',
    shortDescription: '',
    sourceName: '',
    sourceUrl: '',
    cuisineId: '',
    mealTypeId: '',
    dietaryTagIds: [],
    categoryIds: [],
    servings: 4,
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    spiceLevel: 0,
    coverImageUrl: '',
    accentColor: '#D97757',
    ingredientSections: [emptySection('Main')],
    steps: [emptyStep()],
    mealPlanning: {
      availableForSuggestions: true,
      addToMealPlanNow: false,
      weekChoice: 'current',
      plannedDate: todayIso(),
      plannedSlot: 'Dinner',
      useExactTime: false,
      exactDateTime: '',
    },
    options: {
      includeInShoppingList: true,
      showNutrition: false,
      allowSubstitutions: true,
      measurementSystem: 'us',
    },
  }
}

export function draftToRecipe(draft) {
  const totalTimeMinutes = Number(draft.prepTimeMinutes || 0) + Number(draft.cookTimeMinutes || 0)
  return {
    title: draft.title.trim(),
    shortDescription: draft.shortDescription.trim(),
    sourceName: draft.sourceName.trim(),
    sourceUrl: draft.sourceUrl.trim(),
    cuisineId: draft.cuisineId,
    mealTypeId: draft.mealTypeId,
    dietaryTagIds: draft.dietaryTagIds,
    categoryIds: draft.categoryIds,
    servings: Number(draft.servings) || 1,
    prepTimeMinutes: Number(draft.prepTimeMinutes) || 0,
    cookTimeMinutes: Number(draft.cookTimeMinutes) || 0,
    totalTimeMinutes,
    spiceLevel: Number(draft.spiceLevel) || 0,
    accentColor: draft.accentColor,
    coverImageUrl: draft.coverImageUrl,
    difficulty: 0,
    ingredientSections: draft.ingredientSections.map((section) => ({
      ...section,
      items: section.items
        .filter((item) => item.ingredientName.trim() !== '')
        .map((item) => ({
          ...item,
          quantity: item.quantity === '' ? '' : Number(item.quantity),
        })),
    })),
    steps: draft.steps
      .filter((s) => s.instruction.trim() !== '')
      .map((s) => ({ ...s, timerMinutes: Number(s.timerMinutes) || 0 })),
    options: { ...draft.options },
    availableForSuggestions: draft.mealPlanning.availableForSuggestions,
  }
}

export function weekStartFromChoice(mealPlanning) {
  if (mealPlanning.weekChoice === 'next') {
    const d = new Date(getWeekStart(new Date()) + 'T00:00:00')
    d.setDate(d.getDate() + 7)
    return getWeekStart(d)
  }
  return getWeekStart(new Date())
}
