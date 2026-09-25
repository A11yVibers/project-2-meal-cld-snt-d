import React, { useMemo, useState } from 'react'
import Modal from '../common/Modal.jsx'
import { usePlanner } from '../../context/PlannerContext.jsx'
import { PLANNER_SLOTS } from '../../data/lookups.js'
import { DAY_LABELS, addWeeksToIso, getWeekStart, weekDates, formatFriendlyDate, formatWeekRangeLabel } from '../../lib/date.js'

// Modal used from the recipe detail page to add a specific recipe into a
// chosen slot of the weekly meal plan.
export default function AddToPlanModal({ recipe, onClose }) {
  const { assignRecipe, currentWeekStart } = usePlanner()
  const [weekChoice, setWeekChoice] = useState('current')
  const [dayIndex, setDayIndex] = useState(0)
  const [slot, setSlot] = useState('Dinner')
  const [saved, setSaved] = useState(false)

  const weekStart = useMemo(() => {
    if (weekChoice === 'current') return getWeekStart(new Date())
    if (weekChoice === 'next') return addWeeksToIso(getWeekStart(new Date()), 1)
    return currentWeekStart
  }, [weekChoice, currentWeekStart])

  const days = useMemo(() => weekDates(weekStart), [weekStart])

  function handleSubmit(e) {
    e.preventDefault()
    assignRecipe(weekStart, dayIndex, slot, recipe.id)
    setSaved(true)
  }

  return (
    <Modal title={`Add "${recipe.title}" to meal plan`} onClose={onClose}>
      {saved ? (
        <div className="modal-success">
          <p>
            Added to {slot} on {formatFriendlyDate(days[dayIndex])}.
          </p>
          <button type="button" className="btn btn--primary" onClick={onClose}>
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="stack-form">
          <label>
            Meal-planning week
            <select value={weekChoice} onChange={(e) => setWeekChoice(e.target.value)}>
              <option value="current">This week ({formatWeekRangeLabel(getWeekStart(new Date()))})</option>
              <option value="next">Next week ({formatWeekRangeLabel(addWeeksToIso(getWeekStart(new Date()), 1))})</option>
              <option value="viewing">Week currently viewed in planner ({formatWeekRangeLabel(currentWeekStart)})</option>
            </select>
          </label>

          <label>
            Planned cooking date
            <select value={dayIndex} onChange={(e) => setDayIndex(Number(e.target.value))}>
              {days.map((d, i) => (
                <option key={d} value={i}>
                  {DAY_LABELS[i]} · {formatFriendlyDate(d)}
                </option>
              ))}
            </select>
          </label>

          <label>
            Planned serving time
            <select value={slot} onChange={(e) => setSlot(e.target.value)}>
              {PLANNER_SLOTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <div className="modal-actions">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              Add to plan
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
