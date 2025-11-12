import React, { useEffect, useRef, useState } from 'react'

const VENDOR_EMAIL = 'vendedor@gmail.com'
const ADMIN_EMAIL = 'admin@gmail.com'

function Navbar({ cartCount = 0, onToggleCart }) {
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginSuccess, setLoginSuccess] = useState('')
  const [role, setRole] = useState('')
  const [loginErrors, setLoginErrors] = useState({})
  const loginToastRef = useRef(null)

  useEffect(() => {
    try {
      setRole(localStorage.getItem('user_role') || '')
    } catch {}
    const onStorage = (e) => {
      if (e.key === 'user_role') {
        try { setRole(localStorage.getItem('user_role') || '') } catch {}
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const validateLogin = (email, pass) => {
    const e = {}
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = 'El correo no es válido.'
    if (!pass || pass.length < 4) e.password = 'Ingresa tu contraseña.'
    return e
  }

  useEffect(() => {
    setLoginErrors(validateLogin(loginEmail, loginPassword))
  }, [loginEmail, loginPassword])

  const handleLogin = (e) => {
    e.preventDefault()
    setLoginError('')
    setLoginSuccess('')

    const email = loginEmail.trim()
    const pass = loginPassword.trim()
    const v = validateLogin(email, pass)
    setLoginErrors(v)
    if (Object.keys(v).length) {
      setLoginError('Revisa los campos marcados.')
      return
    }
    if (!email || !pass) {
      setLoginError('Correo y contraseña son obligatorios.')
      return
    }
    if (email !== VENDOR_EMAIL && email !== ADMIN_EMAIL) {
      setLoginError('Usuario no reconocido. Use vendedor@gmail.com o admin@gmail.com.')
      return
    }
    if (email === ADMIN_EMAIL && pass !== 'admin') {
      setLoginError('Contraseña incorrecta para administrador.')
      return
    }
    const role = email === ADMIN_EMAIL ? 'administrador' : 'vendedor'
    try {
      localStorage.setItem('user_role', role)
      localStorage.setItem('user_email', email)
    } catch {}
    setLoginSuccess(`Sesión iniciada como ${role}.`)
    setRole(role)
    try {
      if (loginToastRef.current && window.bootstrap?.Toast) {
        const t = window.bootstrap.Toast.getOrCreateInstance(loginToastRef.current)
        t.show()
      }
    } catch {}
  }

  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom sticky-top">
      <div className="container">
        <a className="navbar-brand fw-bold" href="#/">Mundo Peludo</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#/">Inicio</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#/productos">Productos</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/noticias.html">Noticias</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#contacto">Contacto</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" role="button" data-bs-toggle="modal" data-bs-target="#loginModal">Inicio de sesión</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#/registro">Registrarse</a>
            </li>
            {role === 'administrador' && (
              <li className="nav-item">
                <a className="nav-link text-danger fw-semibold" href="#/administrador">Admin</a>
              </li>
            )}
          </ul>
          {onToggleCart ? (
            <button className="btn btn-outline-primary" onClick={onToggleCart}>
              Carrito
              <span className="badge text-bg-primary ms-2">{cartCount}</span>
            </button>
          ) : (
            <a className="btn btn-outline-primary" href="#/carrito">
              Carrito
              <span className="badge text-bg-primary ms-2">{cartCount}</span>
            </a>
          )}
        </div>
      </div>
    </nav>

    {/* Login Modal */}
    <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content login-card">
          <div className="modal-header login-header">
            <h5 className="modal-title" id="loginModalLabel">Inicio de sesión</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form onSubmit={handleLogin}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Correo</label>
                <div className="input-group">
                  <span className="input-group-text paw">🐾</span>
                  <input type="email" className={`form-control ${loginErrors.email ? 'is-invalid' : ''}`} value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="correo@ejemplo.com" aria-describedby="loginEmailHelp" />
                </div>
                {loginErrors.email && <div className="invalid-feedback d-block">{loginErrors.email}</div>}
              </div>
              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <div className="input-group">
                  <span className="input-group-text paw">🐾</span>
                  <input type="password" className={`form-control ${loginErrors.password ? 'is-invalid' : ''}`} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} aria-describedby="loginPassHelp" />
                </div>
                {loginErrors.password && <div className="invalid-feedback d-block">{loginErrors.password}</div>}
              </div>
              {loginError && <div className="alert alert-danger py-2">{loginError}</div>}
              {loginSuccess && <div className="alert alert-success py-2">{loginSuccess}</div>}
              <div className="small text-muted">Use vendedor@gmail.com o admin@gmail.com (contraseña "admin" para administrador).</div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              <button type="submit" className="btn btn-paw">Iniciar sesión</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    {/* Toast de éxito de login */}
    <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1100 }}>
      <div id="loginToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true" ref={loginToastRef}>
        <div className="toast-header">
          <strong className="me-auto">Mundo Peludo</strong>
          <small>Ahora</small>
          <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div className="toast-body">{loginSuccess || 'Sesión iniciada.'}</div>
      </div>
    </div>

    </>
  )
}

export default Navbar