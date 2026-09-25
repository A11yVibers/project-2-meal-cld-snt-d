import React, { useMemo } from 'react'
import { usePlanner } from '../../context/PlannerContext.jsx'
import { useRecipes } from '../../context/RecipesContext.jsx'
import { useShopping } from '../../context/ShoppingContext.jsx'
import { buildShoppingList, combinedPantryKey } from '../../lib/shoppingList.js'
import { formatWeekRangeLabel } from '../../lib/date.js'

function formatQuantity(item) {
  if (!item.hasQuantity) return item.optionalOnly ? 'as needed' : ''
  const qty = Math.round(item.quantity * 100) / 100
  return `${qty}${item.unit ? ' ' + item.unit : ''}`
}

export default function ShoppingList() {
  const { currentWeekStart, getWeekPlan, goToNextWeek, goToPrevWeek, goToToday } = usePlanner()
  const { recipesById } = useRecipes()
  const { pantryItems, checkedItems, excludePantry, togglePantryItem, toggleChecked, setExcludePantry } = useShopping()

  const weekPlan = getWeekPlan(currentWeekStart)
  const groups = useMemo(() => buildShoppingList(weekPlan, recipesById), [weekPlan, recipesById])

  const hasAnyItems = groups.length > 0

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Shopping list</h1>
          <p className="muted">Generated from recipes planned for {formatWeekRangeLabel(currentWeekStart)}</p>
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

      <label className="checkbox-row">
        <input type="checkbox" checked={excludePantry} onChange={(e) => setExcludePantry(e.target.checked)} />
        Exclude ingredients I already have in my pantry
      </label>

      {!hasAnyItems ? (
        <p className="empty-state">No recipes are planned for this week yet, so there's nothing to shop for.</p>
      ) : (
        <div className="shopping-groups">
          {groups.map((group) => {
            const visibleItems = excludePantry
              ? group.items.filter((item) => !pantryItems[combinedPantryKey(item)])
              : group.items
            if (visibleItems.length === 0) return null
            return (
              <div key={group.category} className="shopping-group">
                <h2>{group.category}</h2>
                <ul className="shopping-list-items">
                  {visibleItems.map((item) => {
                    const checkKey = `${currentWeekStart}::${item.key}`
                    const pantryKey = combinedPantryKey(item)
                    const inPantry = !!pantryItems[pantryKey]
                    const checked = !!checkedItems[checkKey]
                    return (
                      <li key={item.key} className={checked ? 'shopping-item--checked' : ''}>
                        <label className="shopping-item">
                          <input type="checkbox" checked={checked} onChange={() => toggleChecked(checkKey)} />
                          <span className="shopping-item__name">{item.name}</span>
                          <span className="shopping-item__qty">{formatQuantity(item)}</span>
                        </label>
                        <button
                          type="button"
                          className={`btn btn--subtle pantry-toggle ${inPantry ? 'pantry-toggle--active' : ''}`}
                          onClick={() => togglePantryItem(pantryKey)}
                        >
                          {inPantry ? '✓ In pantry' : 'Have this?'}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
