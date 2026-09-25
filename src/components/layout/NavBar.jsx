import React from 'react'
import { NavLink } from 'react-router-dom'

export default function NavBar() {
  return (
    <header className="app-header">
      <div className="app-header__brand">🍽️ Meal Planner</div>
      <nav className="app-header__nav">
        <NavLink to="/" end>
          Recipes
        </NavLink>
        <NavLink to="/planner">Planner</NavLink>
        <NavLink to="/shopping-list">Shopping list</NavLink>
      </nav>
    </header>
  )
}
