import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function StarPicker({ value, onChange }) {
  return (
    <div className="d-flex gap-2" role="group" aria-label="Cantidad de estrellas">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`btn btn-sm ${n <= value ? 'btn-warning' : 'btn-outline-warning'}`}
          onClick={() => onChange(n)}
          aria-label={`${n} estrella${n > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  )}

function CommentsPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!comment.trim() || rating < 1 || rating > 5) return
    try {
      const raw = localStorage.getItem('user_reviews')
      const list = raw ? JSON.parse(raw) : []
      list.push({ name: name.trim(), email: email.trim(), rating, comment: comment.trim(), date: new Date().toISOString() })
      localStorage.setItem('user_reviews', JSON.stringify(list))
    } catch {}
    setSubmitted(true)
    setName('')
    setEmail('')
    setRating(5)
    setComment('')
  }

  return (
    <>
      <Navbar cartCount={0} />
      <main className="container my-4">
        <h2 className="mb-3">Déjanos tus comentarios</h2>
        <p className="text-muted mb-4">Tu opinión nos ayuda a mejorar. ¡Gracias!</p>
        {submitted && (
          <div className="alert alert-success" role="alert">
            ¡Gracias por tu reseña! La hemos recibido correctamente.
          </div>
        )}
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-12 col-md-6">
            <label className="form-label">Nombre (opcional)</label>
            <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Correo electrónico (opcional)</label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Cantidad de estrellas</label>
            <StarPicker value={rating} onChange={setRating} />
          </div>
          <div className="col-12">
            <label className="form-label">Reseña</label>
            <textarea className="form-control" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} required />
          </div>
          <div className="col-12 d-flex gap-2">
            <button type="submit" className="btn btn-primary">Enviar reseña</button>
            <a className="btn btn-outline-secondary" href="#/productos">Volver a productos</a>
          </div>
        </form>
      </main>
      <Footer />
    </>
  )
}

export default CommentsPage