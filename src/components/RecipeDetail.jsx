import React, { useMemo, useState } from 'react'
import { useAppData } from '../context/AppDataContext.jsx'
import { APPROVED_IMAGES } from '../approved-images.js'
import {
  CUISINES_BY_ID,
  MEAL_TYPES_BY_ID,
  DIETARY_TAGS_BY_ID,
  RECIPE_CATEGORIES_BY_ID,
} from '../data/csvData.js'
import { displayQuantity } from '../lib/units.js'
import AddToPlanModal from './AddToPlanModal.jsx'

const SPICE_LABELS = ['No spice', 'Mild', 'Mild+', 'Medium', 'Spicy', 'Very spicy']

export default function RecipeDetail({ recipeId, onBack }) {
  const { recipesById } = useAppData()
  const recipe = recipesById[recipeId]
  const [showPlanModal, setShowPlanModal] = useState(false)

  const image = recipe?.coverImageUrl || APPROVED_IMAGES.placeholder
  const system = recipe?.options?.measurementSystem || 'us'

  const totalItems = useMemo(() => {
    if (!recipe) return 0
    return recipe.ingredientSections.reduce((sum, s) => sum + s.items.length, 0)
  }, [recipe])

  if (!recipe) {
    return (
      <div className="page">
        <button className="btn" onClick={onBack}>
          ← Back to recipes
        </button>
        <p className="empty-state">This recipe could not be found.</p>
      </div>
    )
  }

  return (
    <div className="page">
      <button className="btn" onClick={onBack}>
        ← Back to recipes
      </button>

      <div className="recipe-detail" style={{ '--accent': recipe.accentColor }}>
        <div className="recipe-detail__banner">
          <img
            src={image}
            alt={recipe.title}
            onError={(e) => {
              e.currentTarget.src = APPROVED_IMAGES.placeholder
            }}
          />
        </div>

        <div className="recipe-detail__header">
          <h1>{recipe.title}</h1>
          {recipe.shortDescription && <p className="page__subtitle">{recipe.shortDescription}</p>}
          {recipe.sourceUrl && (
            <a href={recipe.sourceUrl} target="_blank" rel="noreferrer" className="recipe-detail__source">
              {recipe.sourceName || 'View source'} ↗
            </a>
          )}

          <div className="chip-row">
            {recipe.mealTypeId && <span className="chip">{MEAL_TYPES_BY_ID[recipe.mealTypeId]?.name}</span>}
            {recipe.cuisineId && <span className="chip">{CUISINES_BY_ID[recipe.cuisineId]?.name}</span>}
            {recipe.dietaryTagIds.map((id) => (
              <span className="chip chip--muted" key={id}>
                {DIETARY_TAGS_BY_ID[id]?.name || id}
              </span>
            ))}
            {recipe.categoryIds.map((id) => (
              <span className="chip chip--outline" key={id}>
                {RECIPE_CATEGORIES_BY_ID[id]?.name || id}
              </span>
            ))}
          </div>

          <button className="btn btn--primary" onClick={() => setShowPlanModal(true)}>
            + Add to meal plan
          </button>
        </div>

        <div className="recipe-detail__stats">
          <div>
            <span className="stat__label">Servings</span>
            <span className="stat__value">{recipe.servings}</span>
          </div>
          <div>
            <span className="stat__label">Prep</span>
            <span className="stat__value">{recipe.prepTime} min</span>
          </div>
          <div>
            <span className="stat__label">Cook</span>
            <span className="stat__value">{recipe.cookTime} min</span>
          </div>
          <div>
            <span className="stat__label">Total</span>
            <span className="stat__value">{recipe.totalTime} min</span>
          </div>
          <div>
            <span className="stat__label">Spice level</span>
            <span className="stat__value">{SPICE_LABELS[recipe.spiceLevel] || 'No spice'}</span>
          </div>
        </div>

        {recipe.options?.showNutrition && (
          <div className="callout">
            <strong>Nutrition</strong>
            <p>Detailed nutrition data isn't tracked in this recipe collection yet.</p>
          </div>
        )}
        {recipe.options?.allowSubstitutions && (
          <div className="callout callout--subtle">
            <strong>Substitutions welcome</strong>
            <p>The cook is happy to swap ingredients below for what you have on hand.</p>
          </div>
        )}

        <div className="recipe-detail__columns">
          <section>
            <h2>Ingredients ({totalItems})</h2>
            {recipe.ingredientSections.map((section) => (
              <div key={section.id} className="ingredient-section">
                <h3>{section.name}</h3>
                <ul className="ingredient-list">
                  {section.items.map((item) => {
                    const { quantity, unit } = displayQuantity(item.quantity, item.unit, system)
                    return (
                      <li key={item.id} className={item.optional ? 'ingredient--optional' : ''}>
                        <span className="ingredient-list__qty">
                          {quantity} {unit}
                        </span>
                        <span className="ingredient-list__name">
                          {item.ingredientName}
                          {item.notes ? `, ${item.notes}` : ''}
                          {item.optional ? ' (optional)' : ''}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </section>

          <section>
            <h2>Method</h2>
            <ol className="step-list">
              {recipe.steps.map((step) => (
                <li key={step.id}>
                  <span>{step.instruction}</span>
                  {step.timerMinutes > 0 && <span className="chip chip--small chip--timer">⏱ {step.timerMinutes} min</span>}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      {showPlanModal && <AddToPlanModal recipe={recipe} onClose={() => setShowPlanModal(false)} />}
    </div>
  )
}
