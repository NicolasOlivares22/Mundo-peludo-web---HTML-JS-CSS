import React, { useEffect, useState } from 'react'

const STORAGE_KEY = 'user_reviews'

function Stars({ rating = 5 }) {
  const full = Math.max(0, Math.min(5, Math.round(rating)))
  const empties = 5 - full
  return (
    <div className="mb-2 text-warning">
      {Array.from({ length: full }).map((_, i) => <i key={`f-${i}`} className="bi bi-star-fill"></i>)}
      {Array.from({ length: empties }).map((_, i) => <i key={`e-${i}`} className="bi bi-star"></i>)}
    </div>
  )
}

const SAMPLE = [
  { rating: 5, comment: 'Excelente atención y productos de calidad. Mi perro ama su nuevo alimento.', name: 'Camila R.' },
  { rating: 4, comment: 'Buen precio y envío rápido. El rascador para mi gato es perfecto.', name: 'Diego M.' },
  { rating: 5, comment: 'Variedad de productos y muy buena asesoría. Recomendado 100%.', name: 'Fernanda P.' },
]

function Reviews() {
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const list = raw ? JSON.parse(raw) : []
      setReviews(Array.isArray(list) ? list : [])
    } catch {
      setReviews([])
    }

    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        try {
          const nextRaw = localStorage.getItem(STORAGE_KEY)
          const next = nextRaw ? JSON.parse(nextRaw) : []
          setReviews(Array.isArray(next) ? next : [])
        } catch {}
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const list = reviews.length ? [...reviews].reverse().slice(0, 3) : SAMPLE

  return (
    <section id="reviews" className="mb-5">
      <h2 className="mb-3">Reseñas de usuarios</h2>
      <div className="row row-cols-1 row-cols-md-3 g-3">
        {list.map((r, idx) => (
          <div className="col" key={idx}>
            <div className="card h-100">
              <div className="card-body">
                <Stars rating={r.rating} />
                <p className="card-text">“{r.comment}”</p>
                <div className="text-muted-custom">— {r.name || 'Usuario'}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <a className="btn btn-outline-primary" href="#/comentarios">¡Déjanos tus comentarios!</a>
      </div>
    </section>
  )
}

export default Reviews