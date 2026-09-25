import React from 'react'
import { ingredients, units } from '../../data/lookups.js'
import { emptyIngredientItem, emptySection } from './formModel.js'

const INGREDIENT_LIST_ID = 'ingredient-name-options'

function IngredientRow({ item, onChange, onRemove, onMoveUp, onMoveDown, isFirst, isLast }) {
  function handleNameChange(name) {
    const match = ingredients.find((i) => i.name.toLowerCase() === name.toLowerCase())
    onChange({ ...item, ingredientName: name, ingredientId: match ? match.id : '' })
  }

  return (
    <div className="ingredient-row">
      <div className="ingredient-row__reorder">
        <button type="button" disabled={isFirst} onClick={onMoveUp} aria-label="Move ingredient up">
          ▲
        </button>
        <button type="button" disabled={isLast} onClick={onMoveDown} aria-label="Move ingredient down">
          ▼
        </button>
      </div>

      <input
        type="text"
        className="ingredient-row__name"
        list={INGREDIENT_LIST_ID}
        placeholder="Search ingredients…"
        value={item.ingredientName}
        onChange={(e) => handleNameChange(e.target.value)}
      />

      <input
        type="number"
        className="ingredient-row__qty"
        placeholder="Qty"
        min={0}
        step="any"
        value={item.quantity}
        onChange={(e) => onChange({ ...item, quantity: e.target.value })}
      />

      <select className="ingredient-row__unit" value={item.unit} onChange={(e) => onChange({ ...item, unit: e.target.value })}>
        <option value="">Unit…</option>
        {units.map((u) => (
          <option key={u.id} value={u.name}>
            {u.name}
          </option>
        ))}
      </select>

      <label className="ingredient-row__optional">
        <input type="checkbox" checked={item.optional} onChange={(e) => onChange({ ...item, optional: e.target.checked })} />
        Optional
      </label>

      <button type="button" className="icon-button" aria-label="Remove ingredient" onClick={onRemove}>
        ✕
      </button>
    </div>
  )
}

export default function IngredientsSection({ draft, patch }) {
  const sections = draft.ingredientSections

  function updateSection(index, nextSection) {
    const next = [...sections]
    next[index] = nextSection
    patch({ ingredientSections: next })
  }

  function addSection() {
    patch({ ingredientSections: [...sections, emptySection(`Section ${sections.length + 1}`)] })
  }

  function removeSection(index) {
    if (sections.length <= 1) return
    patch({ ingredientSections: sections.filter((_, i) => i !== index) })
  }

  function addItem(sectionIndex) {
    const section = sections[sectionIndex]
    updateSection(sectionIndex, { ...section, items: [...section.items, emptyIngredientItem()] })
  }

  function removeItem(sectionIndex, itemIndex) {
    const section = sections[sectionIndex]
    updateSection(sectionIndex, { ...section, items: section.items.filter((_, i) => i !== itemIndex) })
  }

  function updateItem(sectionIndex, itemIndex, nextItem) {
    const section = sections[sectionIndex]
    const items = [...section.items]
    items[itemIndex] = nextItem
    updateSection(sectionIndex, { ...section, items })
  }

  function moveItem(sectionIndex, itemIndex, direction) {
    const section = sections[sectionIndex]
    const items = [...section.items]
    const target = itemIndex + direction
    if (target < 0 || target >= items.length) return
    ;[items[itemIndex], items[target]] = [items[target], items[itemIndex]]
    updateSection(sectionIndex, { ...section, items })
  }

  return (
    <fieldset className="form-section">
      <legend>Ingredients</legend>
      <datalist id={INGREDIENT_LIST_ID}>
        {ingredients.map((i) => (
          <option key={i.id} value={i.name} />
        ))}
      </datalist>

      {sections.map((section, sectionIndex) => (
        <div key={section.id} className="ingredient-section-editor">
          <div className="ingredient-section-editor__header">
            <label>
              Section name
              <input
                type="text"
                value={section.name}
                onChange={(e) => updateSection(sectionIndex, { ...section, name: e.target.value })}
                placeholder="e.g. Main, Sauce, Garnish"
              />
            </label>
            {sections.length > 1 && (
              <button type="button" className="btn btn--subtle" onClick={() => removeSection(sectionIndex)}>
                Remove section
              </button>
            )}
          </div>

          {section.items.map((item, itemIndex) => (
            <IngredientRow
              key={item.id}
              item={item}
              onChange={(next) => updateItem(sectionIndex, itemIndex, next)}
              onRemove={() => removeItem(sectionIndex, itemIndex)}
              onMoveUp={() => moveItem(sectionIndex, itemIndex, -1)}
              onMoveDown={() => moveItem(sectionIndex, itemIndex, 1)}
              isFirst={itemIndex === 0}
              isLast={itemIndex === section.items.length - 1}
            />
          ))}

          <button type="button" className="btn btn--subtle" onClick={() => addItem(sectionIndex)}>
            + Add another ingredient
          </button>
        </div>
      ))}

      <button type="button" className="btn" onClick={addSection}>
        + Add another ingredient section
      </button>
    </fieldset>
  )
}
