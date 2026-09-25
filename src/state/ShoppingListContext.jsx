import React, { createContext, useContext } from 'react'
import { usePersistentState } from './storage.js'

const STORAGE_KEY = 'mealplanner.shopping.v1'

const ShoppingListContext = createContext(null)

const DEFAULT_STATE = {
  checked: {}, // itemKey -> true
  pantry: {}, // ingredientKey -> true ("I already have this")
  hidePantryItems: false,
}

export function ShoppingListProvider({ children }) {
  const [state, setState] = usePersistentState(STORAGE_KEY, DEFAULT_STATE)

  function toggleChecked(itemKey) {
    setState((prev) => ({
      ...prev,
      checked: { ...prev.checked, [itemKey]: !prev.checked[itemKey] },
    }))
  }

  function togglePantry(ingredientKey) {
    setState((prev) => {
      const next = { ...prev.pantry }
      if (next[ingredientKey]) delete next[ingredientKey]
      else next[ingredientKey] = true
      return { ...prev, pantry: next }
    })
  }

  function setHidePantryItems(value) {
    setState((prev) => ({ ...prev, hidePantryItems: value }))
  }

  const value = {
    checked: state.checked,
    pantry: state.pantry,
    hidePantryItems: state.hidePantryItems,
    toggleChecked,
    togglePantry,
    setHidePantryItems,
  }

  return <ShoppingListContext.Provider value={value}>{children}</ShoppingListContext.Provider>
}

export function useShoppingListState() {
  const ctx = useContext(ShoppingListContext)
  if (!ctx) throw new Error('useShoppingListState must be used within ShoppingListProvider')
  return ctx
}
