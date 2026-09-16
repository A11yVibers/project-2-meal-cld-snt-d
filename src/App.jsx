import React, { useState } from 'react'
import { AppDataProvider } from './context/AppDataContext.jsx'
import Header from './components/Header.jsx'
import RecipeCatalog from './components/RecipeCatalog.jsx'
import RecipeDetail from './components/RecipeDetail.jsx'
import RecipeForm from './components/RecipeForm/RecipeForm.jsx'
import WeeklyPlanner from './components/WeeklyPlanner.jsx'
import ShoppingList from './components/ShoppingList.jsx'

export default function App() {
  const [view, setView] = useState({ name: 'catalog' })

  const activeTab = view.name === 'recipe' || view.name === 'new-recipe' ? 'catalog' : view.name

  return (
    <AppDataProvider>
      <div className="app-shell">
        <Header
          activeTab={activeTab}
          onNavigate={(name) => setView({ name })}
          onNewRecipe={() => setView({ name: 'new-recipe' })}
        />
        <main className="app-main">
          {view.name === 'catalog' && (
            <RecipeCatalog
              onOpenRecipe={(id) => setView({ name: 'recipe', id })}
              onNewRecipe={() => setView({ name: 'new-recipe' })}
            />
          )}
          {view.name === 'recipe' && (
            <RecipeDetail recipeId={view.id} onBack={() => setView({ name: 'catalog' })} />
          )}
          {view.name === 'new-recipe' && (
            <RecipeForm
              onCancel={() => setView({ name: 'catalog' })}
              onSaved={(id) => setView({ name: 'recipe', id })}
            />
          )}
          {view.name === 'planner' && (
            <WeeklyPlanner onOpenRecipe={(id) => setView({ name: 'recipe', id })} />
          )}
          {view.name === 'shopping' && <ShoppingList />}
        </main>
      </div>
    </AppDataProvider>
  )
}
