import React from 'react'

function BrandFilter({ brand, brands = [], onChange }) {
  const options = ['Todos', ...brands]
  return (
    <div className="mb-3" style={{ minWidth: 160 }}>
      <select
        className="form-select form-select-sm"
        aria-label="Filtrar por marca"
        value={brand}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((b) => (
          <option key={b} value={b}>{b}</option>
        ))}
      </select>
    </div>
  )
}

export default BrandFilter