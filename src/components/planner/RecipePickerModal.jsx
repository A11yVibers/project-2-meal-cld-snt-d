import React, { useMemo, useState } from 'react'
import Modal from '../common/Modal.jsx'
import { useRecipes } from '../../context/RecipesContext.jsx'
import { recipeImageUrl } from '../../lib/image.js'

export default function RecipePickerModal({ title, onSelect, onClose }) {
  const { recipes } = useRecipes()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const term = search.toLowerCase()
    const list = term ? recipes.filter((r) => r.title.toLowerCase().includes(term)) : recipes
    return [...list].sort((a, b) => {
      if (a.availableForSuggestions !== b.availableForSuggestions) return a.availableForSuggestions ? -1 : 1
      return a.title.localeCompare(b.title)
    })
  }, [recipes, search])

  return (
    <Modal title={title} onClose={onClose} wide>
      <input
        type="search"
        autoFocus
        placeholder="Search recipes…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="picker-search"
      />
      <div className="picker-list">
        {filtered.map((recipe) => (
          <button key={recipe.id} type="button" className="picker-list__item" onClick={() => onSelect(recipe)}>
            <img src={recipeImageUrl(recipe)} alt="" />
            <div>
              <strong>{recipe.title}</strong>
              <span className="muted">{recipe.totalTimeMinutes} min</span>
            </div>
          </button>
        ))}
        {filtered.length === 0 && <p className="empty-state">No recipes found.</p>}
      </div>
    </Modal>
  )
}
