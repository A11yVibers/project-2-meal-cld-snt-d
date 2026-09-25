import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecipes } from '../../context/RecipesContext.jsx'
import { usePlanner } from '../../context/PlannerContext.jsx'
import { emptyDraft, draftToRecipe, weekStartFromChoice } from './formModel.js'
import { dayIndexInWeek } from '../../lib/date.js'
import DetailsSection from './DetailsSection.jsx'
import TimingSection from './TimingSection.jsx'
import ImageSection from './ImageSection.jsx'
import IngredientsSection from './IngredientsSection.jsx'
import MethodSection from './MethodSection.jsx'
import PlanningSection from './PlanningSection.jsx'
import OptionsMenu from './OptionsMenu.jsx'

export default function RecipeForm() {
  const [draft, setDraft] = useState(emptyDraft)
  const [error, setError] = useState('')
  const { addRecipe } = useRecipes()
  const { assignRecipe } = usePlanner()
  const navigate = useNavigate()

  const patch = useCallback((fields) => setDraft((d) => ({ ...d, ...fields })), [])

  function handleSubmit(e) {
    e.preventDefault()
    if (!draft.title.trim()) {
      setError('Please give the recipe a title.')
      return
    }
    if (!draft.cuisineId || !draft.mealTypeId) {
      setError('Please select a cuisine and a primary meal type.')
      return
    }

    const recipeInput = draftToRecipe(draft)
    const recipe = addRecipe(recipeInput)

    if (draft.mealPlanning.addToMealPlanNow) {
      const mp = draft.mealPlanning
      const weekStart = weekStartFromChoice(mp)
      const plannedDate = mp.useExactTime && mp.exactDateTime ? mp.exactDateTime.slice(0, 10) : mp.plannedDate
      const dayIndex = dayIndexInWeek(weekStart, plannedDate)
      const extra = {}
      if (mp.useExactTime && mp.exactDateTime) {
        extra.time = mp.exactDateTime.slice(11, 16)
      }
      assignRecipe(weekStart, dayIndex, mp.plannedSlot, recipe.id, extra)
    }

    navigate(`/recipes/${recipe.id}`)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Add a new recipe</h1>
          <p className="muted">Fill in the sections below to build out your recipe.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="recipe-form">
        {error && <p className="form-error">{error}</p>}
        <DetailsSection draft={draft} patch={patch} />
        <TimingSection draft={draft} patch={patch} />
        <ImageSection draft={draft} patch={patch} />
        <IngredientsSection draft={draft} patch={patch} />
        <MethodSection draft={draft} patch={patch} />
        <PlanningSection draft={draft} patch={patch} />
        <OptionsMenu draft={draft} patch={patch} />

        <div className="form-submit-row">
          <button type="button" className="btn" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            Save recipe
          </button>
        </div>
      </form>
    </div>
  )
}
