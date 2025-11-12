import React, { useEffect, useMemo, useState } from 'react'
import { formatCLP } from '../utils/currency'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { fetchProductsNormalized, xanoProducts, mapProduct } from '../services/xano'

const PRODUCTS_KEY = 'products_list'
const ORDERS_KEY = 'orders'
const CART_KEY = 'cart_items'
const CATEGORIES = ['Perros', 'Gatos', 'Aves', 'Peces']
const WORKERS_KEY = 'workers_list'
const PRODUCTS_SEED_FLAG = 'products_seed_7_done'

// Seed local de productos usando imágenes de /img y precios entre 10.990 y 40.000
const seedProductsFromLocalImages = () => {
  const seeds = [
    { name: 'Alimento premium ProDog', category: 'Perros', brand: 'ProDog', price: 25990, image: '/img/Alimento premium ProDog.png' },
    { name: 'Arena para gatos', category: 'Gatos', brand: 'Genérico', price: 19990, image: '/img/Arena para gatos.png' },
    { name: 'Collar de perro', category: 'Perros', brand: 'Genérico', price: 14990, image: '/img/Collar de perro.png' },
    { name: 'Comedero para aves', category: 'Aves', brand: 'Genérico', price: 18990, image: '/img/Comedero aves.webp' },
    { name: 'Filtro de pecera', category: 'Peces', brand: 'Genérico', price: 28990, image: '/img/Filtro de pecera.png' },
    { name: 'Pecera pequeña', category: 'Peces', brand: 'Genérico', price: 27990, image: '/img/Pecera pequeña.png' },
    { name: 'Pelota para perro', category: 'Perros', brand: 'Genérico', price: 11990, image: '/img/Pelota para perro.png' },
    { name: 'Rascador compacto', category: 'Gatos', brand: 'Genérico', price: 32990, image: '/img/Rascador compacto.webp' },
    { name: 'Correa para perro', category: 'Perros', brand: 'Genérico', price: 12990, image: '/img/correa-para-perro.jpg' },
    { name: 'Jaula para aves', category: 'Aves', brand: 'Genérico', price: 24990, image: '/img/jaula para aves.png' },
  ]
  return seeds.map((p, idx) => ({ id: 1000 + idx, stock: 20, ...p }))
}

function AdminPage() {
  const [cartCount, setCartCount] = useState(0)
  const [products, setProducts] = useState([])
  const [newProduct, setNewProduct] = useState({ name: '', category: CATEGORIES[0], brand: 'Genérico', price: '', imageUrl: '', stock: '20' })
  const [editingProduct, setEditingProduct] = useState(null)
  const [orders, setOrders] = useState([])
  const [workers, setWorkers] = useState([])
  const [newWorker, setNewWorker] = useState({ nombre: '', apellido: '', email: '', activo: true })
  const [workerMsg, setWorkerMsg] = useState({ type: '', text: '' })

  useEffect(() => {
    // Cart count
    try {
      const raw = localStorage.getItem(CART_KEY)
      const items = raw ? JSON.parse(raw) : []
      setCartCount(items.reduce((s, it) => s + it.qty, 0))
    } catch {}
    const onStorage = (e) => {
      if (e.key === CART_KEY) {
        try {
          const raw = localStorage.getItem(CART_KEY)
          const items = raw ? JSON.parse(raw) : []
          setCartCount(items.reduce((s, it) => s + it.qty, 0))
        } catch {}
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    // Load products and normalize stock/brand
    try {
      const raw = localStorage.getItem(PRODUCTS_KEY)
      const list = raw ? JSON.parse(raw) : []
      const normalized = Array.isArray(list) ? list.map((p) => ({ brand: p.brand ?? 'Genérico', stock: p.stock ?? 20, ...p })) : []
      setProducts(normalized)
    } catch {
      setProducts([])
    }
  }, [])

  // Cargar trabajadores (localStorage + registro de vendedor)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(WORKERS_KEY)
      let list = raw ? JSON.parse(raw) : []
      list = Array.isArray(list) ? list : []
      // Si hay un registro de vendedor reciente, incluirlo automáticamente
      try {
        const regRaw = localStorage.getItem('registration')
        const reg = regRaw ? JSON.parse(regRaw) : null
        if (reg && reg.role === 'vendedor') {
          const exists = list.some((w) => w.email === reg.email)
          if (!exists) {
            list = [...list, { nombre: reg.nombre || '', apellido: reg.apellido || '', email: reg.email || '', activo: true }]
            try { localStorage.setItem(WORKERS_KEY, JSON.stringify(list)) } catch {}
          }
        }
      } catch {}
      setWorkers(list)
    } catch {
      setWorkers([])
    }
  }, [])

  // Refrescar desde Xano (si disponible)
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const apiProducts = await fetchProductsNormalized()
        if (!cancelled && Array.isArray(apiProducts) && apiProducts.length) {
          setProducts(apiProducts)
          try { localStorage.setItem(PRODUCTS_KEY, JSON.stringify(apiProducts)) } catch {}
        } else if (!cancelled) {
          // Si backend viene vacío y no hay copia local, sembrar con imágenes locales
          try {
            const raw = localStorage.getItem(PRODUCTS_KEY)
            const list = raw ? JSON.parse(raw) : []
            if (!Array.isArray(list) || list.length === 0) {
              const seed = seedProductsFromLocalImages()
              setProducts(seed)
              try { localStorage.setItem(PRODUCTS_KEY, JSON.stringify(seed)) } catch {}
              try { localStorage.setItem(PRODUCTS_SEED_FLAG, 'done') } catch {}
            }
          } catch {}
        }
      } catch {
        // Silenciar errores
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    // Load orders
    try {
      const raw = localStorage.getItem(ORDERS_KEY)
      const list = raw ? JSON.parse(raw) : []
      setOrders(Array.isArray(list) ? list : [])
    } catch {
      setOrders([])
    }
  }, [])

  const saveProducts = (list) => {
    const normalized = Array.isArray(list) ? list : []
    if (normalized.length > 0) {
      setProducts(normalized)
      try { localStorage.setItem(PRODUCTS_KEY, JSON.stringify(normalized)) } catch {}
    } else {
      // No vaciar por error de backend: mantener copia previa o sembrar si no existe
      try {
        const raw = localStorage.getItem(PRODUCTS_KEY)
        const existing = raw ? JSON.parse(raw) : []
        if (Array.isArray(existing) && existing.length > 0) {
          setProducts(existing)
        } else {
          const seed = seedProductsFromLocalImages()
          setProducts(seed)
          try { localStorage.setItem(PRODUCTS_KEY, JSON.stringify(seed)) } catch {}
          try { localStorage.setItem(PRODUCTS_SEED_FLAG, 'done') } catch {}
        }
      } catch {}
    }
  }

  const API_ORIGIN = (() => { try { return new URL(import.meta.env.VITE_XANO_API_URL).origin } catch { return '' } })()
  const fixImg = (u) => {
    try {
      if (!u) return ''
      // Corrige valores mal guardados como `${API_ORIGIN}/img/...`
      if (API_ORIGIN && u.startsWith(API_ORIGIN) && u.includes('/img/')) {
        u = u.slice(API_ORIGIN.length)
      }
      if (/^https?:\/\//i.test(u)) return u
      if (u.startsWith('/')) {
        // Absolutiza sólo rutas de Xano (uploads/files). Mantiene `/img/...` local
        if (u.startsWith('/uploads') || u.startsWith('/upload') || u.startsWith('/file') || u.startsWith('/files')) {
          return `${API_ORIGIN}${u}`
        }
        return u
      }
      return u
    } catch { return u }
  }

  const handleCreateProduct = async (e) => {
    e.preventDefault()
    const { name, category, brand, price, imageUrl, stock } = newProduct
    if (!name.trim() || !category.trim() || !brand.trim()) return
    // Aceptar separador de miles con puntos ("12.000" -> 12000)
    const parsedPrice = parseFloat(String(price).replace(/\./g, ''))
    const stockNum = parseInt(stock, 10)
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) return
    if (Number.isNaN(stockNum) || stockNum < 0) return

    // Usar URL proporcionada y normalizar si es relativa
    if (!imageUrl?.trim()) return
    const finalImage = fixImg(imageUrl.trim())
    const priceNum = Math.round(parsedPrice)

    // Producto local para fallback inmediato si backend falla
    const localProduct = {
      id: Date.now(),
      name: name.trim(),
      category,
      brand: brand.trim(),
      price: priceNum,
      image: finalImage,
      stock: stockNum,
    }

    // Mapear categoría a pet_type del backend
    const petTypeMap = { Perros: 'Perro', Gatos: 'Gato', Aves: 'Ave', Peces: 'Pez' }
    const pet_type = petTypeMap[category] || 'Perro'

    let created = null
    // Intentar crear en Xano
    try {
      created = await xanoProducts.create({
        name: name.trim(),
        description: brand.trim(),
        price: priceNum,
        stock: stockNum,
        brand: brand.trim(),
        category,
        pet_type,
        user_id: 0,
        image_url: finalImage,
      })
    } catch (err) {
      console.error('Error creando producto en Xano:', err)
    }

    if (created) {
      // Si la creación funcionó, intentamos refrescar; si falla, añadimos localmente el creado
      try {
        const fresh = await fetchProductsNormalized()
        if (Array.isArray(fresh) && fresh.length > 0) {
          saveProducts(fresh)
        } else {
          const next = [...products, mapProduct(created)]
          saveProducts(next)
        }
      } catch {
        const next = [...products, mapProduct(created)]
        saveProducts(next)
      }
    } else {
      // Backend fuera de línea: reflejar visualmente con almacenamiento local
      const next = [...products, localProduct]
      saveProducts(next)
    }

    setNewProduct({ name: '', category: CATEGORIES[0], brand: 'Genérico', price: '', imageUrl: '', stock: '20' })
  }

  const handleStartEdit = (product) => {
    setEditingProduct({ ...product, brand: product.brand ?? 'Genérico', price: String(product.price), stock: String(product.stock ?? 20) })
  }

  const handleUpdateProduct = async (e) => {
    e.preventDefault()
    if (!editingProduct) return
    const { id, name, category, brand, price, image, stock } = editingProduct
    if (!name.trim() || !category.trim() || !brand.trim()) return
    const parsedPrice = parseFloat(price)
    const stockNum = parseInt(stock, 10)
    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) return
    if (Number.isNaN(stockNum) || stockNum < 0) return

    const finalImage = image?.trim() ? fixImg(image.trim()) : ''
    const priceNum = Math.round(parsedPrice)
    // Intentar actualizar también en Xano; si falla, dejamos estado local intacto
    try {
      await xanoProducts.update(id, {
        name: name.trim(),
        description: brand.trim(),
        price: priceNum,
        stock: stockNum,
        brand: brand.trim(),
        category,
        image_url: finalImage,
      })
      const fresh = await fetchProductsNormalized()
      saveProducts(fresh)
      setEditingProduct(null)
    } catch (err) {
      console.error('Error actualizando producto en Xano:', err)
      // caemos a actualización local para no perder cambios visuales
      const next = products.map((p) => (p.id === id ? { ...p, name: name.trim(), category, brand: brand.trim(), price: priceNum, image: finalImage || p.image, stock: stockNum } : p))
      saveProducts(next)
      setEditingProduct(null)
    }
  }

  const handleDeleteProduct = async (id) => {
    try {
      await xanoProducts.remove(id)
      const fresh = await fetchProductsNormalized()
      saveProducts(fresh)
      if (editingProduct?.id === id) setEditingProduct(null)
    } catch (err) {
      console.error('Error eliminando producto en Xano:', err)
      // fallback local para reflejar visualmente la eliminación
      const next = products.filter((p) => p.id !== id)
      saveProducts(next)
      if (editingProduct?.id === id) setEditingProduct(null)
    }
  }

  const handleStockChange = (id, value) => {
    const stockNum = parseInt(value, 10)
    if (Number.isNaN(stockNum) || stockNum < 0) return
    const next = products.map((p) => (p.id === id ? { ...p, stock: stockNum } : p))
    saveProducts(next)
  }

  // Workers helpers
  const saveWorkers = (list) => {
    setWorkers(list)
    try { localStorage.setItem(WORKERS_KEY, JSON.stringify(list)) } catch {}
  }
  const validateEmail = (email) => /^\S+@\S+\.\S+$/.test(email)
  const handleAddWorker = (e) => {
    e.preventDefault()
    setWorkerMsg({ type: '', text: '' })
    const { nombre, apellido, email } = newWorker
    if (!nombre.trim() || !apellido.trim() || !email.trim()) {
      setWorkerMsg({ type: 'error', text: 'Completa nombre, apellido y correo.' })
      return
    }
    if (!validateEmail(email)) {
      setWorkerMsg({ type: 'error', text: 'El correo no es válido.' })
      return
    }
    if (workers.some((w) => w.email === email)) {
      setWorkerMsg({ type: 'error', text: 'Ya existe un trabajador con ese correo.' })
      return
    }
    const next = [...workers, { ...newWorker, nombre: nombre.trim(), apellido: apellido.trim(), email: email.trim() }]
    saveWorkers(next)
    setNewWorker({ nombre: '', apellido: '', email: '', activo: true })
    setWorkerMsg({ type: 'success', text: 'Trabajador agregado.' })
  }
  const handleToggleWorker = (email) => {
    const next = workers.map((w) => (w.email === email ? { ...w, activo: !w.activo } : w))
    saveWorkers(next)
  }
  const handleDeleteWorker = (email) => {
    const next = workers.filter((w) => w.email !== email)
    saveWorkers(next)
  }

  // Sales of current month
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
  const monthlyOrders = useMemo(() => orders.filter((o) => {
    const d = new Date(o.createdAt)
    return d >= monthStart && d <= monthEnd
  }), [orders])
  const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + (o.total || 0), 0)
  const salesByProduct = monthlyOrders.reduce((acc, o) => {
    for (const it of o.items || []) {
      const key = it.name
      const cur = acc[key] || { qty: 0, revenue: 0 }
      acc[key] = { qty: cur.qty + (it.qty || 0), revenue: cur.revenue + (it.price || 0) * (it.qty || 0) }
    }
    return acc
  }, {})
  const topProducts = Object.entries(salesByProduct)
    .map(([name, v]) => ({ name, qty: v.qty, revenue: v.revenue }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5)
  const maxQty = topProducts.length ? Math.max(...topProducts.map((p) => p.qty)) : 1

  return (
    <>
      <Navbar cartCount={cartCount} />
      <main className="container my-4">
        <h2 className="mb-3">Panel de administrador</h2>
        <p className="text-muted">Gestiona productos, revisa stock y visualiza ventas del mes.</p>

        {/* Admin panel (crear/editar) */}
        <section className="mb-4">
          <div className="card">
            <div className="card-header fw-bold">Panel administrador</div>
            <div className="card-body">
              {!editingProduct && (
                <>
                  <h6 className="mb-3">Agregar producto</h6>
                  <form className="row g-3" onSubmit={handleCreateProduct}>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Nombre</label>
                      <input className="form-control" value={newProduct.name} onChange={(e) => setNewProduct((s) => ({ ...s, name: e.target.value }))} required />
                    </div>
                    <div className="col-12 col-md-3">
                      <label className="form-label">Categoría</label>
                      <select className="form-select" value={newProduct.category} onChange={(e) => setNewProduct((s) => ({ ...s, category: e.target.value }))}>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="col-12 col-md-3">
                      <label className="form-label">Marca</label>
                      <input className="form-control" value={newProduct.brand} onChange={(e) => setNewProduct((s) => ({ ...s, brand: e.target.value }))} required />
                    </div>
                    <div className="col-12 col-md-3">
                      <label className="form-label">Precio (CLP)</label>
                      <input type="number" step="1" min="0" className="form-control" value={newProduct.price} onChange={(e) => setNewProduct((s) => ({ ...s, price: e.target.value }))} required />
                    </div>
                    <div className="col-12 col-md-3">
                      <label className="form-label">Stock</label>
                      <input type="number" min="0" className="form-control" value={newProduct.stock} onChange={(e) => setNewProduct((s) => ({ ...s, stock: e.target.value }))} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Imagen (URL)</label>
                      <input type="url" className="form-control" value={newProduct.imageUrl} onChange={(e) => setNewProduct((s) => ({ ...s, imageUrl: e.target.value }))} required />
                      {newProduct.imageUrl?.trim() && (
                        <img alt="Vista previa" src={fixImg(newProduct.imageUrl)} className="img-thumbnail mt-2" style={{ maxWidth: '200px' }} />
                      )}
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary">Agregar producto</button>
                    </div>
                  </form>
                </>
              )}

              {editingProduct && (
                <div className="mt-4">
                  <h6 className="mb-3">Editar producto</h6>
                  <form className="row g-3" onSubmit={handleUpdateProduct}>
                    <div className="col-12 col-md-6">
                      <label className="form-label">Nombre</label>
                      <input className="form-control" value={editingProduct.name} onChange={(e) => setEditingProduct((s) => ({ ...s, name: e.target.value }))} required />
                    </div>
                    <div className="col-12 col-md-3">
                      <label className="form-label">Categoría</label>
                      <select className="form-select" value={editingProduct.category} onChange={(e) => setEditingProduct((s) => ({ ...s, category: e.target.value }))}>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="col-12 col-md-3">
                      <label className="form-label">Marca</label>
                      <input className="form-control" value={editingProduct.brand} onChange={(e) => setEditingProduct((s) => ({ ...s, brand: e.target.value }))} required />
                    </div>
                    <div className="col-12 col-md-3">
                      <label className="form-label">Precio (CLP)</label>
                      <input type="number" step="1" min="0" className="form-control" value={editingProduct.price} onChange={(e) => setEditingProduct((s) => ({ ...s, price: e.target.value }))} required />
                    </div>
                    <div className="col-12 col-md-3">
                      <label className="form-label">Stock</label>
                      <input type="number" min="0" className="form-control" value={editingProduct.stock} onChange={(e) => setEditingProduct((s) => ({ ...s, stock: e.target.value }))} required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Imagen (URL)</label>
                      <input type="url" className="form-control" value={editingProduct.image || ''} onChange={(e) => setEditingProduct((s) => ({ ...s, image: e.target.value }))} />
                      <div className="mt-2 d-flex align-items-center gap-3">
                        {editingProduct.image?.trim() && (
                          <img alt="Actual" src={fixImg(editingProduct.image)} className="img-thumbnail" style={{ maxWidth: '120px' }} />
                        )}
                      </div>
                    </div>
                    <div className="col-12 d-flex gap-2">
                      <button type="submit" className="btn btn-primary">Guardar cambios</button>
                      <button type="button" className="btn btn-outline-secondary" onClick={() => setEditingProduct(null)}>Cancelar</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Stock table */}
        <section className="mb-4">
          <h3 className="mb-2">Stock de productos</h3>
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Marca</th>
                  <th>Precio</th>
                  <th style={{ width: '160px' }}>Stock</th>
                  <th style={{ width: '120px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>{p.brand ?? 'Genérico'}</td>
                    <td>{formatCLP(p.price)}</td>
                    <td>
                      <input type="number" className="form-control form-control-sm" min="0" value={p.stock ?? 0} onChange={(e) => handleStockChange(p.id, e.target.value)} />
                    </td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => handleStartEdit(p)}>Editar</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteProduct(p.id)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!products.length && (
                  <tr>
                    <td colSpan="6" className="text-muted">No hay productos definidos.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Workers table */}
        <section className="mb-4">
          <h3 className="mb-2">Trabajadores</h3>
          <form className="row g-2 align-items-end mb-3" onSubmit={handleAddWorker}>
            <div className="col-12 col-md-3">
              <label className="form-label">Nombre</label>
              <input className="form-control" value={newWorker.nombre} onChange={(e) => setNewWorker((s) => ({ ...s, nombre: e.target.value }))} />
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label">Apellido</label>
              <input className="form-control" value={newWorker.apellido} onChange={(e) => setNewWorker((s) => ({ ...s, apellido: e.target.value }))} />
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label">Correo</label>
              <input type="email" className="form-control" value={newWorker.email} onChange={(e) => setNewWorker((s) => ({ ...s, email: e.target.value }))} placeholder="correo@ejemplo.com" />
            </div>
            <div className="col-12 col-md-2 d-grid">
              <button type="submit" className="btn btn-primary">Agregar</button>
            </div>
            {workerMsg.text && (
              <div className="col-12">
                <div className={`alert ${workerMsg.type === 'error' ? 'alert-danger' : 'alert-success'} py-2 mb-0`}>{workerMsg.text}</div>
              </div>
            )}
          </form>
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>Estado</th>
                  <th style={{ width: '220px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {workers.map((w, idx) => (
                  <tr key={w.email || idx}>
                    <td>{w.nombre || '-'}</td>
                    <td>{w.apellido || '-'}</td>
                    <td>
                      <span className={`badge ${w.activo ? 'text-bg-success' : 'text-bg-secondary'}`}>{w.activo ? 'Activo' : 'Inactivo'}</span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm" role="group">
                        <button className={`btn ${w.activo ? 'btn-outline-secondary' : 'btn-outline-success'}`} onClick={() => handleToggleWorker(w.email)}>
                          {w.activo ? 'Inactivar' : 'Activar'}
                        </button>
                        <button className="btn btn-outline-danger" onClick={() => handleDeleteWorker(w.email)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!workers.length && (
                  <tr>
                    <td colSpan="4" className="text-muted">No hay trabajadores definidos.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Monthly sales */}
        <section className="mb-4">
          <h3 className="mb-2">Ventas del mes</h3>
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="text-uppercase text-muted-custom small">Órdenes</div>
                  <div className="display-6">{monthlyOrders.length}</div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="text-uppercase text-muted-custom small">Ingresos</div>
                  <div className="display-6">{formatCLP(monthlyRevenue)}</div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <div className="text-uppercase text-muted-custom small">Productos distintos</div>
                  <div className="display-6">{Object.keys(salesByProduct).length}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="card">
              <div className="card-header fw-bold">Top productos del mes (por unidades)</div>
              <div className="card-body">
                {!topProducts.length && <div className="text-muted">Aún no hay ventas registradas este mes.</div>}
                {topProducts.map((p, idx) => {
                  const percent = Math.round((p.qty / maxQty) * 100)
                  return (
                    <div key={idx} className="mb-3">
                      <div className="d-flex justify-content-between">
                        <span className="fw-semibold">{p.name}</span>
                        <span>{p.qty} u.</span>
                      </div>
                      <div className="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={percent}>
                        <div className="progress-bar" style={{ width: `${percent}%` }}>{percent}%</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default AdminPage