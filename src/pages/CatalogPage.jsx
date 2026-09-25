import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRecipes } from '../state/RecipesContext.jsx'
import RecipeCard from '../components/catalog/RecipeCard.jsx'
import { CUISINES, MEAL_TYPES } from '../data/lookups.js'

export default function CatalogPage() {
  const { recipes } = useRecipes()
  const [query, setQuery] = useState('')
  const [cuisineId, setCuisineId] = useState('')
  const [mealTypeId, setMealTypeId] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return recipes.filter((r) => {
      if (q && !r.title.toLowerCase().includes(q) && !r.shortDescription.toLowerCase().includes(q)) return false
      if (cuisineId && r.cuisineId !== cuisineId) return false
      if (mealTypeId && r.mealTypeId !== mealTypeId) return false
      return true
    })
  }, [recipes, query, cuisineId, mealTypeId])

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Recipe catalog</h1>
          <p className="page-subtitle">Browse seed recipes and anything you've added yourself.</p>
        </div>
        <Link to="/recipes/new" className="btn btn-primary">+ New recipe</Link>
      </div>

      <div className="catalog-filters">
        <input
          type="search"
          placeholder="Search recipes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="catalog-search"
        />
        <select value={cuisineId} onChange={(e) => setCuisineId(e.target.value)}>
          <option value="">All cuisines</option>
          {CUISINES.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select value={mealTypeId} onChange={(e) => setMealTypeId(e.target.value)}>
          <option value="">All meal types</option>
          {MEAL_TYPES.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">No recipes match your filters yet.</p>
      ) : (
        <div className="recipe-grid">
          {filtered.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      )}
    </div>
  )
}
