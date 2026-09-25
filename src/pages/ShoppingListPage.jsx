import React, { useMemo, useState } from 'react'
import { usePlanner } from '../state/PlannerContext.jsx'
import { useRecipes } from '../state/RecipesContext.jsx'
import { useShoppingListState } from '../state/ShoppingListContext.jsx'
import ShoppingListItem from '../components/shopping/ShoppingListItem.jsx'
import { buildShoppingList } from '../utils/shopping.js'
import { CURRENT_WEEK_START, addWeeks, formatWeekRange } from '../utils/dates.js'

export default function ShoppingListPage() {
  const [weekStart, setWeekStart] = useState(CURRENT_WEEK_START)
  const { getAssignmentsForWeek } = usePlanner()
  const { recipes } = useRecipes()
  const { pantry, hidePantryItems, setHidePantryItems } = useShoppingListState()

  const assignments = getAssignmentsForWeek(weekStart)
  const categories = useMemo(() => buildShoppingList(recipes, assignments), [recipes, assignments])

  const visibleCategories = categories
    .map((cat) => ({
      ...cat,
      items: hidePantryItems ? cat.items.filter((item) => !pantry[item.ingredientKey]) : cat.items,
    }))
    .filter((cat) => cat.items.length > 0)

  const totalItems = categories.reduce((sum, c) => sum + c.items.length, 0)
  const isCurrentWeek = weekStart === CURRENT_WEEK_START

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Shopping list</h1>
          <p className="page-subtitle">Automatically generated from the recipes planned for this week.</p>
        </div>
      </div>

      <div className="week-nav week-nav-large">
        <button type="button" className="btn" onClick={() => setWeekStart((w) => addWeeks(w, -1))}>‹ Previous week</button>
        <div className="week-nav-current">
          <strong>{formatWeekRange(weekStart)}</strong>
          {!isCurrentWeek && (
            <button type="button" className="btn btn-link" onClick={() => setWeekStart(CURRENT_WEEK_START)}>Jump to this week</button>
          )}
        </div>
        <button type="button" className="btn" onClick={() => setWeekStart((w) => addWeeks(w, 1))}>Next week ›</button>
      </div>

      <label className="checkbox-field pantry-toggle">
        <input
          type="checkbox"
          checked={hidePantryItems}
          onChange={(e) => setHidePantryItems(e.target.checked)}
        />
        Hide ingredients I already have in my pantry
      </label>

      {totalItems === 0 ? (
        <p className="empty-state">No recipes are planned for this week yet. Add recipes in the meal planner to build a shopping list.</p>
      ) : visibleCategories.length === 0 ? (
        <p className="empty-state">Everything for this week is already in your pantry 🎉</p>
      ) : (
        <div className="shopping-categories">
          {visibleCategories.map((cat) => (
            <section key={cat.category} className="shopping-category">
              <h2>{cat.category}</h2>
              <ul className="shopping-item-list">
                {cat.items.map((item) => <ShoppingListItem key={item.key} item={item} />)}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
