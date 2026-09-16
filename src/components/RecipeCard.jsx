import React from 'react'
import { APPROVED_IMAGES } from '../approved-images.js'
import { CUISINES_BY_ID, MEAL_TYPES_BY_ID, DIETARY_TAGS_BY_ID } from '../data/csvData.js'

const SPICE_LABELS = ['No spice', 'Mild', 'Mild+', 'Medium', 'Spicy', 'Very spicy']

export default function RecipeCard({ recipe, onOpen }) {
  const image = recipe.coverImageUrl || APPROVED_IMAGES.placeholder
  const cuisine = CUISINES_BY_ID[recipe.cuisineId]?.name
  const mealType = MEAL_TYPES_BY_ID[recipe.mealTypeId]?.name

  return (
    <button className="recipe-card" style={{ '--accent': recipe.accentColor }} onClick={() => onOpen(recipe.id)}>
      <div className="recipe-card__image-wrap">
        <img
          className="recipe-card__image"
          src={image}
          alt={recipe.title}
          onError={(e) => {
            e.currentTarget.src = APPROVED_IMAGES.placeholder
          }}
        />
        {recipe.isUserCreated && <span className="badge badge--user">Your recipe</span>}
      </div>
      <div className="recipe-card__body">
        <h3 className="recipe-card__title">{recipe.title}</h3>
        <div className="recipe-card__meta">
          {mealType && <span>{mealType}</span>}
          {cuisine && <span>{cuisine}</span>}
          <span>{recipe.totalTime} min</span>
          <span>Serves {recipe.servings}</span>
        </div>
        {recipe.spiceLevel > 0 && (
          <div className="recipe-card__spice" title={SPICE_LABELS[recipe.spiceLevel] || ''}>
            {'🌶️'.repeat(recipe.spiceLevel)}
          </div>
        )}
        {recipe.dietaryTagIds.length > 0 && (
          <div className="chip-row">
            {recipe.dietaryTagIds.slice(0, 3).map((id) => (
              <span className="chip chip--small" key={id}>
                {DIETARY_TAGS_BY_ID[id]?.name || id}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  )
}
