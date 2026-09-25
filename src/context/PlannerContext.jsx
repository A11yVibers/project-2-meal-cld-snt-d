import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { loadJSON, saveJSON, STORAGE_KEYS } from '../lib/storage.js'
import { getWeekStart, addWeeksToIso } from '../lib/date.js'
import { PLANNER_SLOTS } from '../data/lookups.js'

const PlannerContext = createContext(null)

function loadPlan() {
  return loadJSON(STORAGE_KEYS.plan, {})
}

export function PlannerProvider({ children }) {
  const [plan, setPlan] = useState(loadPlan)
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getWeekStart(new Date()))

  const persist = useCallback((next) => {
    setPlan(next)
    saveJSON(STORAGE_KEYS.plan, next)
  }, [])

  const getWeekPlan = useCallback((weekStart) => plan[weekStart] || {}, [plan])

  const getSlot = useCallback(
    (weekStart, dayIndex, slotName) => plan[weekStart]?.[dayIndex]?.[slotName] || null,
    [plan]
  )

  const assignRecipe = useCallback(
    (weekStart, dayIndex, slotName, recipeId, extra = {}) => {
      if (!PLANNER_SLOTS.includes(slotName)) return
      const next = { ...plan }
      const week = { ...(next[weekStart] || {}) }
      const day = { ...(week[dayIndex] || {}) }
      day[slotName] = { recipeId, ...extra }
      week[dayIndex] = day
      next[weekStart] = week
      persist(next)
    },
    [plan, persist]
  )

  const removeAssignment = useCallback(
    (weekStart, dayIndex, slotName) => {
      const next = { ...plan }
      const week = { ...(next[weekStart] || {}) }
      const day = { ...(week[dayIndex] || {}) }
      day[slotName] = null
      week[dayIndex] = day
      next[weekStart] = week
      persist(next)
    },
    [plan, persist]
  )

  const goToNextWeek = useCallback(() => setCurrentWeekStart((w) => addWeeksToIso(w, 1)), [])
  const goToPrevWeek = useCallback(() => setCurrentWeekStart((w) => addWeeksToIso(w, -1)), [])
  const goToToday = useCallback(() => setCurrentWeekStart(getWeekStart(new Date())), [])
  const goToWeek = useCallback((weekStart) => setCurrentWeekStart(weekStart), [])

  const value = useMemo(
    () => ({
      plan,
      currentWeekStart,
      getWeekPlan,
      getSlot,
      assignRecipe,
      removeAssignment,
      goToNextWeek,
      goToPrevWeek,
      goToToday,
      goToWeek,
    }),
    [plan, currentWeekStart, getWeekPlan, getSlot, assignRecipe, removeAssignment, goToNextWeek, goToPrevWeek, goToToday, goToWeek]
  )

  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>
}

export function usePlanner() {
  const ctx = useContext(PlannerContext)
  if (!ctx) throw new Error('usePlanner must be used within a PlannerProvider')
  return ctx
}
