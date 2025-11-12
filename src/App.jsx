import React, { useEffect, useState } from 'react'
import { formatCLP } from './utils/currency'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Carousel from './components/Carousel'
import Reviews from './components/Reviews'
import Footer from './components/Footer'

const CART_KEY = 'cart_items'

function App() {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY)
      const items = raw ? JSON.parse(raw) : []
      setCartCount(items.reduce((s, it) => s + it.qty, 0))
    } catch {
      setCartCount(0)
    }
  }, [])

  useEffect(() => {
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

  const bestSellers = [
    { id: 1001, name: 'Correa para perro', price: 15990, image: '/img/correa-para-perro.jpg', category: 'Perros' },
    { id: 4, name: 'Rascador compacto', price: 19990, image: '/img/Rascador compacto.webp', category: 'Gatos' },
    { id: 5, name: 'Comedero para aves', price: 12990, image: '/img/Comedero aves.webp', category: 'Aves' },
  ]

  const addToCart = (product) => {
    try {
      const raw = localStorage.getItem(CART_KEY)
      const list = raw ? JSON.parse(raw) : []
      const exists = list.find((it) => it.id === product.id)
      const next = exists
        ? list.map((it) => (it.id === product.id ? { ...it, qty: it.qty + 1 } : it))
        : [...list, { id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 }]
      localStorage.setItem(CART_KEY, JSON.stringify(next))
      setCartCount(next.reduce((s, it) => s + it.qty, 0))
    } catch {}
  }

  const goToCategory = (category) => {
    try { localStorage.setItem('products_initial_category', category) } catch {}
    window.location.hash = '#/productos'
  }

  return (
    <>
      <Navbar cartCount={cartCount} />
      <Hero />
      <Carousel />

      <main className="container my-4">
        <section className="mb-5">
          <div className="row text-center g-4 align-items-start">
            <div className="col-12 col-md-4">
              <div className="feature-icon mx-auto mb-3 d-flex align-items-center justify-content-center">
                <i className="bi bi-check2"></i>
              </div>
              <div className="text-uppercase text-muted-custom small">Satisfacción garantizada</div>
              <h3 className="mt-2">Profesionales a cargo</h3>
              <p className="text-muted-custom">Más de 12 años de experiencia asesorando y entregando el mejor servicio.</p>
              <a href="#" className="link-primary">Ver más</a>
            </div>
            <div className="col-12 col-md-4">
              <div className="feature-icon mx-auto mb-3 d-flex align-items-center justify-content-center">
                <i className="bi bi-bag"></i>
              </div>
              <div className="text-uppercase text-muted-custom small">Puntos de retiro</div>
              <h3 className="mt-2">Retiro Gratis en tienda y bodega</h3>
              <p className="text-muted-custom">Retira tus compras gratis en tiendas o Puntos habilitados.</p>
              <a href="#" className="link-primary">Ver más</a>
            </div>
            <div className="col-12 col-md-4">
              <div className="feature-icon mx-auto mb-3 d-flex align-items-center justify-content-center">
                <i className="bi bi-truck"></i>
              </div>
              <div className="text-uppercase text-muted-custom small">En la puerta de tu casa</div>
              <h3 className="mt-2">Envío Gratis desde $39.990*</h3>
              <p className="text-muted-custom">En comunas seleccionadas. Aplica términos y condiciones.</p>
              <a href="#" className="link-primary">Ver más</a>
            </div>
          </div>
        </section>

        <section className="mb-4">
          <h2 className="mb-3">Productos más vendidos</h2>
          <div className="row row-cols-1 row-cols-md-3 g-3">
            {bestSellers.map((p) => (
              <div className="col" key={p.id}>
                <div className="card h-100">
                  <img src={p.image} alt={p.name} className="card-img-top" />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text text-muted-custom mb-1">{p.category}</p>
                    <div className="fw-bold mb-3">{formatCLP(p.price)}</div>
                    <div className="mt-auto d-flex gap-2">
                      <button className="btn btn-primary" onClick={() => { addToCart(p); goToCategory(p.category) }}>Agregar al carrito</button>
                      <button className="btn btn-outline-primary" onClick={() => goToCategory(p.category)}>Ver productos</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Reviews />
      </main>

      <section className="section-alt border-top">
        <div className="container py-5">
          <div className="row g-4">
            <div className="col-12 col-md-4">
              <h5 className="mb-2">¿Quiénes somos?</h5>
              <p className="text-muted-custom mb-0">Mundo Peludo es una tienda dedicada al bienestar de tus mascotas. Contamos con años de experiencia y seleccionamos productos de calidad para perros, gatos, aves y peces.</p>
            </div>
            <div className="col-12 col-md-4">
              <h5 className="mb-2">Por qué elegirnos</h5>
              <ul className="list-unstyled text-muted-custom mb-0">
                <li><i className="bi bi-truck me-2"></i>Envíos rápidos y confiables</li>
                <li><i className="bi bi-shield-check me-2"></i>Productos certificados</li>
                <li><i className="bi bi-heart me-2"></i>Atención cercana y asesoría</li>
              </ul>
            </div>
            <div className="col-12 col-md-4">
              <h5 className="mb-2">Contacto</h5>
              <ul className="list-unstyled text-muted-custom mb-3">
                <li><i className="bi bi-whatsapp me-2"></i>+56 9 1234 5678</li>
                <li><i className="bi bi-envelope me-2"></i>ventas@mundopeludo.cl</li>
              </ul>
              <div className="d-flex gap-3">
                <a href="#" className="text-decoration-none"><i className="bi bi-instagram"></i> <span className="ms-1">@mundopeludo</span></a>
                <a href="#" className="text-decoration-none"><i className="bi bi-facebook"></i> <span className="ms-1">/mundopeludo</span></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default App
