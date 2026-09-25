import React from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'

import { RecipesProvider } from './state/RecipesContext.jsx'
import { PlannerProvider } from './state/PlannerContext.jsx'
import { ShoppingListProvider } from './state/ShoppingListContext.jsx'

import NavBar from './components/layout/NavBar.jsx'
import CatalogPage from './pages/CatalogPage.jsx'
import RecipeDetailPage from './pages/RecipeDetailPage.jsx'
import NewRecipePage from './pages/NewRecipePage.jsx'
import PlannerPage from './pages/PlannerPage.jsx'
import ShoppingListPage from './pages/ShoppingListPage.jsx'

export default function App() {
  return (
    <RecipesProvider>
      <PlannerProvider>
        <ShoppingListProvider>
          <HashRouter>
            <NavBar />
            <main className="app-main">
              <Routes>
                <Route path="/" element={<CatalogPage />} />
                <Route path="/recipes/new" element={<NewRecipePage />} />
                <Route path="/recipes/:id" element={<RecipeDetailPage />} />
                <Route path="/planner" element={<PlannerPage />} />
                <Route path="/shopping-list" element={<ShoppingListPage />} />
              </Routes>
            </main>
          </HashRouter>
        </ShoppingListProvider>
      </PlannerProvider>
    </RecipesProvider>
  )
}
