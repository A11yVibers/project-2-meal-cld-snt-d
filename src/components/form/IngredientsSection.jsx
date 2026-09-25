import React from 'react'
import IngredientSearchSelect from '../common/IngredientSearchSelect.jsx'
import { UNITS } from '../../data/lookups.js'
import { makeEmptyIngredientItem, makeEmptySection } from '../../utils/recipeDraft.js'

function moveInArray(arr, index, direction) {
  const target = index + direction
  if (target < 0 || target >= arr.length) return arr
  const copy = [...arr]
  const [moved] = copy.splice(index, 1)
  copy.splice(target, 0, moved)
  return copy
}

export default function IngredientsSection({ draft, patch }) {
  const sections = draft.ingredientSections

  function setSections(next) {
    patch({ ingredientSections: next })
  }

  function patchSection(sectionId, changes) {
    setSections(sections.map((s) => (s.id === sectionId ? { ...s, ...changes } : s)))
  }

  function patchItem(sectionId, itemId, changes) {
    setSections(
      sections.map((s) =>
        s.id !== sectionId
          ? s
          : { ...s, items: s.items.map((it) => (it.id === itemId ? { ...it, ...changes } : it)) }
      )
    )
  }

  function addItem(sectionId) {
    setSections(
      sections.map((s) => (s.id === sectionId ? { ...s, items: [...s.items, makeEmptyIngredientItem()] } : s))
    )
  }

  function removeItem(sectionId, itemId) {
    setSections(
      sections.map((s) => (s.id === sectionId ? { ...s, items: s.items.filter((it) => it.id !== itemId) } : s))
    )
  }

  function moveItem(sectionId, itemId, direction) {
    setSections(
      sections.map((s) => {
        if (s.id !== sectionId) return s
        const idx = s.items.findIndex((it) => it.id === itemId)
        return { ...s, items: moveInArray(s.items, idx, direction) }
      })
    )
  }

  function addSection() {
    setSections([...sections, makeEmptySection('')])
  }

  function removeSection(sectionId) {
    setSections(sections.filter((s) => s.id !== sectionId))
  }

  function moveSection(sectionId, direction) {
    const idx = sections.findIndex((s) => s.id === sectionId)
    setSections(moveInArray(sections, idx, direction))
  }

  return (
    <fieldset className="form-section">
      <legend>Ingredients</legend>

      {sections.map((section, sIdx) => (
        <div key={section.id} className="ingredient-section-editor">
          <div className="ingredient-section-header">
            <input
              type="text"
              className="section-name-input"
              placeholder='Section name (e.g. "Main", "Sauce", "Garnish")'
              value={section.name}
              onChange={(e) => patchSection(section.id, { name: e.target.value })}
            />
            <div className="row-actions">
              <button type="button" className="icon-btn" disabled={sIdx === 0} onClick={() => moveSection(section.id, -1)} aria-label="Move section up">↑</button>
              <button type="button" className="icon-btn" disabled={sIdx === sections.length - 1} onClick={() => moveSection(section.id, 1)} aria-label="Move section down">↓</button>
              <button type="button" className="icon-btn" disabled={sections.length <= 1} onClick={() => removeSection(section.id)} aria-label="Remove section">🗑</button>
            </div>
          </div>

          {section.items.map((item, iIdx) => (
            <div key={item.id} className="ingredient-row">
              <div className="ingredient-row-search">
                <IngredientSearchSelect
                  ingredientId={item.ingredientId}
                  ingredientName={item.ingredientName}
                  onChange={({ ingredientId, ingredientName }) => patchItem(section.id, item.id, { ingredientId, ingredientName })}
                />
              </div>
              <input
                type="text"
                className="ingredient-qty-input"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => patchItem(section.id, item.id, { quantity: e.target.value })}
              />
              <select
                value={item.unit}
                onChange={(e) => patchItem(section.id, item.id, { unit: e.target.value })}
              >
                <option value="">Unit</option>
                {UNITS.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
              </select>
              <label className="optional-toggle">
                <input
                  type="checkbox"
                  checked={item.optional}
                  onChange={(e) => patchItem(section.id, item.id, { optional: e.target.checked })}
                />
                Optional
              </label>
              <div className="row-actions">
                <button type="button" className="icon-btn" disabled={iIdx === 0} onClick={() => moveItem(section.id, item.id, -1)} aria-label="Move ingredient up">↑</button>
                <button type="button" className="icon-btn" disabled={iIdx === section.items.length - 1} onClick={() => moveItem(section.id, item.id, 1)} aria-label="Move ingredient down">↓</button>
                <button type="button" className="icon-btn" disabled={section.items.length <= 1} onClick={() => removeItem(section.id, item.id)} aria-label="Remove ingredient">🗑</button>
              </div>
            </div>
          ))}

          <button type="button" className="btn" onClick={() => addItem(section.id)}>+ Add another ingredient</button>
        </div>
      ))}

      <button type="button" className="btn btn-secondary" onClick={addSection}>+ Add another ingredient section</button>
    </fieldset>
  )
}
