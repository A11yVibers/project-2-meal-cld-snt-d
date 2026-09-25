import React, { useEffect, useMemo, useRef, useState } from 'react'
import { INGREDIENTS, INGREDIENTS_BY_NAME } from '../../data/lookups.js'

// Searchable combobox for picking an ingredient from the supplied
// ingredients.csv lookup, while still allowing a freeform/custom ingredient
// name to be typed in if the desired item isn't in the list.
export default function IngredientSearchSelect({ ingredientId, ingredientName, onChange, placeholder = 'Search ingredients...' }) {
  const [text, setText] = useState(ingredientName || '')
  const [open, setOpen] = useState(false)
  const blurTimeout = useRef(null)

  useEffect(() => {
    setText(ingredientName || '')
  }, [ingredientId, ingredientName])

  const matches = useMemo(() => {
    const q = text.trim().toLowerCase()
    if (!q) return INGREDIENTS.slice(0, 8)
    return INGREDIENTS.filter((i) => i.name.toLowerCase().includes(q)).slice(0, 8)
  }, [text])

  function pick(opt) {
    setText(opt.name)
    setOpen(false)
    onChange({ ingredientId: opt.id, ingredientName: opt.name })
  }

  function handleTextChange(value) {
    setText(value)
    setOpen(true)
    const exact = INGREDIENTS_BY_NAME.get(value.trim().toLowerCase())
    onChange({ ingredientId: exact ? exact.id : null, ingredientName: value })
  }

  return (
    <div className="ingredient-search">
      <input
        type="text"
        value={text}
        placeholder={placeholder}
        onChange={(e) => handleTextChange(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          blurTimeout.current = setTimeout(() => setOpen(false), 120)
        }}
      />
      {open && matches.length > 0 && (
        <ul className="ingredient-search-dropdown">
          {matches.map((opt) => (
            <li key={opt.id}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault()
                  clearTimeout(blurTimeout.current)
                  pick(opt)
                }}
              >
                {opt.name}
                <span className="ingredient-search-category">{opt.shoppingCategory}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {!ingredientId && text.trim() && (
        <div className="ingredient-search-hint">Using custom ingredient "{text.trim()}"</div>
      )}
    </div>
  )
}
