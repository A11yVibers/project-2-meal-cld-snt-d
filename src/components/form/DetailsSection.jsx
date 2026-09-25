import React from 'react'
import { cuisines, mealTypes, dietaryTags, recipeCategories } from '../../data/lookups.js'
import MultiSelect from '../common/MultiSelect.jsx'

export default function DetailsSection({ draft, patch }) {
  return (
    <fieldset className="form-section">
      <legend>Recipe details</legend>

      <label>
        Recipe title
        <input
          type="text"
          required
          value={draft.title}
          onChange={(e) => patch({ title: e.target.value })}
          placeholder="e.g. Weeknight Chicken Stir-fry"
        />
      </label>

      <label>
        Short description
        <textarea
          value={draft.shortDescription}
          onChange={(e) => patch({ shortDescription: e.target.value })}
          placeholder="One or two sentences about this recipe"
          rows={2}
        />
      </label>

      <div className="form-grid-2">
        <label>
          Source name
          <input type="text" value={draft.sourceName} onChange={(e) => patch({ sourceName: e.target.value })} placeholder="Optional" />
        </label>
        <label>
          Source link
          <input
            type="url"
            value={draft.sourceUrl}
            onChange={(e) => patch({ sourceUrl: e.target.value })}
            placeholder="https://…"
          />
        </label>
      </div>

      <div className="form-grid-2">
        <label>
          Cuisine
          <select required value={draft.cuisineId} onChange={(e) => patch({ cuisineId: e.target.value })}>
            <option value="">Select a cuisine…</option>
            {cuisines.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Primary meal type
          <select required value={draft.mealTypeId} onChange={(e) => patch({ mealTypeId: e.target.value })}>
            <option value="">Select a meal type…</option>
            {mealTypes.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="form-label-block">
        Dietary suitability
        <MultiSelect
          name="Dietary suitability"
          options={dietaryTags}
          selectedIds={draft.dietaryTagIds}
          onChange={(ids) => patch({ dietaryTagIds: ids })}
        />
      </label>

      <label className="form-label-block">
        Recipe categories
        <MultiSelect
          name="Recipe categories"
          options={recipeCategories}
          selectedIds={draft.categoryIds}
          onChange={(ids) => patch({ categoryIds: ids })}
        />
      </label>
    </fieldset>
  )
}
