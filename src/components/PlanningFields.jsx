import React, { useMemo } from 'react'
import { addWeeks, addDays, startOfWeek, toKey, fromKey, formatWeekRange, MEAL_SLOTS } from '../lib/dates.js'

// Shared controls for "which week / which day / which meal slot / optional
// exact time" - used both by the New Recipe form's meal-planning section and
// by the "Add to meal plan" modal opened from a recipe's detail view.
export default function PlanningFields({ value, onChange }) {
  const weekOptions = useMemo(() => {
    const base = startOfWeek(new Date())
    return Array.from({ length: 10 }, (_, i) => {
      const offset = i - 1 // one week back, then this week + 8 ahead
      const weekStart = addWeeks(base, offset)
      const key = toKey(weekStart)
      const label = offset === 0 ? `This week (${formatWeekRange(weekStart)})` : formatWeekRange(weekStart)
      return { key, label }
    })
  }, [])

  const weekKey = value.weekKey || weekOptions[1].key
  const weekStart = fromKey(weekKey)
  const minDate = weekKey
  const maxDate = toKey(addDays(weekStart, 6))

  function handleWeekChange(newWeekKey) {
    onChange({ ...value, weekKey: newWeekKey, date: newWeekKey })
  }

  return (
    <div className="planning-fields">
      <label className="field">
        <span className="field__label">Meal-planning week</span>
        <select className="input" value={weekKey} onChange={(e) => handleWeekChange(e.target.value)}>
          {weekOptions.map((w) => (
            <option key={w.key} value={w.key}>
              {w.label}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span className="field__label">Planned cooking date</span>
        <input
          className="input"
          type="date"
          min={minDate}
          max={maxDate}
          value={value.date || weekKey}
          onChange={(e) => onChange({ ...value, date: e.target.value })}
        />
      </label>

      <label className="field">
        <span className="field__label">Planned serving time</span>
        <select className="input" value={value.slot || MEAL_SLOTS[0]} onChange={(e) => onChange({ ...value, slot: e.target.value })}>
          {MEAL_SLOTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span className="field__label">Specific date &amp; time (optional)</span>
        <input
          className="input"
          type="datetime-local"
          value={value.specificDateTime || ''}
          onChange={(e) => onChange({ ...value, specificDateTime: e.target.value })}
        />
      </label>
    </div>
  )
}
