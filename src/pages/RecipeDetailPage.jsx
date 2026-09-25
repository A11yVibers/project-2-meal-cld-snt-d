import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useRecipes } from '../state/RecipesContext.jsx'
import RecipeImage from '../components/common/RecipeImage.jsx'
import Pill from '../components/common/Pill.jsx'
import AddToPlanModal from '../components/planner/AddToPlanModal.jsx'
import { cuisineName, mealTypeName, dietaryTagNames, categoryNames } from '../data/lookups.js'
import { spiceLevelLabel } from '../utils/constants.js'

export default function RecipeDetailPage() {
  const { id } = useParams()
  const { getRecipe } = useRecipes()
  const navigate = useNavigate()
  const recipe = getRecipe(id)
  const [showAddModal, setShowAddModal] = useState(false)
  const [message, setMessage] = useState('')

  if (!recipe) {
    return (
      <div className="page">
        <p className="empty-state">We couldn't find that recipe.</p>
        <Link to="/" className="btn">← Back to catalog</Link>
      </div>
    )
  }

  const dietaryTags = dietaryTagNames(recipe.dietaryTagIds)
  const categories = categoryNames(recipe.categoryIds)
  const options = recipe.options ?? {}

  return (
    <div className="page recipe-detail">
      <button type="button" className="btn back-link" onClick={() => navigate(-1)}>← Back</button>

      <div className="recipe-detail-hero" style={{ '--accent': recipe.accentColor }}>
        <div className="recipe-detail-image">
          <RecipeImage src={recipe.coverImageUrl} alt={recipe.title} />
        </div>
        <div className="recipe-detail-heading">
          <h1>{recipe.title}</h1>
          {recipe.shortDescription && <p className="recipe-card-desc">{recipe.shortDescription}</p>}
          <div className="recipe-card-pills">
            <Pill>{cuisineName(recipe.cuisineId)}</Pill>
            <Pill tone="accent">{mealTypeName(recipe.mealTypeId)}</Pill>
            {dietaryTags.map((t) => <Pill key={t}>{t}</Pill>)}
            {categories.map((c) => <Pill key={c} tone="muted">{c}</Pill>)}
          </div>
          {recipe.sourceUrl && (
            <p className="recipe-source">
              Source: <a href={recipe.sourceUrl} target="_blank" rel="noreferrer">{recipe.sourceName || recipe.sourceUrl}</a>
            </p>
          )}
          {!recipe.sourceUrl && recipe.sourceName && <p className="recipe-source">Source: {recipe.sourceName}</p>}

          <div className="recipe-detail-stats">
            <div><strong>{recipe.servings}</strong><span>Servings</span></div>
            <div><strong>{recipe.prepTimeMinutes}m</strong><span>Prep</span></div>
            <div><strong>{recipe.cookTimeMinutes}m</strong><span>Cook</span></div>
            <div><strong>{recipe.totalTimeMinutes}m</strong><span>Total</span></div>
            <div><strong>{spiceLevelLabel(recipe.spiceLevel)}</strong><span>Spice level</span></div>
          </div>

          <button type="button" className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            + Add to meal plan
          </button>
          {message && <p className="success-banner">{message}</p>}
        </div>
      </div>

      <div className="recipe-detail-grid">
        <section className="recipe-detail-section">
          <h2>Ingredients</h2>
          {recipe.ingredientSections.map((section) => (
            <div key={section.id} className="ingredient-section">
              <h3>{section.name}</h3>
              <ul className="ingredient-list">
                {section.items.map((item) => (
                  <li key={item.id}>
                    <span className="ingredient-qty">{item.quantity} {item.unit}</span>
                    <span className="ingredient-name">{item.ingredientName}</span>
                    {item.notes && <span className="ingredient-notes">({item.notes})</span>}
                    {item.optional && <Pill tone="muted">optional</Pill>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="recipe-detail-section">
          <h2>Method</h2>
          <ol className="step-list">
            {recipe.steps.map((step, idx) => (
              <li key={step.id}>
                <span className="step-number">{idx + 1}</span>
                <div>
                  <p>{step.instruction}</p>
                  {step.timerMinutes > 0 && <span className="step-timer">⏱ {step.timerMinutes} min</span>}
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="recipe-detail-section recipe-options-summary">
        <h2>Recipe options</h2>
        <div className="recipe-card-pills">
          <Pill tone={options.includeInShoppingList ? 'accent' : 'muted'}>
            {options.includeInShoppingList ? '✓ In shopping lists' : 'Excluded from shopping lists'}
          </Pill>
          <Pill tone={options.allowSubstitutions ? 'accent' : 'muted'}>
            {options.allowSubstitutions ? '✓ Substitutions allowed' : 'No substitutions noted'}
          </Pill>
          <Pill tone="muted">{options.measurementSystem === 'metric' ? 'Metric measurements' : 'US customary measurements'}</Pill>
          <Pill tone={recipe.includeInMealSuggestions ? 'accent' : 'muted'}>
            {recipe.includeInMealSuggestions ? '✓ Suggested in meal plans' : 'Hidden from suggestions'}
          </Pill>
        </div>
        {options.showNutrition && (
          <div className="nutrition-panel">
            <h3>Nutrition information</h3>
            <p>Detailed nutrition data isn't part of the supplied recipe dataset yet, so figures aren't shown here.</p>
          </div>
        )}
      </section>

      {showAddModal && (
        <AddToPlanModal
          recipe={recipe}
          onClose={() => setShowAddModal(false)}
          onAdded={(msg) => setMessage(msg)}
        />
      )}
    </div>
  )
}
