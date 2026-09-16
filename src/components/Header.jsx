import React from 'react'

const TABS = [
  { key: 'catalog', label: 'Recipes' },
  { key: 'planner', label: 'Weekly Planner' },
  { key: 'shopping', label: 'Shopping List' },
]

export default function Header({ activeTab, onNavigate, onNewRecipe }) {
  return (
    <header className="app-header">
      <div className="app-header__brand">🍽️ Meal Planner</div>
      <nav className="app-header__nav">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`app-header__tab ${activeTab === tab.key ? 'app-header__tab--active' : ''}`}
            onClick={() => onNavigate(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <button className="btn btn--primary" onClick={onNewRecipe}>
        + New Recipe
      </button>
    </header>
  )
}
