import React, { createContext, useContext, useMemo, useCallback } from 'react'
import { SEED_RECIPES, INGREDIENTS_BY_ID } from '../data/csvData.js'
import { useStoredState } from '../lib/storage.js'
import { startOfWeek, toKey, MEAL_SLOTS } from '../lib/dates.js'
import { buildShoppingItems } from '../lib/shoppingList.js'

const AppDataContext = createContext(null)

export function AppDataProvider({ children }) {
  const [userRecipes, setUserRecipes] = useStoredState('mealplanner.recipes.v1', [])
  const [mealPlan, setMealPlan] = useStoredState('mealplanner.mealplan.v1', {})
  const [currentWeekKey, setCurrentWeekKey] = useStoredState('mealplanner.currentWeek.v1', () =>
    toKey(startOfWeek(new Date()))
  )
  const [shoppingState, setShoppingState] = useStoredState('mealplanner.shopping.v1', {
    checked: {},
    pantry: {},
    hidePantry: false,
  })

  const recipes = useMemo(() => [...SEED_RECIPES, ...userRecipes], [userRecipes])
  const recipesById = useMemo(() => Object.fromEntries(recipes.map((r) => [r.id, r])), [recipes])

  const addRecipe = useCallback(
    (recipe) => {
      setUserRecipes((prev) => [...prev, recipe])
    },
    [setUserRecipes]
  )

  const setSlot = useCallback(
    (weekKey, dayIdx, slot, recipeId, extra) => {
      setMealPlan((prev) => {
        const week = { ...(prev[weekKey] || {}) }
        const day = { ...(week[dayIdx] || {}) }
        day[slot] = recipeId ? { recipeId, ...(extra || {}) } : null
        week[dayIdx] = day
        return { ...prev, [weekKey]: week }
      })
    },
    [setMealPlan]
  )

  const clearSlot = useCallback(
    (weekKey, dayIdx, slot) => {
      setSlot(weekKey, dayIdx, slot, null)
    },
    [setSlot]
  )

  const weekPlan = mealPlan[currentWeekKey] || {}

  const plannedRecipesThisWeek = useMemo(() => {
    const list = []
    Object.values(weekPlan).forEach((day) => {
      if (!day) return
      MEAL_SLOTS.forEach((slot) => {
        const entry = day[slot]
        if (entry && entry.recipeId && recipesById[entry.recipeId]) {
          list.push(recipesById[entry.recipeId])
        }
      })
    })
    return list
  }, [weekPlan, recipesById])

  const shoppingItems = useMemo(
    () => buildShoppingItems(plannedRecipesThisWeek, INGREDIENTS_BY_ID),
    [plannedRecipesThisWeek]
  )

  const toggleChecked = useCallback(
    (itemKey) => {
      setShoppingState((prev) => ({ ...prev, checked: { ...prev.checked, [itemKey]: !prev.checked[itemKey] } }))
    },
    [setShoppingState]
  )

  const togglePantry = useCallback(
    (itemKey) => {
      setShoppingState((prev) => ({ ...prev, pantry: { ...prev.pantry, [itemKey]: !prev.pantry[itemKey] } }))
    },
    [setShoppingState]
  )

  const setHidePantry = useCallback(
    (value) => {
      setShoppingState((prev) => ({ ...prev, hidePantry: value }))
    },
    [setShoppingState]
  )

  const value = useMemo(
    () => ({
      recipes,
      recipesById,
      addRecipe,
      mealPlan,
      weekPlan,
      setSlot,
      clearSlot,
      currentWeekKey,
      setCurrentWeekKey,
      plannedRecipesThisWeek,
      shoppingItems,
      shoppingState,
      toggleChecked,
      togglePantry,
      setHidePantry,
    }),
    [
      recipes,
      recipesById,
      addRecipe,
      mealPlan,
      weekPlan,
      setSlot,
      clearSlot,
      currentWeekKey,
      setCurrentWeekKey,
      plannedRecipesThisWeek,
      shoppingItems,
      shoppingState,
      toggleChecked,
      togglePantry,
      setHidePantry,
    ]
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}
