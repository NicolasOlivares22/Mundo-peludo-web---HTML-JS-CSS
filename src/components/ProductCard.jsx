import React from 'react'
import { formatCLP } from '../utils/currency'

function ProductCard({ product, onAddToCart, onOpenDetail, isAdmin = false, onEdit, onDelete }) {
  return (
    <div className="col">
      <div className="card h-100 shadow-sm">
        <img
          src={product.image}
          className="card-img-top"
          alt={product.name}
          onError={(e) => { e.currentTarget.src = '/img/mundo-peludo-logo.png' }}
          onClick={() => onOpenDetail?.(product)}
          style={{ cursor: 'pointer' }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text text-muted mb-1">{product.category}</p>
          {product.brand && (
            <p className="card-text text-muted mb-2">Marca: {product.brand}</p>
          )}
          <p className="mt-auto fw-semibold">{formatCLP(product.price)}</p>
          <button className="btn btn-primary w-100 mt-2" onClick={() => onAddToCart(product)}>Agregar al carrito</button>
          {isAdmin && (
            <div className="d-flex gap-2 mt-2">
              <button className="btn btn-sm btn-outline-secondary" onClick={() => onEdit?.(product)}>Editar</button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete?.(product.id)}>Eliminar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard