import React, { useState } from 'react'
import { useAppData } from '../context/AppDataContext.jsx'
import { weekdayIndexFromKey, startOfWeek, toKey, MEAL_SLOTS } from '../lib/dates.js'
import Modal from './Modal.jsx'
import PlanningFields from './PlanningFields.jsx'

export default function AddToPlanModal({ recipe, onClose }) {
  const { setSlot } = useAppData()
  const [fields, setFields] = useState(() => {
    const weekKey = toKey(startOfWeek(new Date()))
    return { weekKey, date: weekKey, slot: MEAL_SLOTS[0], specificDateTime: '' }
  })

  function handleConfirm() {
    const weekKey = fields.weekKey
    const date = fields.date || weekKey
    if (!weekKey || !date) return
    const dayIdx = weekdayIndexFromKey(date)
    setSlot(weekKey, dayIdx, fields.slot || MEAL_SLOTS[0], recipe.id, {
      specificDateTime: fields.specificDateTime || null,
    })
    onClose()
  }

  return (
    <Modal title={`Add "${recipe.title}" to meal plan`} onClose={onClose}>
      <PlanningFields value={fields} onChange={setFields} />
      <div className="modal__actions">
        <button className="btn" onClick={onClose}>
          Cancel
        </button>
        <button className="btn btn--primary" onClick={handleConfirm}>
          Add to plan
        </button>
      </div>
    </Modal>
  )
}
