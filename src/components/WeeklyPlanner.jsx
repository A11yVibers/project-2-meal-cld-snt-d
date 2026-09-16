import React, { useState } from 'react'
import { useAppData } from '../context/AppDataContext.jsx'
import { APPROVED_IMAGES } from '../approved-images.js'
import { addWeeks, addDays, fromKey, toKey, startOfWeek, formatWeekRange, formatShort, DAY_NAMES, MEAL_SLOTS } from '../lib/dates.js'
import PlanSlotModal from './PlanSlotModal.jsx'

export default function WeeklyPlanner({ onOpenRecipe }) {
  const { currentWeekKey, setCurrentWeekKey, weekPlan, recipesById } = useAppData()
  const [activeSlot, setActiveSlot] = useState(null)

  const weekStart = fromKey(currentWeekKey)

  function goToWeek(offset) {
    setCurrentWeekKey(toKey(addWeeks(weekStart, offset)))
  }

  function goToToday() {
    setCurrentWeekKey(toKey(startOfWeek(new Date())))
  }

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1>Weekly Planner</h1>
          <p className="page__subtitle">Plan breakfast, lunch, dinner and snacks for the week.</p>
        </div>
      </div>

      <div className="week-nav">
        <button className="btn" onClick={() => goToWeek(-1)} aria-label="Previous week">
          ← Prev
        </button>
        <div className="week-nav__label">{formatWeekRange(weekStart)}</div>
        <button className="btn" onClick={() => goToWeek(1)} aria-label="Next week">
          Next →
        </button>
        <button className="btn btn--subtle" onClick={goToToday}>
          Today
        </button>
      </div>

      <div className="planner-grid">
        <div className="planner-grid__corner" />
        {DAY_NAMES.map((name, idx) => (
          <div className="planner-grid__day-header" key={name}>
            <div>{name}</div>
            <div className="planner-grid__date">{formatShort(addDays(weekStart, idx))}</div>
          </div>
        ))}

        {MEAL_SLOTS.map((slot) => (
          <React.Fragment key={slot}>
            <div className="planner-grid__slot-header">{slot}</div>
            {DAY_NAMES.map((dayName, dayIdx) => {
              const entry = weekPlan[dayIdx]?.[slot]
              const recipe = entry ? recipesById[entry.recipeId] : null
              return (
                <button
                  key={`${slot}-${dayIdx}`}
                  className={`planner-cell ${recipe ? 'planner-cell--filled' : ''}`}
                  onClick={() => setActiveSlot({ dayIdx, slot, dayLabel: dayName })}
                >
                  {recipe ? (
                    <>
                      <img
                        src={recipe.coverImageUrl || APPROVED_IMAGES.placeholder}
                        alt=""
                        onError={(e) => {
                          e.currentTarget.src = APPROVED_IMAGES.placeholder
                        }}
                      />
                      <span className="planner-cell__title">{recipe.title}</span>
                    </>
                  ) : (
                    <span className="planner-cell__add">+ Add</span>
                  )}
                </button>
              )
            })}
          </React.Fragment>
        ))}
      </div>

      {activeSlot && (
        <PlanSlotModal
          weekKey={currentWeekKey}
          dayIdx={activeSlot.dayIdx}
          slot={activeSlot.slot}
          dayLabel={activeSlot.dayLabel}
          onClose={() => setActiveSlot(null)}
          onViewRecipe={(id) => {
            setActiveSlot(null)
            onOpenRecipe(id)
          }}
        />
      )}
    </div>
  )
}
