import React from 'react'

function PriceFilter({ min, max, onChangeMin, onChangeMax, onClear }) {
  return (
    <div className="mb-3">
      <div className="input-group input-group-sm" style={{ maxWidth: 320 }}>
        <span className="input-group-text">Precio</span>
        <input
          type="number"
          min="0"
          step="1"
          className="form-control"
          placeholder="mín"
          value={min}
          onChange={(e) => onChangeMin(e.target.value)}
          aria-label="Precio mínimo"
        />
        <input
          type="number"
          min="0"
          step="1"
          className="form-control"
          placeholder="máx"
          value={max}
          onChange={(e) => onChangeMax(e.target.value)}
          aria-label="Precio máximo"
        />
        {onClear && (
          <button className="btn btn-outline-secondary" type="button" onClick={onClear}>Limpiar</button>
        )}
      </div>
    </div>
  )
}

export default PriceFilter