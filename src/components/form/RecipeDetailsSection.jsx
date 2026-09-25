import React from 'react'
import ChipMultiSelect from '../common/ChipMultiSelect.jsx'
import { CUISINES, MEAL_TYPES, DIETARY_TAGS, RECIPE_CATEGORIES } from '../../data/lookups.js'

export default function RecipeDetailsSection({ draft, patch }) {
  return (
    <fieldset className="form-section">
      <legend>Recipe details</legend>

      <div className="form-field">
        <label htmlFor="title">Recipe title *</label>
        <input
          id="title"
          type="text"
          value={draft.title}
          onChange={(e) => patch({ title: e.target.value })}
          placeholder="e.g. Weeknight Garlic Noodles"
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="shortDescription">Short description</label>
        <textarea
          id="shortDescription"
          value={draft.shortDescription}
          onChange={(e) => patch({ shortDescription: e.target.value })}
          placeholder="A one-line summary shown on the recipe card"
          rows={2}
        />
      </div>

      <div className="form-field">
        <label htmlFor="sourceUrl">Source link</label>
        <input
          id="sourceUrl"
          type="url"
          value={draft.sourceUrl}
          onChange={(e) => patch({ sourceUrl: e.target.value })}
          placeholder="https://example.com/recipe"
        />
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="cuisineId">Cuisine</label>
          <select id="cuisineId" value={draft.cuisineId} onChange={(e) => patch({ cuisineId: e.target.value })}>
            <option value="">Select a cuisine</option>
            {CUISINES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="mealTypeId">Primary meal type</label>
          <select id="mealTypeId" value={draft.mealTypeId} onChange={(e) => patch({ mealTypeId: e.target.value })}>
            <option value="">Select a meal type</option>
            {MEAL_TYPES.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
      </div>

      <div className="form-field">
        <label>Dietary suitability</label>
        <ChipMultiSelect
          options={DIETARY_TAGS}
          selectedIds={draft.dietaryTagIds}
          onChange={(ids) => patch({ dietaryTagIds: ids })}
        />
      </div>

      <div className="form-field">
        <label>Recipe categories</label>
        <ChipMultiSelect
          options={RECIPE_CATEGORIES}
          selectedIds={draft.categoryIds}
          onChange={(ids) => patch({ categoryIds: ids })}
        />
      </div>
    </fieldset>
  )
}
