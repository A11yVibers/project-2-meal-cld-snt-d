import React, { useState } from 'react'
import { useAppData } from '../context/AppDataContext.jsx'
import { APPROVED_IMAGES } from '../approved-images.js'
import Modal from './Modal.jsx'
import RecipePickerModal from './RecipePickerModal.jsx'

export default function PlanSlotModal({ weekKey, dayIdx, slot, dayLabel, onClose, onViewRecipe }) {
  const { mealPlan, setSlot, clearSlot, recipesById } = useAppData()
  const entry = mealPlan[weekKey]?.[dayIdx]?.[slot] || null
  const [picking, setPicking] = useState(!entry)

  if (picking) {
    return (
      <RecipePickerModal
        title={`${dayLabel} · ${slot}`}
        onClose={onClose}
        onPick={(recipeId) => {
          setSlot(weekKey, dayIdx, slot, recipeId)
          onClose()
        }}
      />
    )
  }

  const recipe = recipesById[entry.recipeId]
  if (!recipe) {
    clearSlot(weekKey, dayIdx, slot)
    onClose()
    return null
  }

  return (
    <Modal title={`${dayLabel} · ${slot}`} onClose={onClose}>
      <div className="picker-list__item picker-list__item--static">
        <img
          src={recipe.coverImageUrl || APPROVED_IMAGES.placeholder}
          alt=""
          onError={(e) => {
            e.currentTarget.src = APPROVED_IMAGES.placeholder
          }}
        />
        <div>
          <div className="picker-list__title">{recipe.title}</div>
          <div className="picker-list__meta">
            {recipe.totalTime} min · Serves {recipe.servings}
          </div>
          {entry.specificDateTime && <div className="picker-list__meta">At {entry.specificDateTime.replace('T', ' ')}</div>}
        </div>
      </div>
      <div className="modal__actions">
        <button className="btn" onClick={() => onViewRecipe(recipe.id)}>
          View recipe
        </button>
        <button className="btn" onClick={() => setPicking(true)}>
          Replace
        </button>
        <button
          className="btn btn--danger"
          onClick={() => {
            clearSlot(weekKey, dayIdx, slot)
            onClose()
          }}
        >
          Remove
        </button>
      </div>
    </Modal>
  )
}
