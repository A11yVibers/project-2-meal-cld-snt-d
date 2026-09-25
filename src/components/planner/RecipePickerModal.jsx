import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Modal from '../common/Modal.jsx'
import RecipeImage from '../common/RecipeImage.jsx'
import { useRecipes } from '../../state/RecipesContext.jsx'
import { usePlanner } from '../../state/PlannerContext.jsx'

export default function RecipePickerModal({ weekStart, dayIndex, mealSlotKey, dayLabel, slotLabel, onClose }) {
  const { recipes, getRecipe } = useRecipes()
  const { getAssignment, assignRecipe, removeAssignment } = usePlanner()
  const [query, setQuery] = useState('')

  const currentAssignment = getAssignment(weekStart, dayIndex, mealSlotKey)
  const currentRecipe = currentAssignment ? getRecipe(currentAssignment.recipeId) : null

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = recipes.filter((r) => !q || r.title.toLowerCase().includes(q))
    return [...list].sort((a, b) => {
      if (a.includeInMealSuggestions !== b.includeInMealSuggestions) {
        return a.includeInMealSuggestions ? -1 : 1
      }
      return a.title.localeCompare(b.title)
    })
  }, [recipes, query])

  function pick(recipeId) {
    assignRecipe({ weekStart, dayIndex, mealSlotKey, recipeId })
    onClose()
  }

  function remove() {
    removeAssignment(weekStart, dayIndex, mealSlotKey)
    onClose()
  }

  return (
    <Modal title={`${dayLabel} · ${slotLabel}`} onClose={onClose} wide>
      {currentRecipe && (
        <div className="picker-current">
          <RecipeImage src={currentRecipe.coverImageUrl} alt={currentRecipe.title} className="picker-current-image" />
          <div>
            <p className="picker-current-label">Currently planned</p>
            <strong>{currentRecipe.title}</strong>
          </div>
          <div className="picker-current-actions">
            <Link to={`/recipes/${currentRecipe.id}`} className="btn" onClick={onClose}>View recipe</Link>
            <button type="button" className="btn btn-danger" onClick={remove}>Remove</button>
          </div>
        </div>
      )}

      <div className="form-field">
        <label htmlFor="picker-search">{currentRecipe ? 'Replace with...' : 'Choose a recipe'}</label>
        <input
          id="picker-search"
          type="search"
          placeholder="Search recipes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <ul className="picker-list">
        {filtered.map((r) => (
          <li key={r.id}>
            <button type="button" className="picker-list-item" onClick={() => pick(r.id)}>
              <RecipeImage src={r.coverImageUrl} alt={r.title} className="picker-list-image" />
              <span className="picker-list-title">
                {r.title}
                {r.includeInMealSuggestions && <span className="pill pill-accent">Suggested</span>}
              </span>
            </button>
          </li>
        ))}
        {filtered.length === 0 && <p className="empty-state">No recipes match "{query}".</p>}
      </ul>
    </Modal>
  )
}
