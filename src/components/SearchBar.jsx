import React from 'react'

function SearchBar({ query, onChange }) {
  return (
    <div className="mb-3">
      <input
        type="text"
        className="form-control"
        placeholder="Buscar productos..."
        value={query}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Buscar productos"
      />
    </div>
  )
}

export default SearchBar