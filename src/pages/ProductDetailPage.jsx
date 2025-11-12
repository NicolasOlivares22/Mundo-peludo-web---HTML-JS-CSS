import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Reviews from '../components/Reviews'
import { formatCLP } from '../utils/currency'

const PRODUCTS_KEY = 'products_list'
const CART_KEY = 'cart_items'

function ProductDetailPage() {
  const [product, setProduct] = useState(null)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY)
      const list = raw ? JSON.parse(raw) : []
      setCartCount(Array.isArray(list) ? list.reduce((s, it) => s + (it.qty || 0), 0) : 0)
    } catch { setCartCount(0) }
  }, [])

  useEffect(() => {
    try {
      const idRaw = localStorage.getItem('selected_product_id')
      const idStr = idRaw ? String(idRaw) : ''
      let found = null
      const raw = localStorage.getItem(PRODUCTS_KEY)
      const list = raw ? JSON.parse(raw) : []
      if (Array.isArray(list) && idStr) {
        found = list.find((p) => String(p.id) === idStr)
      }
      if (!found) {
        const selRaw = localStorage.getItem('selected_product')
        const sel = selRaw ? JSON.parse(selRaw) : null
        if (sel) found = sel
      }
      setProduct(found)
    } catch { setProduct(null) }
  }, [])

  const handleAddToCart = () => {
    if (!product) return
    try {
      const raw = localStorage.getItem(CART_KEY)
      const list = raw ? JSON.parse(raw) : []
      const exists = list.find((it) => it.id === product.id)
      const next = exists
        ? list.map((it) => (it.id === product.id ? { ...it, qty: (it.qty || 0) + 1 } : it))
        : [...list, { id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 }]
      localStorage.setItem(CART_KEY, JSON.stringify(next))
      setCartCount(next.reduce((s, it) => s + (it.qty || 0), 0))
    } catch {}
  }

  const goBack = () => { window.location.hash = '#/productos' }

  const makeDescription = (p) => {
    const brand = p.brand ? `Marca: ${p.brand}. ` : ''
    const cat = p.category ? `Categoría: ${p.category}. ` : ''
    return `${brand}${cat}Producto "${p.name}" ideal para mascotas.`
  }

  return (
    <>
      <Navbar cartCount={cartCount} />
      <main className="container my-4">
        {!product ? (
          <div className="alert alert-warning">No encontramos el producto seleccionado. Vuelve al listado.</div>
        ) : (
          <div className="row g-4">
            <div className="col-12 col-lg-5">
              <div className="card shadow-sm">
                <img src={product.image} alt={product.name} className="card-img-top" onError={(e) => { e.currentTarget.src = '/img/mundo-peludo-logo.png' }} />
              </div>
            </div>
            <div className="col-12 col-lg-7">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h3 className="mb-0">{product.name}</h3>
                <span className="badge bg-success">Disponible</span>
              </div>
              {product.brand && <div className="text-muted mb-1">Marca: {product.brand}</div>}
              {product.category && <div className="text-muted mb-3">Categoría: {product.category}</div>}
              <div className="display-6 mb-2">{formatCLP(product.price)}</div>
              <div className="mb-3">Stock: {product.stock ?? 20}</div>
              <p className="mb-3">{makeDescription(product)}</p>
              <div className="d-flex gap-2">
                <button className="btn btn-primary" onClick={handleAddToCart}>Agregar al carrito</button>
                <button className="btn btn-outline-secondary" onClick={goBack}>Volver al listado</button>
              </div>
              <hr className="my-4" />
              <Reviews />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

export default ProductDetailPage