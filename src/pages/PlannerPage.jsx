import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlanner } from '../state/PlannerContext.jsx'
import { useRecipes } from '../state/RecipesContext.jsx'
import RecipeImage from '../components/common/RecipeImage.jsx'
import RecipePickerModal from '../components/planner/RecipePickerModal.jsx'
import { CURRENT_WEEK_START, addWeeks, addDays, formatWeekRange, formatShortDate } from '../utils/dates.js'
import { DAY_LABELS, DAY_LABELS_SHORT, MEAL_SLOTS } from '../utils/constants.js'

export default function PlannerPage() {
  const [weekStart, setWeekStart] = useState(CURRENT_WEEK_START)
  const [activeSlot, setActiveSlot] = useState(null) // { dayIndex, mealSlotKey }
  const { getAssignment } = usePlanner()
  const { getRecipe } = useRecipes()

  const isCurrentWeek = weekStart === CURRENT_WEEK_START

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Weekly meal planner</h1>
          <p className="page-subtitle">Plan Breakfast, Lunch, Dinner and Snacks for each day of the week.</p>
        </div>
        <Link to="/shopping-list" className="btn btn-primary">View shopping list →</Link>
      </div>

      <div className="week-nav week-nav-large">
        <button type="button" className="btn" onClick={() => setWeekStart((w) => addWeeks(w, -1))}>‹ Previous week</button>
        <div className="week-nav-current">
          <strong>{formatWeekRange(weekStart)}</strong>
          {!isCurrentWeek && (
            <button type="button" className="btn btn-link" onClick={() => setWeekStart(CURRENT_WEEK_START)}>Jump to this week</button>
          )}
        </div>
        <button type="button" className="btn" onClick={() => setWeekStart((w) => addWeeks(w, 1))}>Next week ›</button>
      </div>

      <div className="planner-grid">
        <div className="planner-grid-corner" />
        {DAY_LABELS.map((label, idx) => (
          <div key={label} className="planner-day-header">
            <span>{DAY_LABELS_SHORT[idx]}</span>
            <span className="planner-day-date">{formatShortDate(addDays(weekStart, idx))}</span>
          </div>
        ))}

        {MEAL_SLOTS.map((slot) => (
          <React.Fragment key={slot.key}>
            <div className="planner-slot-header">{slot.label}</div>
            {DAY_LABELS.map((_, dayIndex) => {
              const assignment = getAssignment(weekStart, dayIndex, slot.key)
              const recipe = assignment ? getRecipe(assignment.recipeId) : null
              return (
                <button
                  type="button"
                  key={dayIndex}
                  className={`planner-cell ${recipe ? 'planner-cell-filled' : 'planner-cell-empty'}`}
                  onClick={() => setActiveSlot({ dayIndex, mealSlotKey: slot.key })}
                  style={recipe ? { '--accent': recipe.accentColor } : undefined}
                >
                  {recipe ? (
                    <>
                      <RecipeImage src={recipe.coverImageUrl} alt={recipe.title} className="planner-cell-image" />
                      <span className="planner-cell-title">{recipe.title}</span>
                      {assignment.plannedTime && <span className="planner-cell-time">{assignment.plannedTime}</span>}
                    </>
                  ) : (
                    <span className="planner-cell-add">+ Add</span>
                  )}
                </button>
              )
            })}
          </React.Fragment>
        ))}
      </div>

      {activeSlot && (
        <RecipePickerModal
          weekStart={weekStart}
          dayIndex={activeSlot.dayIndex}
          mealSlotKey={activeSlot.mealSlotKey}
          dayLabel={DAY_LABELS[activeSlot.dayIndex]}
          slotLabel={MEAL_SLOTS.find((s) => s.key === activeSlot.mealSlotKey)?.label}
          onClose={() => setActiveSlot(null)}
        />
      )}
    </div>
  )
}
