import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecipes } from '../state/RecipesContext.jsx'
import { usePlanner } from '../state/PlannerContext.jsx'
import { makeEmptyDraft, finalizeDraft } from '../utils/recipeDraft.js'
import { startOfWeek } from '../utils/dates.js'
import { inferSlotFromHour } from '../utils/constants.js'

import RecipeDetailsSection from '../components/form/RecipeDetailsSection.jsx'
import TimingYieldSection from '../components/form/TimingYieldSection.jsx'
import ImageAppearanceSection from '../components/form/ImageAppearanceSection.jsx'
import IngredientsSection from '../components/form/IngredientsSection.jsx'
import MethodSection from '../components/form/MethodSection.jsx'
import PlanningSection from '../components/form/PlanningSection.jsx'
import RecipeOptionsMenu from '../components/form/RecipeOptionsMenu.jsx'

export default function NewRecipePage() {
  const [draft, setDraft] = useState(makeEmptyDraft())
  const [error, setError] = useState('')
  const { addRecipe } = useRecipes()
  const { assignRecipe } = usePlanner()
  const navigate = useNavigate()

  function patch(changes) {
    setDraft((prev) => ({ ...prev, ...changes }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    if (!draft.title.trim()) {
      setError('Please give your recipe a title.')
      return
    }

    const final = finalizeDraft(draft)
    if (final.ingredientSections.length === 0) {
      setError('Add at least one ingredient before saving.')
      return
    }
    if (final.steps.length === 0) {
      setError('Add at least one method step before saving.')
      return
    }
    setError('')

    const { planning, ...recipeFields } = final
    const recipe = addRecipe(recipeFields)

    if (planning.addToPlanNow) {
      if (planning.useExactDateTime && planning.exactDateTime) {
        const dt = new Date(planning.exactDateTime)
        const weekStart = startOfWeek(dt)
        const dayIndex = (dt.getDay() + 6) % 7 // Monday = 0
        const mealSlotKey = inferSlotFromHour(dt.getHours())
        const plannedTime = dt.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
        assignRecipe({ weekStart, dayIndex, mealSlotKey, recipeId: recipe.id, plannedTime })
      } else {
        assignRecipe({
          weekStart: planning.weekStart,
          dayIndex: planning.dayIndex,
          mealSlotKey: planning.mealSlotKey,
          recipeId: recipe.id,
        })
      }
    }

    navigate(`/recipes/${recipe.id}`)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Add a new recipe</h1>
          <p className="page-subtitle">Fill in as much detail as you like -- it will appear in the catalog right away.</p>
        </div>
      </div>

      <form className="recipe-form" onSubmit={handleSubmit}>
        <RecipeDetailsSection draft={draft} patch={patch} />
        <TimingYieldSection draft={draft} patch={patch} />
        <ImageAppearanceSection draft={draft} patch={patch} />
        <IngredientsSection draft={draft} patch={patch} />
        <MethodSection draft={draft} patch={patch} />
        <PlanningSection draft={draft} patch={patch} />
        <RecipeOptionsMenu draft={draft} patch={patch} />

        {error && <p className="form-error">{error}</p>}

        <div className="modal-actions">
          <button type="button" className="btn" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn btn-primary">Save recipe</button>
        </div>
      </form>
    </div>
  )
}
