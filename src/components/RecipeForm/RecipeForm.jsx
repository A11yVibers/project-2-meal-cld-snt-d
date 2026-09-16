import React, { useMemo, useState } from 'react'
import { useAppData } from '../../context/AppDataContext.jsx'
import { APPROVED_IMAGES } from '../../approved-images.js'
import {
  CUISINES,
  MEAL_TYPES,
  DIETARY_TAGS,
  RECIPE_CATEGORIES,
  buildApprovedCoverImageChoices,
} from '../../data/csvData.js'
import { makeId } from '../../lib/id.js'
import { startOfWeek, toKey, weekdayIndexFromKey, MEAL_SLOTS } from '../../lib/dates.js'
import PlanningFields from '../PlanningFields.jsx'
import IngredientsEditor, { emptySection } from './IngredientsEditor.jsx'
import StepsEditor, { emptyStep } from './StepsEditor.jsx'
import RecipeOptionsMenu from './RecipeOptionsMenu.jsx'

const ACCENT_COLORS = ['#D97757', '#8A9A5B', '#4C6EF5', '#E8590C', '#12B886', '#F59F00', '#E64980', '#495057']
const SPICE_LABELS = ['No spice', 'Mild', 'Mild+', 'Medium', 'Spicy', 'Very spicy']

function toggleInArray(arr, value) {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]
}

export default function RecipeForm({ onCancel, onSaved }) {
  const { addRecipe, setSlot } = useAppData()
  const coverImageChoices = useMemo(() => buildApprovedCoverImageChoices(APPROVED_IMAGES), [])

  const [title, setTitle] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [cuisineId, setCuisineId] = useState(CUISINES[0]?.id || '')
  const [mealTypeId, setMealTypeId] = useState(MEAL_TYPES[0]?.id || '')
  const [dietaryTagIds, setDietaryTagIds] = useState([])
  const [categoryIds, setCategoryIds] = useState([])

  const [servings, setServings] = useState(4)
  const [prepTime, setPrepTime] = useState(15)
  const [cookTime, setCookTime] = useState(15)
  const [spiceLevel, setSpiceLevel] = useState(0)

  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0])

  const [ingredientSections, setIngredientSections] = useState([emptySection('Main')])
  const [steps, setSteps] = useState([emptyStep()])

  const [includeInMealSuggestions, setIncludeInMealSuggestions] = useState(true)
  const [addNow, setAddNow] = useState(false)
  const [planningFields, setPlanningFields] = useState(() => {
    const weekKey = toKey(startOfWeek(new Date()))
    return { weekKey, date: weekKey, slot: MEAL_SLOTS[2], specificDateTime: '' }
  })

  const [recipeOptions, setRecipeOptions] = useState({
    includeInShoppingList: true,
    showNutrition: false,
    allowSubstitutions: false,
    measurementSystem: 'us',
  })

  const [error, setError] = useState('')

  const totalTime = (Number(prepTime) || 0) + (Number(cookTime) || 0)

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) {
      setError('Please give the recipe a title.')
      return
    }

    const cleanedSections = ingredientSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => item.ingredientName.trim() !== ''),
      }))
      .filter((section) => section.items.length > 0)

    const cleanedSteps = steps
      .filter((step) => step.instruction.trim() !== '')
      .map((step, idx) => ({ ...step, number: idx + 1, timerMinutes: Number(step.timerMinutes) || 0 }))

    const recipe = {
      id: makeId('user'),
      title: title.trim(),
      shortDescription: '',
      sourceName: '',
      sourceUrl: sourceUrl.trim(),
      servings: Number(servings) || 1,
      prepTime: Number(prepTime) || 0,
      cookTime: Number(cookTime) || 0,
      totalTime,
      cuisineId,
      mealTypeId,
      dietaryTagIds,
      categoryIds,
      difficulty: null,
      spiceLevel: Number(spiceLevel) || 0,
      accentColor,
      coverImageUrl,
      includeInMealSuggestions,
      ingredientSections: cleanedSections.length ? cleanedSections : [],
      steps: cleanedSteps,
      options: { ...recipeOptions },
      isUserCreated: true,
      createdAt: Date.now(),
    }

    addRecipe(recipe)

    if (addNow) {
      const date = planningFields.date || planningFields.weekKey
      const dayIdx = weekdayIndexFromKey(date)
      setSlot(planningFields.weekKey, dayIdx, planningFields.slot || MEAL_SLOTS[0], recipe.id, {
        specificDateTime: planningFields.specificDateTime || null,
      })
    }

    onSaved(recipe.id)
  }

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1>New Recipe</h1>
          <p className="page__subtitle">Fill in the sections below, then save your recipe.</p>
        </div>
        <RecipeOptionsMenu options={recipeOptions} onChange={setRecipeOptions} />
      </div>

      <form className="recipe-form" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}

        <section className="form-section">
          <h2>Recipe details</h2>
          <label className="field">
            <span className="field__label">Recipe title</span>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <label className="field">
            <span className="field__label">Source link (optional)</span>
            <input className="input" type="url" placeholder="https://…" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} />
          </label>
          <div className="field-row">
            <label className="field">
              <span className="field__label">Cuisine</span>
              <select className="input" value={cuisineId} onChange={(e) => setCuisineId(e.target.value)}>
                {CUISINES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span className="field__label">Primary meal type</span>
              <select className="input" value={mealTypeId} onChange={(e) => setMealTypeId(e.target.value)}>
                {MEAL_TYPES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="field">
            <span className="field__label">Dietary suitability</span>
            <div className="checkbox-grid">
              {DIETARY_TAGS.map((tag) => (
                <label className="checkbox-label" key={tag.id}>
                  <input
                    type="checkbox"
                    checked={dietaryTagIds.includes(tag.id)}
                    onChange={() => setDietaryTagIds((prev) => toggleInArray(prev, tag.id))}
                  />
                  {tag.name}
                </label>
              ))}
            </div>
          </div>

          <div className="field">
            <span className="field__label">Recipe categories</span>
            <div className="checkbox-grid">
              {RECIPE_CATEGORIES.map((cat) => (
                <label className="checkbox-label" key={cat.id}>
                  <input
                    type="checkbox"
                    checked={categoryIds.includes(cat.id)}
                    onChange={() => setCategoryIds((prev) => toggleInArray(prev, cat.id))}
                  />
                  {cat.name}
                </label>
              ))}
            </div>
          </div>
        </section>

        <section className="form-section">
          <h2>Timing &amp; yield</h2>
          <div className="field-row">
            <label className="field">
              <span className="field__label">Servings</span>
              <div className="stepper">
                <button type="button" className="btn btn--icon" onClick={() => setServings((v) => Math.max(1, Number(v) - 1))}>
                  −
                </button>
                <input
                  className="input input--qty"
                  type="number"
                  min="1"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                />
                <button type="button" className="btn btn--icon" onClick={() => setServings((v) => Number(v) + 1)}>
                  +
                </button>
              </div>
            </label>
            <label className="field">
              <span className="field__label">Prep time (min)</span>
              <input className="input" type="number" min="0" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} />
            </label>
            <label className="field">
              <span className="field__label">Cook time (min)</span>
              <input className="input" type="number" min="0" value={cookTime} onChange={(e) => setCookTime(e.target.value)} />
            </label>
            <label className="field">
              <span className="field__label">Total time</span>
              <input className="input" value={`${totalTime} min`} readOnly disabled />
            </label>
          </div>

          <label className="field">
            <span className="field__label">
              Spice level: <strong>{SPICE_LABELS[spiceLevel]}</strong>
            </span>
            <input
              className="range"
              type="range"
              min="0"
              max="5"
              step="1"
              value={spiceLevel}
              onChange={(e) => setSpiceLevel(Number(e.target.value))}
            />
            <div className="range__scale">
              <span>Mild</span>
              <span>Very spicy</span>
            </div>
          </label>
        </section>

        <section className="form-section">
          <h2>Image &amp; appearance</h2>
          <div className="field">
            <span className="field__label">Cover image</span>
            <div className="image-picker">
              <button
                type="button"
                className={`image-picker__option ${coverImageUrl === '' ? 'image-picker__option--selected' : ''}`}
                onClick={() => setCoverImageUrl('')}
              >
                <img src={APPROVED_IMAGES.placeholder} alt="Placeholder" />
                <span>No image (use placeholder)</span>
              </button>
              {coverImageChoices.map((choice) => (
                <button
                  key={choice.url}
                  type="button"
                  className={`image-picker__option ${coverImageUrl === choice.url ? 'image-picker__option--selected' : ''}`}
                  onClick={() => setCoverImageUrl(choice.url)}
                >
                  <img src={choice.url} alt={choice.label} />
                  <span>{choice.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <span className="field__label">Recipe card accent color</span>
            <div className="color-picker">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-swatch ${accentColor === color ? 'color-swatch--selected' : ''}`}
                  style={{ backgroundColor: color }}
                  aria-label={color}
                  onClick={() => setAccentColor(color)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="form-section">
          <h2>Ingredients</h2>
          <IngredientsEditor sections={ingredientSections} onChange={setIngredientSections} />
        </section>

        <section className="form-section">
          <h2>Method</h2>
          <StepsEditor steps={steps} onChange={setSteps} />
        </section>

        <section className="form-section">
          <h2>Meal planning options</h2>
          <label className="checkbox-label">
            <input type="checkbox" checked={includeInMealSuggestions} onChange={(e) => setIncludeInMealSuggestions(e.target.checked)} />
            Make available in meal-plan suggestions
          </label>
          <label className="checkbox-label">
            <input type="checkbox" checked={addNow} onChange={(e) => setAddNow(e.target.checked)} />
            Add this recipe to the meal plan now
          </label>
          {addNow && <PlanningFields value={planningFields} onChange={setPlanningFields} />}
        </section>

        <div className="modal__actions">
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary">
            Save recipe
          </button>
        </div>
      </form>
    </div>
  )
}
