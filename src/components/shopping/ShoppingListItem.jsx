import React from 'react'
import { useShoppingListState } from '../../state/ShoppingListContext.jsx'

export default function ShoppingListItem({ item }) {
  const { checked, pantry, toggleChecked, togglePantry } = useShoppingListState()
  const isChecked = !!checked[item.key]
  const inPantry = !!pantry[item.ingredientKey]

  return (
    <li className={`shopping-item ${isChecked ? 'shopping-item-checked' : ''}`}>
      <label className="shopping-item-main">
        <input type="checkbox" checked={isChecked} onChange={() => toggleChecked(item.key)} />
        <span className="shopping-item-text">
          {item.quantity != null && <strong>{item.quantity} {item.unit} </strong>}
          {item.quantity == null && item.unit && <strong>{item.unit} </strong>}
          {item.name}
          {item.optional && <span className="pill pill-muted">optional</span>}
          {inPantry && <span className="pill pill-accent">In pantry</span>}
        </span>
      </label>
      <div className="shopping-item-meta">
        <span className="shopping-item-recipes" title={item.recipeTitles.join(', ')}>
          {item.recipeTitles.length} recipe{item.recipeTitles.length === 1 ? '' : 's'}
        </span>
        <button type="button" className="btn btn-small" onClick={() => togglePantry(item.ingredientKey)}>
          {inPantry ? 'Remove from pantry' : "I already have this"}
        </button>
      </div>
    </li>
  )
}
