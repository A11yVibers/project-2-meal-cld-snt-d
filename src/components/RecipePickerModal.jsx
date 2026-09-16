import React, { useMemo, useState } from 'react'
import { useAppData } from '../context/AppDataContext.jsx'
import { APPROVED_IMAGES } from '../approved-images.js'
import Modal from './Modal.jsx'

// A recipe search/browse list rendered inside a modal, used when assigning a
// recipe to a planner slot.
export default function RecipePickerModal({ title = 'Choose a recipe', onPick, onClose }) {
  const { recipes } = useAppData()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return recipes
    return recipes.filter((r) => r.title.toLowerCase().includes(q))
  }, [recipes, query])

  return (
    <Modal title={title} onClose={onClose} wide>
      <input
        className="input"
        type="search"
        placeholder="Search recipes…"
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="picker-list">
        {filtered.map((r) => (
          <button key={r.id} className="picker-list__item" onClick={() => onPick(r.id)}>
            <img
              src={r.coverImageUrl || APPROVED_IMAGES.placeholder}
              alt=""
              onError={(e) => {
                e.currentTarget.src = APPROVED_IMAGES.placeholder
              }}
            />
            <div>
              <div className="picker-list__title">{r.title}</div>
              <div className="picker-list__meta">
                {r.totalTime} min · Serves {r.servings}
              </div>
            </div>
          </button>
        ))}
        {filtered.length === 0 && <p className="empty-state">No recipes found.</p>}
      </div>
    </Modal>
  )
}
