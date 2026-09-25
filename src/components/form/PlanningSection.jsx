import React from 'react'
import { addWeeks, formatWeekRange } from '../../utils/dates.js'
import { MEAL_SLOTS, DAY_LABELS } from '../../utils/constants.js'

export default function PlanningSection({ draft, patch }) {
  const planning = draft.planning

  function patchPlanning(changes) {
    patch({ planning: { ...planning, ...changes } })
  }

  return (
    <fieldset className="form-section">
      <legend>Meal planning options</legend>

      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={draft.includeInMealSuggestions}
          onChange={(e) => patch({ includeInMealSuggestions: e.target.checked })}
        />
        Make this recipe available in meal-plan suggestions
      </label>

      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={planning.addToPlanNow}
          onChange={(e) => patchPlanning({ addToPlanNow: e.target.checked })}
        />
        Immediately add this recipe to the meal plan
      </label>

      {planning.addToPlanNow && (
        <div className="planning-details">
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={planning.useExactDateTime}
              onChange={(e) => patchPlanning({ useExactDateTime: e.target.checked })}
            />
            Use a specific date &amp; time instead
          </label>

          {planning.useExactDateTime ? (
            <div className="form-field">
              <label htmlFor="exactDateTime">Planned date and time</label>
              <input
                id="exactDateTime"
                type="datetime-local"
                value={planning.exactDateTime}
                onChange={(e) => patchPlanning({ exactDateTime: e.target.value })}
              />
              <p className="field-hint">The closest meal slot (breakfast, lunch, dinner or snack) will be assigned automatically based on this time.</p>
            </div>
          ) : (
            <>
              <div className="form-field">
                <label>Meal-planning week</label>
                <div className="week-nav">
                  <button type="button" className="btn" onClick={() => patchPlanning({ weekStart: addWeeks(planning.weekStart, -1) })}>‹ Prev</button>
                  <span>{formatWeekRange(planning.weekStart)}</span>
                  <button type="button" className="btn" onClick={() => patchPlanning({ weekStart: addWeeks(planning.weekStart, 1) })}>Next ›</button>
                </div>
              </div>

              <div className="form-field">
                <label>Planned cooking date</label>
                <div className="chip-row">
                  {DAY_LABELS.map((label, idx) => (
                    <button
                      key={label}
                      type="button"
                      className={`chip ${planning.dayIndex === idx ? 'chip-active' : ''}`}
                      onClick={() => patchPlanning({ dayIndex: idx })}
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
                      className={`chip ${planning.mealSlotKey === slot.key ? 'chip-active' : ''}`}
                      onClick={() => patchPlanning({ mealSlotKey: slot.key })}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </fieldset>
  )
}
