import React, { useMemo, useState } from 'react'
import { useAppData } from '../context/AppDataContext.jsx'
import { CUISINES, MEAL_TYPES } from '../data/csvData.js'
import RecipeCard from './RecipeCard.jsx'

export default function RecipeCatalog({ onOpenRecipe, onNewRecipe }) {
  const { recipes } = useAppData()
  const [query, setQuery] = useState('')
  const [cuisineFilter, setCuisineFilter] = useState('')
  const [mealTypeFilter, setMealTypeFilter] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return recipes.filter((r) => {
      if (q && !r.title.toLowerCase().includes(q)) return false
      if (cuisineFilter && r.cuisineId !== cuisineFilter) return false
      if (mealTypeFilter && r.mealTypeId !== mealTypeFilter) return false
      return true
    })
  }, [recipes, query, cuisineFilter, mealTypeFilter])

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1>Recipes</h1>
          <p className="page__subtitle">Browse seed recipes or add your own.</p>
        </div>
        <button className="btn btn--primary" onClick={onNewRecipe}>
          + New Recipe
        </button>
      </div>

      <div className="toolbar">
        <input
          className="input"
          type="search"
          placeholder="Search recipes…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search recipes"
        />
        <select className="input" value={cuisineFilter} onChange={(e) => setCuisineFilter(e.target.value)}>
          <option value="">All cuisines</option>
          {CUISINES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select className="input" value={mealTypeFilter} onChange={(e) => setMealTypeFilter(e.target.value)}>
          <option value="">All meal types</option>
          {MEAL_TYPES.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">No recipes match your filters yet.</p>
      ) : (
        <div className="recipe-grid">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onOpen={onOpenRecipe} />
          ))}
        </div>
      )}
    </div>
  )
}
