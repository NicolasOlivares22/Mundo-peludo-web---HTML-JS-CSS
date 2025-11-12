import React from 'react'
import ProductCard from './ProductCard'

function ProductGrid({ products, onAddToCart, onOpenDetail, isAdmin = false, onEdit, onDelete }) {
  if (!products?.length) {
    return <p className="text-muted">No hay productos para mostrar.</p>
  }

  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3" id="productos">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} onOpenDetail={onOpenDetail} isAdmin={isAdmin} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default ProductGrid