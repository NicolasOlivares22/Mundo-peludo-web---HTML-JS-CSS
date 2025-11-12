import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'
import BrandFilter from '../components/BrandFilter'
import PriceFilter from '../components/PriceFilter'
import ProductGrid from '../components/ProductGrid'
import Cart from '../components/Cart'
import Footer from '../components/Footer'
import { fetchProductsNormalized, xanoProducts } from '../services/xano'
const API_ORIGIN = (() => { try { return new URL(import.meta.env.VITE_XANO_API_URL).origin } catch { return '' } })()
const fixImg = (u) => {
  try {
    if (!u) return ''
    // Corrige entradas mal guardadas como `${API_ORIGIN}/img/...` de migraciones previas
    if (API_ORIGIN && u.startsWith(API_ORIGIN) && u.includes('/img/')) {
      u = u.slice(API_ORIGIN.length)
    }
    if (/^https?:\/\//i.test(u)) return u
    if (u.startsWith('/')) {
      // Sólo absolutiza rutas de Xano (uploads/files). Mantiene rutas locales `/img/...`
      if (u.startsWith('/uploads') || u.startsWith('/upload') || u.startsWith('/file') || u.startsWith('/files')) {
        return `${API_ORIGIN}${u}`
      }
      return u
    }
    return u
  } catch { return u }
}

const FALLBACK_IMG = '/img/mundo-peludo-logo.png'
const matchLocalImageByName = (name) => {
  const raw = (name || '').trim()
  if (!raw) return ''
  // Normaliza: minúsculas, sin acentos, sin guiones/puntuación extra
  const norm = raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const byExact = {
    'alimento premium prodog': '/img/Alimento premium ProDog.png',
    'arena para gatos': '/img/Arena para gatos.png',
    'collar de perro': '/img/Collar de perro.png',
    'comedero para aves': '/img/Comedero aves.webp',
    'comedero aves': '/img/Comedero aves.webp',
    'filtro de pecera': '/img/Filtro de pecera.png',
    'pecera pequena': '/img/Pecera pequeña.png',
    'pelota para perro': '/img/Pelota para perro.png',
    'rascador compacto': '/img/Rascador compacto.webp',
    'correa para perro': '/img/correa-para-perro.jpg',
    'jaula para aves': '/img/jaula para aves.png',
    'alimento de gato purina cat': '/img/alimento de gato purina cat.png',
    'alimento de gato purina car': '/img/alimento de gato purina cat.png',
  }
  if (byExact[norm]) return byExact[norm]

  // Heurísticos por inclusión para nombres parecidos
  if (norm.includes('rascador') && norm.includes('compacto')) return '/img/Rascador compacto.webp'
  if (norm.includes('correa') && norm.includes('perro')) return '/img/correa-para-perro.jpg'
  if (norm.includes('comedero') && norm.includes('ave')) return '/img/Comedero aves.webp'
  if (norm.includes('alimento') && norm.includes('premium') && norm.includes('prodog')) return '/img/Alimento premium ProDog.png'
  if (norm.includes('arena') && (norm.includes('gato'))) return '/img/Arena para gatos.png'
  if (norm.includes('collar') && norm.includes('perro')) return '/img/Collar de perro.png'
  if (norm.includes('filtro') && (norm.includes('pecera') || norm.includes('acuario') || norm.includes('pez'))) return '/img/Filtro de pecera.png'
  if (norm.includes('pecera') && norm.includes('pequena')) return '/img/Pecera pequeña.png'
  if (norm.includes('pelota') && norm.includes('perro')) return '/img/Pelota para perro.png'
  if (norm.includes('jaula') && norm.includes('ave')) return '/img/jaula para aves.png'
  if (norm.includes('alimento') && norm.includes('gato') && norm.includes('purina')) return '/img/alimento de gato purina cat.png'
  return ''
}

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Alimento seco Premium 3kg', category: 'Perros', brand: 'ProDog', price: 25990, image: 'https://images.unsplash.com/photo-1558944351-c6a8775ab8d4?q=80&w=600&auto=format&fit=crop' },
  { id: 2, name: 'Arena aglomerante 10L', category: 'Gatos', brand: 'CatsBest', price: 19990, image: 'https://images.unsplash.com/photo-1555685812-4b74353f8f89?q=80&w=600&auto=format&fit=crop' },
  { id: 3, name: 'Rascador torre para gatos', category: 'Gatos', brand: 'Catit', price: 34990, image: 'https://images.unsplash.com/photo-1601758124163-3c3e6c4c8752?q=80&w=600&auto=format&fit=crop' },
  { id: 4, name: 'Juguete cuerda resistente', category: 'Perros', brand: 'KONG', price: 12990, image: 'https://images.unsplash.com/photo-1591474200740-0429bc566c3b?q=80&w=600&auto=format&fit=crop' },
  { id: 5, name: 'Comedero automático para aves', category: 'Aves', brand: 'WildBird', price: 16990, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop' },
  { id: 6, name: 'Filtro externo para pecera', category: 'Peces', brand: 'AquaClear', price: 28990, image: 'https://images.unsplash.com/photo-1544551763-ced38bcb06b3?q=80&w=600&auto=format&fit=crop' },
  { id: 7, name: 'Shampoo hipoalergénico perros', category: 'Perros', brand: 'PetCare', price: 13990, image: 'https://images.unsplash.com/photo-1583511655857-d0645b4b1d2a?q=80&w=600&auto=format&fit=crop' },
]

const CART_KEY = 'cart_items'
const PRODUCTS_KEY = 'products_list'
const PRODUCTS_SEED_FLAG = 'products_seed_7_done'
const PRODUCTS_IMG_PERSIST_FLAG = 'products_img_persist_done_v1'

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

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todos')
  const [brand, setBrand] = useState('Todos')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [cartCount, setCartCount] = useState(0)
  const [items, setItems] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  // No se usa panel de administrador en esta vista

  useEffect(() => {
    // Cargar copia local si existe (proveniente del backend). No mezclar con seed.
    try {
      const raw = localStorage.getItem(PRODUCTS_KEY)
      if (raw) {
        const list = JSON.parse(raw)
        const normalized = Array.isArray(list)
          ? list.map((p) => {
              const fixed = fixImg(p.image)
              const local = matchLocalImageByName(p.name)
              // Priorizar imagen local si hay coincidencia por nombre
              return { brand: p.brand ?? 'Genérico', stock: p.stock ?? 20, ...p, image: local || fixed || FALLBACK_IMG }
            })
          : []
        setProducts(normalized)
      }
    } catch {}
  }, [])

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      const apiProducts = await fetchProductsNormalized()
      const next = Array.isArray(apiProducts)
        ? apiProducts.map((p) => {
            const fixed = fixImg(p.image)
            const local = matchLocalImageByName(p.name)
            // Priorizar imagen local si hay coincidencia
            return { brand: p.brand ?? 'Genérico', stock: p.stock ?? 20, ...p, image: local || fixed || FALLBACK_IMG }
          })
        : []
      // No sobrescribir ni vaciar si el backend viene vacío
      if (next.length > 0) {
        setProducts(next)
        try { localStorage.setItem(PRODUCTS_KEY, JSON.stringify(next)) } catch {}
      } else {
        // Si no hay datos en backend y tampoco en localStorage, sembrar con imágenes locales
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
      // Si falla la petición (sin backend o error), usar seed si no hay nada en cache
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
    finally {
      setRefreshing(false)
    }
  }

  // Refrescar desde Xano (si disponible) y cachear en localStorage; sin mezclar con seed local
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const apiProducts = await fetchProductsNormalized()
        if (!cancelled && Array.isArray(apiProducts) && apiProducts.length > 0) {
          // Usar exclusivamente lo que venga del backend (o lista vacía) y completar con imágenes locales si faltan
          const next = apiProducts.map((p) => {
            const fixed = fixImg(p.image)
            const local = matchLocalImageByName(p.name)
            // Priorizar imagen local si hay coincidencia
            return { brand: p.brand ?? 'Genérico', stock: p.stock ?? 20, ...p, image: local || fixed || FALLBACK_IMG }
          })
          setProducts(next)
          try { localStorage.setItem(PRODUCTS_KEY, JSON.stringify(next)) } catch {}

          // Persistir en Xano las imágenes locales asignadas (una sola vez)
          try {
            if (!localStorage.getItem(PRODUCTS_IMG_PERSIST_FLAG)) {
              for (let i = 0; i < apiProducts.length; i++) {
                const p = apiProducts[i]
                const fixed = fixImg(p.image)
                const local = matchLocalImageByName(p.name)
                // Caso 1: hay imagen local por nombre; persistirla (prioridad local)
                if (local && fixed !== local) {
                  await xanoProducts.update(p.id, { image_url: local })
                }
                // Caso 2: viene como `${API_ORIGIN}/img/...`, guardemos sólo `/img/...`
                else if (fixed && fixed.startsWith(API_ORIGIN) && fixed.includes('/img/')) {
                  await xanoProducts.update(p.id, { image_url: fixed.slice(API_ORIGIN.length) })
                }
              }
              localStorage.setItem(PRODUCTS_IMG_PERSIST_FLAG, 'done')
            }
          } catch {}
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
        // Si falla la petición (CORS, red, auth), usar seed si no hay nada en cache
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
    }
    load()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    try {
      const initCat = localStorage.getItem('products_initial_category')
      if (initCat) {
        setCategory(initCat)
        localStorage.removeItem('products_initial_category')
      }
    } catch {}
  }, [])

  useEffect(() => {
    let next = [...products]
    if (category !== 'Todos') next = next.filter((p) => p.category === category)
    if (brand !== 'Todos') next = next.filter((p) => (p.brand ?? 'Genérico') === brand)
    const min = parseFloat(minPrice)
    if (!Number.isNaN(min)) next = next.filter((p) => p.price >= min)
    const max = parseFloat(maxPrice)
    if (!Number.isNaN(max)) next = next.filter((p) => p.price <= max)
    if (query.trim()) {
      const q = query.toLowerCase()
      next = next.filter((p) => p.name.toLowerCase().includes(q))
    }
    setFiltered(next)
  }, [products, query, category, brand, minPrice, maxPrice])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY)
      const stored = raw ? JSON.parse(raw) : []
      setItems(stored)
      setCartCount(stored.reduce((s, it) => s + it.qty, 0))
    } catch {
      setItems([])
      setCartCount(0)
    }

    const onStorage = (e) => {
      if (e.key === CART_KEY) {
        const nextRaw = localStorage.getItem(CART_KEY)
        const nextItems = nextRaw ? JSON.parse(nextRaw) : []
        setItems(nextItems)
        setCartCount(nextItems.reduce((s, it) => s + it.qty, 0))
        return
      }
      if (e.key === PRODUCTS_KEY) {
        try {
          const nextRaw = localStorage.getItem(PRODUCTS_KEY)
          const list = nextRaw ? JSON.parse(nextRaw) : []
          if (Array.isArray(list) && list.length > 0) {
            const normalized = list.map((p) => {
              const fixed = fixImg(p.image)
              const local = matchLocalImageByName(p.name)
              return { brand: p.brand ?? 'Genérico', stock: p.stock ?? 20, ...p, image: fixed || local || FALLBACK_IMG }
            })
            setProducts(normalized)
          }
          // Ignorar escrituras vacías para no borrar por un fallo temporal del backend
        } catch {
          // si hay error al leer, no actualizamos
        }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const handleAddToCart = (product) => {
    try {
      const raw = localStorage.getItem(CART_KEY)
      const list = raw ? JSON.parse(raw) : []
      const exists = list.find((it) => it.id === product.id)
      const next = exists
        ? list.map((it) => (it.id === product.id ? { ...it, qty: it.qty + 1 } : it))
        : [...list, { id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 }]
      localStorage.setItem(CART_KEY, JSON.stringify(next))
      setItems(next)
      setCartCount(next.reduce((s, it) => s + it.qty, 0))
    } catch {}
  }

  const openProductDetail = (product) => {
    try {
      localStorage.setItem('selected_product_id', String(product.id))
      localStorage.setItem('selected_product', JSON.stringify(product))
    } catch {}
    window.location.hash = '#/producto'
  }

  const handleRemove = (id) => {
    const next = items.filter((it) => it.id !== id)
    setItems(next)
    localStorage.setItem(CART_KEY, JSON.stringify(next))
    setCartCount(next.reduce((s, it) => s + it.qty, 0))
  }

  const handleClear = () => {
    setItems([])
    localStorage.setItem(CART_KEY, JSON.stringify([]))
    setCartCount(0)
  }

  return (
    <>
      <Navbar cartCount={cartCount} />
      <main className="container my-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Productos</h2>
          <button className="btn btn-outline-secondary btn-sm" onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? 'Actualizando…' : 'Actualizar'}
          </button>
        </div>
        {/* Panel de administrador eliminado en Productos */}
        <div className="d-flex flex-wrap gap-3 align-items-center mb-3">
          <SearchBar query={query} onChange={setQuery} />
          <CategoryFilter category={category} onChange={setCategory} />
          {(() => {
            const brandOptions = Array.from(new Set(products.map((p) => p.brand ?? 'Genérico'))).sort()
            return (
              <>
                <BrandFilter brand={brand} brands={brandOptions} onChange={setBrand} />
                <PriceFilter
                  min={minPrice}
                  max={maxPrice}
                  onChangeMin={setMinPrice}
                  onChangeMax={setMaxPrice}
                  onClear={() => { setMinPrice(''); setMaxPrice('') }}
                />
              </>
            )
          })()}
        </div>

        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <ProductGrid
              products={filtered}
              onAddToCart={handleAddToCart}
              onOpenDetail={openProductDetail}
            />
          </div>
          <div className="col-12 col-lg-4">
            <Cart items={items} onRemove={handleRemove} onClear={handleClear} />
          </div>
        </div>

        <section className="mt-4">
          <h3 className="mb-2">Reseñas de usuarios</h3>
          <p className="text-muted">¿Ya compraste? ¡Cuéntanos tu experiencia!</p>
          <a className="btn btn-outline-primary" href="#/comentarios">¡Déjanos tus comentarios!</a>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default ProductsPage