import React, { createContext, useContext, useMemo } from 'react'
import { usePersistentState } from './storage.js'
import { makeId } from '../utils/ids.js'
import { MEAL_SLOTS } from '../utils/constants.js'

const STORAGE_KEY = 'mealplanner.plan.v1'

const PlannerContext = createContext(null)

function slotKey(weekStart, dayIndex, mealSlotKey) {
  return `${weekStart}__${dayIndex}__${mealSlotKey}`
}

export function PlannerProvider({ children }) {
  const [assignments, setAssignments] = usePersistentState(STORAGE_KEY, [])

  const bySlot = useMemo(() => {
    const map = new Map()
    for (const a of assignments) {
      map.set(slotKey(a.weekStart, a.dayIndex, a.mealSlotKey), a)
    }
    return map
  }, [assignments])

  function getAssignment(weekStart, dayIndex, mealSlotKey) {
    return bySlot.get(slotKey(weekStart, dayIndex, mealSlotKey)) ?? null
  }

  function getAssignmentsForWeek(weekStart) {
    return assignments.filter((a) => a.weekStart === weekStart)
  }

  // Assigns (or replaces) the recipe in a given day/slot for a given week.
  function assignRecipe({ weekStart, dayIndex, mealSlotKey, recipeId, plannedTime = null }) {
    if (!MEAL_SLOTS.some((s) => s.key === mealSlotKey)) return
    setAssignments((prev) => {
      const existingIndex = prev.findIndex(
        (a) => a.weekStart === weekStart && a.dayIndex === dayIndex && a.mealSlotKey === mealSlotKey
      )
      const next = [...prev]
      const entry = {
        id: existingIndex >= 0 ? prev[existingIndex].id : makeId('plan'),
        weekStart,
        dayIndex,
        mealSlotKey,
        recipeId,
        plannedTime,
      }
      if (existingIndex >= 0) next[existingIndex] = entry
      else next.push(entry)
      return next
    })
  }

  function removeAssignment(weekStart, dayIndex, mealSlotKey) {
    setAssignments((prev) =>
      prev.filter((a) => !(a.weekStart === weekStart && a.dayIndex === dayIndex && a.mealSlotKey === mealSlotKey))
    )
  }

  const value = {
    assignments,
    getAssignment,
    getAssignmentsForWeek,
    assignRecipe,
    removeAssignment,
  }

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>
}

export function usePlanner() {
  const ctx = useContext(PlannerContext)
  if (!ctx) throw new Error('usePlanner must be used within PlannerProvider')
  return ctx
}
