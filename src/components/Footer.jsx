import React from 'react'

function Footer() {
  return (
    <footer className="mt-5 py-4 bg-light border-top" id="contacto">
      <div className="container d-flex flex-wrap gap-3 justify-content-between align-items-center">
        <p className="mb-0">© {new Date().getFullYear()} Mundo Peludo. Todos los derechos reservados.</p>
        <ul className="nav">
          <li className="nav-item"><a href="#" className="nav-link px-2 text-muted">Privacidad</a></li>
          <li className="nav-item"><a href="#" className="nav-link px-2 text-muted">Términos</a></li>
          <li className="nav-item"><a href="#" className="nav-link px-2 text-muted">Contacto</a></li>
        </ul>
      </div>
    </footer>
  )
}

export default Footer