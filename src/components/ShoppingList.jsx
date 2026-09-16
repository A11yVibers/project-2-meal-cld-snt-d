import React, { useMemo } from 'react'
import { useAppData } from '../context/AppDataContext.jsx'
import { groupByCategory } from '../lib/shoppingList.js'
import { addWeeks, fromKey, toKey, startOfWeek, formatWeekRange } from '../lib/dates.js'

export default function ShoppingList() {
  const {
    currentWeekKey,
    setCurrentWeekKey,
    plannedRecipesThisWeek,
    shoppingItems,
    shoppingState,
    toggleChecked,
    togglePantry,
    setHidePantry,
  } = useAppData()

  const weekStart = fromKey(currentWeekKey)

  const visibleItems = useMemo(() => {
    if (!shoppingState.hidePantry) return shoppingItems
    return shoppingItems.filter((item) => !shoppingState.pantry[item.key])
  }, [shoppingItems, shoppingState.hidePantry, shoppingState.pantry])

  const groups = useMemo(() => groupByCategory(visibleItems), [visibleItems])
  const checkedCount = visibleItems.filter((i) => shoppingState.checked[i.key]).length

  function goToWeek(offset) {
    setCurrentWeekKey(toKey(addWeeks(weekStart, offset)))
  }

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1>Shopping List</h1>
          <p className="page__subtitle">
            Generated from {plannedRecipesThisWeek.length} planned recipe{plannedRecipesThisWeek.length === 1 ? '' : 's'} this week.
          </p>
        </div>
      </div>

      <div className="week-nav">
        <button className="btn" onClick={() => goToWeek(-1)}>
          ← Prev
        </button>
        <div className="week-nav__label">{formatWeekRange(weekStart)}</div>
        <button className="btn" onClick={() => goToWeek(1)}>
          Next →
        </button>
        <button className="btn btn--subtle" onClick={() => setCurrentWeekKey(toKey(startOfWeek(new Date())))}>
          Today
        </button>
      </div>

      <div className="toolbar">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={shoppingState.hidePantry}
            onChange={(e) => setHidePantry(e.target.checked)}
          />
          Exclude ingredients I already have in my pantry
        </label>
        <span className="page__subtitle">
          {checkedCount} / {visibleItems.length} checked off
        </span>
      </div>

      {shoppingItems.length === 0 ? (
        <p className="empty-state">Add recipes to this week's plan to build a shopping list.</p>
      ) : groups.length === 0 ? (
        <p className="empty-state">Everything on this list is marked as a pantry item.</p>
      ) : (
        <div className="shopping-list">
          {groups.map((group) => (
            <div className="shopping-category" key={group.category}>
              <h2>{group.category}</h2>
              <ul>
                {group.items.map((item) => {
                  const checked = !!shoppingState.checked[item.key]
                  const inPantry = !!shoppingState.pantry[item.key]
                  return (
                    <li key={item.key} className={checked ? 'shopping-item--checked' : ''}>
                      <label className="checkbox-label shopping-item__main">
                        <input type="checkbox" checked={checked} onChange={() => toggleChecked(item.key)} />
                        <span className="shopping-item__qty">
                          {item.quantity != null ? `${item.quantity} ${item.unit}`.trim() : ''}
                        </span>
                        <span className="shopping-item__name">
                          {item.name}
                          {item.optional ? ' (optional)' : ''}
                        </span>
                      </label>
                      <button
                        className={`btn btn--pill ${inPantry ? 'btn--pill-active' : ''}`}
                        title="Mark as a pantry item I already have"
                        onClick={() => togglePantry(item.key)}
                      >
                        {inPantry ? 'In pantry ✓' : 'Have it?'}
                      </button>
                      <span className="shopping-item__recipes">{item.recipeTitles.join(', ')}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
