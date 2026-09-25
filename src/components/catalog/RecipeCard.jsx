import React from 'react'
import { Link } from 'react-router-dom'
import RecipeImage from '../common/RecipeImage.jsx'
import Pill from '../common/Pill.jsx'
import { cuisineName, mealTypeName } from '../../data/lookups.js'
import { spiceLevelLabel } from '../../utils/constants.js'

export default function RecipeCard({ recipe }) {
  return (
    <Link to={`/recipes/${recipe.id}`} className="recipe-card" style={{ '--accent': recipe.accentColor }}>
      <div className="recipe-card-image">
        <RecipeImage src={recipe.coverImageUrl} alt={recipe.title} />
        {recipe.isUserCreated && <span className="recipe-card-badge">My recipe</span>}
      </div>
      <div className="recipe-card-body">
        <h3>{recipe.title}</h3>
        {recipe.shortDescription && <p className="recipe-card-desc">{recipe.shortDescription}</p>}
        <div className="recipe-card-meta">
          <span>⏱ {recipe.totalTimeMinutes} min</span>
          <span>🍽 {recipe.servings} servings</span>
          <span>🌶 {spiceLevelLabel(recipe.spiceLevel)}</span>
        </div>
        <div className="recipe-card-pills">
          <Pill>{cuisineName(recipe.cuisineId)}</Pill>
          <Pill tone="accent">{mealTypeName(recipe.mealTypeId)}</Pill>
        </div>
      </div>
    </Link>
  )
}
