import React, { createContext, useContext, useMemo } from 'react'
import { loadSeedRecipes } from '../data/seedRecipes.js'
import { usePersistentState } from './storage.js'
import { makeId } from '../utils/ids.js'

const STORAGE_KEY = 'mealplanner.userRecipes.v1'

const RecipesContext = createContext(null)

// Seed recipes are parsed once at module load -- they come from the
// immutable project-assets CSVs and never change at runtime.
const SEED_RECIPES = loadSeedRecipes()

export function RecipesProvider({ children }) {
  const [userRecipes, setUserRecipes] = usePersistentState(STORAGE_KEY, [])

  const recipes = useMemo(() => [...SEED_RECIPES, ...userRecipes], [userRecipes])

  const recipesById = useMemo(() => {
    const map = new Map()
    for (const r of recipes) map.set(r.id, r)
    return map
  }, [recipes])

  function addRecipe(draft) {
    const id = makeId('user-recipe')
    const totalTimeMinutes = Number(draft.prepTimeMinutes || 0) + Number(draft.cookTimeMinutes || 0)
    const recipe = {
      ...draft,
      id,
      totalTimeMinutes,
      isUserCreated: true,
      createdAt: Date.now(),
    }
    setUserRecipes((prev) => [...prev, recipe])
    return recipe
  }

  function removeUserRecipe(id) {
    setUserRecipes((prev) => prev.filter((r) => r.id !== id))
  }

  const value = {
    recipes,
    recipesById,
    getRecipe: (id) => recipesById.get(id) ?? null,
    addRecipe,
    removeUserRecipe,
  }

  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>
}

export function useRecipes() {
  const ctx = useContext(RecipesContext)
  if (!ctx) throw new Error('useRecipes must be used within RecipesProvider')
  return ctx
}
