import React from 'react'

function Hero() {
  return (
    <section className="hero border-bottom">
      <div className="container d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div className="col-12 col-md-6">
          <div className="d-flex align-items-center gap-3 mb-2">
            <h1 className="display-5 fw-bold mb-0">Todo para tu mascota</h1>
          </div>
          <p className="lead">Alimentos, juguetes y accesorios para perros, gatos, aves y más.</p>
          <a href="#/productos" className="btn btn-primary">Ver productos</a>
        </div>
        <div className="col-12 col-md-5 text-center">
          <img src="/img/mundo-peludo-logo.png" alt="Logo Mundo Peludo" className="hero-logo hero-logo-right" />
        </div>
      </div>
    </section>
  )
}

export default Hero