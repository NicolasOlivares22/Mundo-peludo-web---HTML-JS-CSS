import React from 'react'

const CATEGORIES = ['Todos', 'Perros', 'Gatos', 'Aves', 'Peces']

function CategoryFilter({ category, onChange }) {
  return (
    <div className="btn-group" role="group" aria-label="Filtro de categorías">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter