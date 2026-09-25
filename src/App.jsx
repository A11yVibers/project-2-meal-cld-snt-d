import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { RecipesProvider } from './context/RecipesContext.jsx'
import { PlannerProvider } from './context/PlannerContext.jsx'
import { ShoppingProvider } from './context/ShoppingContext.jsx'
import NavBar from './components/layout/NavBar.jsx'
import RecipeCatalog from './components/catalog/RecipeCatalog.jsx'
import RecipeDetail from './components/detail/RecipeDetail.jsx'
import RecipeForm from './components/form/RecipeForm.jsx'
import WeeklyPlanner from './components/planner/WeeklyPlanner.jsx'
import ShoppingList from './components/shopping/ShoppingList.jsx'

export default function App() {
  return (
    <RecipesProvider>
      <PlannerProvider>
        <ShoppingProvider>
          <HashRouter>
            <NavBar />
            <main className="app-main">
              <Routes>
                <Route path="/" element={<RecipeCatalog />} />
                <Route path="/recipes/new" element={<RecipeForm />} />
                <Route path="/recipes/:id" element={<RecipeDetail />} />
                <Route path="/planner" element={<WeeklyPlanner />} />
                <Route path="/shopping-list" element={<ShoppingList />} />
              </Routes>
            </main>
          </HashRouter>
        </ShoppingProvider>
      </PlannerProvider>
    </RecipesProvider>
  )
}
