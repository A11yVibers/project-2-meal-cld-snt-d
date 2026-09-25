import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useRecipes } from '../../context/RecipesContext.jsx'
import { recipeImageUrl } from '../../lib/image.js'
import { cuisineName, mealTypeName, dietaryTagNames, categoryNames, unitName } from '../../data/lookups.js'
import AddToPlanModal from '../planner/AddToPlanModal.jsx'

function formatQuantity(item) {
  const parts = []
  if (item.quantity !== '' && item.quantity !== null && item.quantity !== undefined) parts.push(item.quantity)
  const u = item.unit ? unitName(item.unit) || item.unit : ''
  if (u) parts.push(u)
  return parts.join(' ')
}

export default function RecipeDetail() {
  const { id } = useParams()
  const { getRecipe } = useRecipes()
  const recipe = getRecipe(id)
  const [showAddToPlan, setShowAddToPlan] = useState(false)

  if (!recipe) {
    return (
      <div className="page">
        <p>Recipe not found.</p>
        <Link to="/">Back to catalog</Link>
      </div>
    )
  }

  const tags = dietaryTagNames(recipe.dietaryTagIds)
  const categories = categoryNames(recipe.categoryIds)

  return (
    <div className="page recipe-detail" style={{ '--accent': recipe.accentColor || '#D97757' }}>
      <Link to="/" className="back-link">
        ← Back to recipes
      </Link>

      <div className="recipe-detail__hero">
        <img src={recipeImageUrl(recipe)} alt="" className="recipe-detail__image" />
        <div className="recipe-detail__hero-info">
          <h1>{recipe.title}</h1>
          {recipe.shortDescription && <p className="muted">{recipe.shortDescription}</p>}
          <div className="recipe-detail__meta-row">
            <span className="tag tag--solid">{cuisineName(recipe.cuisineId)}</span>
            <span className="tag tag--solid">{mealTypeName(recipe.mealTypeId)}</span>
            {tags.map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
          </div>
          {categories.length > 0 && (
            <div className="recipe-detail__meta-row">
              {categories.map((c) => (
                <span key={c} className="tag tag--muted">
                  {c}
                </span>
              ))}
            </div>
          )}
          {recipe.sourceUrl && (
            <p>
              <a href={recipe.sourceUrl} target="_blank" rel="noreferrer">
                {recipe.sourceName || 'View source'} ↗
              </a>
            </p>
          )}
          <button type="button" className="btn btn--primary" onClick={() => setShowAddToPlan(true)}>
            + Add to meal plan
          </button>
        </div>
      </div>

      <div className="recipe-detail__stats">
        <div>
          <strong>{recipe.servings}</strong>
          <span>servings</span>
        </div>
        <div>
          <strong>{recipe.prepTimeMinutes}m</strong>
          <span>prep</span>
        </div>
        <div>
          <strong>{recipe.cookTimeMinutes}m</strong>
          <span>cook</span>
        </div>
        <div>
          <strong>{recipe.totalTimeMinutes}m</strong>
          <span>total</span>
        </div>
        <div>
          <strong>{recipe.spiceLevel > 0 ? '🌶️'.repeat(recipe.spiceLevel) : 'None'}</strong>
          <span>spice level</span>
        </div>
      </div>

      <div className="recipe-detail__columns">
        <section>
          <h2>Ingredients</h2>
          {recipe.ingredientSections.map((section) => (
            <div key={section.id} className="ingredient-section">
              <h3>{section.name}</h3>
              <ul className="ingredient-list">
                {section.items.map((item) => (
                  <li key={item.id} className={item.optional ? 'ingredient--optional' : ''}>
                    <span className="ingredient-list__qty">{formatQuantity(item)}</span>
                    <span className="ingredient-list__name">
                      {item.ingredientName}
                      {item.notes ? `, ${item.notes}` : ''}
                    </span>
                    {item.optional && <span className="tag tag--muted">optional</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section>
          <h2>Method</h2>
          <ol className="step-list">
            {recipe.steps.map((step, idx) => (
              <li key={step.id}>
                <span className="step-list__number">{idx + 1}</span>
                <div>
                  <p>{step.instruction}</p>
                  {step.timerMinutes > 0 && <span className="tag tag--muted">⏱ {step.timerMinutes} min</span>}
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {recipe.options?.showNutrition && (
        <section className="nutrition-panel">
          <h2>Nutrition</h2>
          <p className="muted">Nutrition information is not available in the seed data for this recipe.</p>
        </section>
      )}

      <section className="recipe-detail__options-summary muted">
        <p>
          Measurement system: {recipe.options?.measurementSystem === 'metric' ? 'Metric' : 'US customary'} ·{' '}
          {recipe.options?.includeInShoppingList ? 'Included in shopping list' : 'Excluded from shopping list'} ·{' '}
          {recipe.options?.allowSubstitutions ? 'Substitutions allowed' : 'No substitutions'}
        </p>
      </section>

      {showAddToPlan && <AddToPlanModal recipe={recipe} onClose={() => setShowAddToPlan(false)} />}
    </div>
  )
}
