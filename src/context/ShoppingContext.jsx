import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { loadJSON, saveJSON, STORAGE_KEYS } from '../lib/storage.js'

const ShoppingContext = createContext(null)

function loadShoppingState() {
  return loadJSON(STORAGE_KEYS.shopping, { pantryItems: {}, checkedItems: {}, excludePantry: true })
}

export function ShoppingProvider({ children }) {
  const [state, setState] = useState(loadShoppingState)

  const persist = useCallback((next) => {
    setState(next)
    saveJSON(STORAGE_KEYS.shopping, next)
  }, [])

  const togglePantryItem = useCallback(
    (key) => {
      const next = { ...state, pantryItems: { ...state.pantryItems, [key]: !state.pantryItems[key] } }
      persist(next)
    },
    [state, persist]
  )

  const toggleChecked = useCallback(
    (checkKey) => {
      const next = { ...state, checkedItems: { ...state.checkedItems, [checkKey]: !state.checkedItems[checkKey] } }
      persist(next)
    },
    [state, persist]
  )

  const setExcludePantry = useCallback(
    (value) => {
      persist({ ...state, excludePantry: value })
    },
    [state, persist]
  )

  const value = useMemo(
    () => ({
      pantryItems: state.pantryItems,
      checkedItems: state.checkedItems,
      excludePantry: state.excludePantry,
      togglePantryItem,
      toggleChecked,
      setExcludePantry,
    }),
    [state, togglePantryItem, toggleChecked, setExcludePantry]
  )

  return <ShoppingContext.Provider value={value}>{children}</ShoppingContext.Provider>
}

export function useShopping() {
  const ctx = useContext(ShoppingContext)
  if (!ctx) throw new Error('useShopping must be used within a ShoppingProvider')
  return ctx
}
