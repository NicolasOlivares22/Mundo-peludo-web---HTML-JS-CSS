import React, { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function RegisterPage() {
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', password: '', confirm: '', role: 'cliente' })
  const [errors, setErrors] = useState({})
  const successModalRef = useRef(null)

  const validate = (f) => {
    const e = {}
    if (!f.nombre.trim()) e.nombre = 'Ingresa tu nombre.'
    if (!f.apellido.trim()) e.apellido = 'Ingresa tu apellido.'
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'El correo no es válido.'
    if (!f.password || f.password.length < 8) e.password = 'La contraseña debe tener al menos 8 caracteres.'
    if (f.confirm !== f.password) e.confirm = 'Las contraseñas no coinciden.'
    if (!['cliente', 'vendedor'].includes(f.role)) e.role = 'Selecciona un rol válido.'
    return e
  }

  useEffect(() => {
    setErrors(validate(form))
  }, [form])

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const v = validate(form)
    setErrors(v)
    if (Object.keys(v).length) return
    try {
      localStorage.setItem('registration', JSON.stringify({ ...form, createdAt: new Date().toISOString() }))
    } catch {}
    try {
      if (successModalRef.current && window.bootstrap?.Modal) {
        const m = window.bootstrap.Modal.getOrCreateInstance(successModalRef.current)
        m.show()
      }
    } catch {}
  }

  return (
    <>
      <Navbar />
      <main className="container py-4">
        <div className="d-flex justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card register-card">
              <div className="card-header register-header">
                <h2 className="mb-0">Crear cuenta</h2>
              </div>
              <div className="card-body">
                <p className="text-muted mb-3">Completa tus datos. Validamos en tiempo real para ayudarte.</p>

                <form onSubmit={handleSubmit} noValidate>
                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="form-label" htmlFor="nombre">Nombre</label>
                      <div className="input-group">
                        <span className="input-group-text paw">🐾</span>
                        <input id="nombre" type="text" className={`form-control ${errors.nombre ? 'is-invalid' : ''}`} value={form.nombre} onChange={(e) => handleChange('nombre', e.target.value)} aria-describedby="nombreHelp" />
                      </div>
                      {errors.nombre && <div className="invalid-feedback d-block">{errors.nombre}</div>}
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label" htmlFor="apellido">Apellido</label>
                      <div className="input-group">
                        <span className="input-group-text paw">🐾</span>
                        <input id="apellido" type="text" className={`form-control ${errors.apellido ? 'is-invalid' : ''}`} value={form.apellido} onChange={(e) => handleChange('apellido', e.target.value)} />
                      </div>
                      {errors.apellido && <div className="invalid-feedback d-block">{errors.apellido}</div>}
                    </div>

                    <div className="col-12">
                      <label className="form-label" htmlFor="email">Email</label>
                      <div className="input-group">
                        <span className="input-group-text paw">🐾</span>
                        <input id="email" type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} placeholder="correo@ejemplo.com" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
                      </div>
                      {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label" htmlFor="password">Contraseña</label>
                      <div className="input-group">
                        <span className="input-group-text paw">🐾</span>
                        <input id="password" type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} value={form.password} onChange={(e) => handleChange('password', e.target.value)} />
                      </div>
                      <div className="form-text">Mínimo 8 caracteres.</div>
                      {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label" htmlFor="confirm">Confirmar contraseña</label>
                      <div className="input-group">
                        <span className="input-group-text paw">🐾</span>
                        <input id="confirm" type="password" className={`form-control ${errors.confirm ? 'is-invalid' : ''}`} value={form.confirm} onChange={(e) => handleChange('confirm', e.target.value)} />
                      </div>
                      {errors.confirm && <div className="invalid-feedback d-block">{errors.confirm}</div>}
                    </div>

                    <div className="col-12">
                      <label className="form-label" htmlFor="role">Rol</label>
                      <select id="role" className={`form-select ${errors.role ? 'is-invalid' : ''}`} value={form.role} onChange={(e) => handleChange('role', e.target.value)}>
                        <option value="cliente">Cliente</option>
                        <option value="vendedor">Vendedor</option>
                      </select>
                      {errors.role && <div className="invalid-feedback d-block">{errors.role}</div>}
                    </div>
                  </div>

                  <div className="mt-4 d-grid">
                    <button type="submit" className="btn btn-paw btn-lg">Crear cuenta</button>
                  </div>

                  <div className="mt-3 text-center">
                    <span className="text-muted">¿Ya tienes cuenta? </span>
                    <a href="#" data-bs-toggle="modal" data-bs-target="#loginModal">Inicia sesión aquí</a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modal éxito */}
      <div className="modal fade" id="successModal" tabIndex="-1" aria-labelledby="successModalLabel" aria-hidden="true" ref={successModalRef}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="successModalLabel">¡Cuenta creada!</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>Tu cuenta de <strong>Mundo Peludo</strong> fue creada correctamente.</p>
              <p className="mb-0">Bienvenido(a), <strong>{form.nombre || 'Usuario'}</strong> ({form.role}).</p>
            </div>
            <div className="modal-footer">
              <a className="btn btn-primary" href="#/">Ir al inicio</a>
              <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default RegisterPage