import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRecipes } from '../../context/RecipesContext.jsx'
import { cuisines, mealTypes } from '../../data/lookups.js'
import RecipeCard from './RecipeCard.jsx'

export default function RecipeCatalog() {
  const { recipes } = useRecipes()
  const [search, setSearch] = useState('')
  const [cuisineFilter, setCuisineFilter] = useState('')
  const [mealTypeFilter, setMealTypeFilter] = useState('')

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false
      if (cuisineFilter && r.cuisineId !== cuisineFilter) return false
      if (mealTypeFilter && r.mealTypeId !== mealTypeFilter) return false
      return true
    })
  }, [recipes, search, cuisineFilter, mealTypeFilter])

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Recipes</h1>
          <p className="muted">Browse your recipe catalog or add a new one.</p>
        </div>
        <Link to="/recipes/new" className="btn btn--primary">
          + Add recipe
        </Link>
      </div>

      <div className="catalog-filters">
        <input
          type="search"
          placeholder="Search recipes…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search recipes"
        />
        <select value={cuisineFilter} onChange={(e) => setCuisineFilter(e.target.value)} aria-label="Filter by cuisine">
          <option value="">All cuisines</option>
          {cuisines.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select value={mealTypeFilter} onChange={(e) => setMealTypeFilter(e.target.value)} aria-label="Filter by meal type">
          <option value="">All meal types</option>
          {mealTypes.map((m) => (
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
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}
