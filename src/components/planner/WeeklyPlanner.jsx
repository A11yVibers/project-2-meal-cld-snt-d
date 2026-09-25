import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlanner } from '../../context/PlannerContext.jsx'
import { useRecipes } from '../../context/RecipesContext.jsx'
import { PLANNER_SLOTS } from '../../data/lookups.js'
import { DAY_LABELS_SHORT, weekDates, formatFriendlyDate, formatWeekRangeLabel, todayIso } from '../../lib/date.js'
import { recipeImageUrl } from '../../lib/image.js'
import RecipePickerModal from './RecipePickerModal.jsx'

function SlotCell({ weekStart, dayIndex, slot }) {
  const { getSlot, assignRecipe, removeAssignment } = usePlanner()
  const { recipesById } = useRecipes()
  const [pickerOpen, setPickerOpen] = useState(false)

  const assignment = getSlot(weekStart, dayIndex, slot)
  const recipe = assignment ? recipesById.get(assignment.recipeId) : null

  function handleSelect(selected) {
    assignRecipe(weekStart, dayIndex, slot, selected.id)
    setPickerOpen(false)
  }

  return (
    <div className={`planner-slot ${recipe ? 'planner-slot--filled' : ''}`}>
      <span className="planner-slot__label">{slot}</span>
      {recipe ? (
        <div className="planner-slot__recipe">
          <Link to={`/recipes/${recipe.id}`} className="planner-slot__recipe-link">
            <img src={recipeImageUrl(recipe)} alt="" />
            <span>{recipe.title}</span>
          </Link>
          {assignment.time && <span className="tag tag--muted">{assignment.time}</span>}
          <div className="planner-slot__actions">
            <button type="button" onClick={() => setPickerOpen(true)}>
              Change
            </button>
            <button type="button" onClick={() => removeAssignment(weekStart, dayIndex, slot)}>
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button type="button" className="planner-slot__empty" onClick={() => setPickerOpen(true)}>
          + Add recipe
        </button>
      )}

      {pickerOpen && (
        <RecipePickerModal title={`Choose a recipe for ${slot}`} onSelect={handleSelect} onClose={() => setPickerOpen(false)} />
      )}
    </div>
  )
}

export default function WeeklyPlanner() {
  const { currentWeekStart, goToNextWeek, goToPrevWeek, goToToday } = usePlanner()
  const days = weekDates(currentWeekStart)
  const today = todayIso()

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Weekly meal planner</h1>
          <p className="muted">{formatWeekRangeLabel(currentWeekStart)}</p>
        </div>
        <div className="week-nav">
          <button type="button" className="btn" onClick={goToPrevWeek}>
            ← Previous week
          </button>
          <button type="button" className="btn" onClick={goToToday}>
            Today
          </button>
          <button type="button" className="btn" onClick={goToNextWeek}>
            Next week →
          </button>
        </div>
      </div>

      <div className="planner-grid">
        {days.map((date, dayIndex) => (
          <div key={date} className={`planner-day ${date === today ? 'planner-day--today' : ''}`}>
            <div className="planner-day__header">
              <span>{DAY_LABELS_SHORT[dayIndex]}</span>
              <span className="muted">{formatFriendlyDate(date)}</span>
            </div>
            {PLANNER_SLOTS.map((slot) => (
              <SlotCell key={slot} weekStart={currentWeekStart} dayIndex={dayIndex} slot={slot} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
