import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { seedRecipes } from '../data/seedRecipes.js'
import { loadJSON, saveJSON, STORAGE_KEYS } from '../lib/storage.js'
import { makeId } from '../lib/id.js'

const RecipesContext = createContext(null)

function loadUserRecipes() {
  return loadJSON(STORAGE_KEYS.userRecipes, [])
}

export function RecipesProvider({ children }) {
  const [userRecipes, setUserRecipes] = useState(loadUserRecipes)

  const recipes = useMemo(() => [...seedRecipes, ...userRecipes], [userRecipes])

  const recipesById = useMemo(() => {
    const map = new Map()
    for (const recipe of recipes) map.set(recipe.id, recipe)
    return map
  }, [recipes])

  const persist = useCallback((next) => {
    setUserRecipes(next)
    saveJSON(STORAGE_KEYS.userRecipes, next)
  }, [])

  const addRecipe = useCallback(
    (recipeInput) => {
      const recipe = {
        ...recipeInput,
        id: makeId('user-recipe'),
        isUserCreated: true,
        createdAt: Date.now(),
      }
      persist([...userRecipes, recipe])
      return recipe
    },
    [persist, userRecipes]
  )

  const getRecipe = useCallback((id) => recipesById.get(id), [recipesById])

  const value = useMemo(
    () => ({ recipes, recipesById, addRecipe, getRecipe }),
    [recipes, recipesById, addRecipe, getRecipe]
  )

  return <RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>
}

export function useRecipes() {
  const ctx = useContext(RecipesContext)
  if (!ctx) throw new Error('useRecipes must be used within a RecipesProvider')
  return ctx
}
