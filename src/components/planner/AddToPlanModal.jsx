import React, { useState } from 'react'
import Modal from '../common/Modal.jsx'
import { usePlanner } from '../../state/PlannerContext.jsx'
import { CURRENT_WEEK_START, addWeeks, formatWeekRange } from '../../utils/dates.js'
import { MEAL_SLOTS, DAY_LABELS } from '../../utils/constants.js'

export default function AddToPlanModal({ recipe, onClose, onAdded }) {
  const { assignRecipe, getAssignment } = usePlanner()
  const [weekStart, setWeekStart] = useState(CURRENT_WEEK_START)
  const [dayIndex, setDayIndex] = useState(0)
  const defaultSlot = MEAL_SLOTS.find((s) => s.id === recipe.mealTypeId)?.key ?? 'dinner'
  const [mealSlotKey, setMealSlotKey] = useState(defaultSlot)

  const existing = getAssignment(weekStart, dayIndex, mealSlotKey)

  function handleConfirm() {
    assignRecipe({ weekStart, dayIndex, mealSlotKey, recipeId: recipe.id })
    const dayLabel = DAY_LABELS[dayIndex]
    const slotLabel = MEAL_SLOTS.find((s) => s.key === mealSlotKey)?.label
    onAdded?.(`Added "${recipe.title}" to ${dayLabel} ${slotLabel}, week of ${formatWeekRange(weekStart)}.`)
    onClose()
  }

  return (
    <Modal title={`Add "${recipe.title}" to meal plan`} onClose={onClose}>
      <div className="form-field">
        <label>Meal-planning week</label>
        <div className="week-nav">
          <button type="button" className="btn" onClick={() => setWeekStart((w) => addWeeks(w, -1))}>‹ Prev</button>
          <span>{formatWeekRange(weekStart)}</span>
          <button type="button" className="btn" onClick={() => setWeekStart((w) => addWeeks(w, 1))}>Next ›</button>
        </div>
      </div>

      <div className="form-field">
        <label>Planned cooking date</label>
        <div className="chip-row">
          {DAY_LABELS.map((label, idx) => (
            <button
              key={label}
              type="button"
              className={`chip ${dayIndex === idx ? 'chip-active' : ''}`}
              onClick={() => setDayIndex(idx)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-field">
        <label>Planned serving time</label>
        <div className="chip-row">
          {MEAL_SLOTS.map((slot) => (
            <button
              key={slot.key}
              type="button"
              className={`chip ${mealSlotKey === slot.key ? 'chip-active' : ''}`}
              onClick={() => setMealSlotKey(slot.key)}
            >
              {slot.label}
            </button>
          ))}
        </div>
      </div>

      {existing && (
        <p className="modal-warning">This slot already has a recipe planned. Confirming will replace it.</p>
      )}

      <div className="modal-actions">
        <button type="button" className="btn" onClick={onClose}>Cancel</button>
        <button type="button" className="btn btn-primary" onClick={handleConfirm}>
          {existing ? 'Replace slot' : 'Add to plan'}
        </button>
      </div>
    </Modal>
  )
}
