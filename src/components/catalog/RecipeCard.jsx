import React from 'react'
import { Link } from 'react-router-dom'
import { recipeImageUrl } from '../../lib/image.js'
import { cuisineName, mealTypeName, dietaryTagNames } from '../../data/lookups.js'

const SPICE_ICON = '🌶️'

export default function RecipeCard({ recipe }) {
  const tags = dietaryTagNames(recipe.dietaryTagIds)

  return (
    <Link to={`/recipes/${recipe.id}`} className="recipe-card" style={{ '--accent': recipe.accentColor || '#D97757' }}>
      <div className="recipe-card__image-wrap">
        <img src={recipeImageUrl(recipe)} alt="" className="recipe-card__image" loading="lazy" />
        {recipe.isUserCreated && <span className="badge badge--user">Your recipe</span>}
      </div>
      <div className="recipe-card__body">
        <h3 className="recipe-card__title">{recipe.title}</h3>
        <p className="recipe-card__desc">{recipe.shortDescription}</p>
        <div className="recipe-card__meta">
          <span>{cuisineName(recipe.cuisineId)}</span>
          <span>·</span>
          <span>{mealTypeName(recipe.mealTypeId)}</span>
          <span>·</span>
          <span>{recipe.totalTimeMinutes} min</span>
          {recipe.spiceLevel > 0 && (
            <>
              <span>·</span>
              <span aria-label={`Spice level ${recipe.spiceLevel} of 5`}>{SPICE_ICON.repeat(recipe.spiceLevel)}</span>
            </>
          )}
        </div>
        {tags.length > 0 && (
          <div className="recipe-card__tags">
            {tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
