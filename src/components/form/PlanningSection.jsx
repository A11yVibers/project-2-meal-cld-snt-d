import React from 'react'
import { PLANNER_SLOTS } from '../../data/lookups.js'
import { weekStartFromChoice } from './formModel.js'
import { formatWeekRangeLabel, weekDates } from '../../lib/date.js'

export default function PlanningSection({ draft, patch }) {
  const mp = draft.mealPlanning

  function patchPlanning(fields) {
    patch({ mealPlanning: { ...mp, ...fields } })
  }

  const weekStart = weekStartFromChoice(mp)
  const days = weekDates(weekStart)

  return (
    <fieldset className="form-section">
      <legend>Meal planning options</legend>

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={mp.availableForSuggestions}
          onChange={(e) => patchPlanning({ availableForSuggestions: e.target.checked })}
        />
        Make this recipe available in meal-plan suggestions
      </label>

      <label className="checkbox-row">
        <input type="checkbox" checked={mp.addToMealPlanNow} onChange={(e) => patchPlanning({ addToMealPlanNow: e.target.checked })} />
        Add this recipe to the meal plan immediately
      </label>

      {mp.addToMealPlanNow && (
        <div className="planning-fields">
          <label>
            Meal-planning week
            <select value={mp.weekChoice} onChange={(e) => patchPlanning({ weekChoice: e.target.value })}>
              <option value="current">This week ({formatWeekRangeLabel(weekStartFromChoice({ weekChoice: 'current' }))})</option>
              <option value="next">Next week ({formatWeekRangeLabel(weekStartFromChoice({ weekChoice: 'next' }))})</option>
            </select>
          </label>

          <label>
            Planned cooking date
            <select value={mp.plannedDate} onChange={(e) => patchPlanning({ plannedDate: e.target.value })}>
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>

          <label>
            Planned serving time
            <select value={mp.plannedSlot} onChange={(e) => patchPlanning({ plannedSlot: e.target.value })}>
              {PLANNER_SLOTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="checkbox-row">
            <input type="checkbox" checked={mp.useExactTime} onChange={(e) => patchPlanning({ useExactTime: e.target.checked })} />
            Use a specific date and time
          </label>

          {mp.useExactTime && (
            <label>
              Exact date &amp; time
              <input
                type="datetime-local"
                value={mp.exactDateTime}
                onChange={(e) => patchPlanning({ exactDateTime: e.target.value })}
              />
            </label>
          )}
        </div>
      )}
    </fieldset>
  )
}
