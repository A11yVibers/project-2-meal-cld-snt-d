import React from 'react'
import { NavLink } from 'react-router-dom'

export default function NavBar() {
  return (
    <header className="app-nav">
      <div className="app-nav-brand">🍽 Meal Planner</div>
      <nav>
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}>
          Recipes
        </NavLink>
        <NavLink to="/planner" className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}>
          Weekly planner
        </NavLink>
        <NavLink to="/shopping-list" className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}>
          Shopping list
        </NavLink>
      </nav>
    </header>
  )
}
