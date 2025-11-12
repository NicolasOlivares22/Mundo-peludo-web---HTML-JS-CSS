import React from 'react'

function Carousel() {
  return (
    <div className="container my-4">
      <div id="homeCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#homeCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#homeCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#homeCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
        <div className="carousel-inner rounded">
          <div className="carousel-item active" data-bs-interval="5000">
            <img
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1600&auto=format&fit=crop"
              className="d-block w-100"
              alt="Perro feliz en el parque"
              style={{ maxHeight: '420px', objectFit: 'cover' }}
            />
            <div className="carousel-caption d-none d-md-block">
              <h5>Perros</h5>
              <p>Alimentos y accesorios para tu mejor amigo.</p>
            </div>
          </div>
          <div className="carousel-item" data-bs-interval="5000">
            <img
              src="https://placekitten.com/1600/900"
              className="d-block w-100"
              alt="Gato descansando cómodamente"
              style={{ maxHeight: '420px', objectFit: 'cover' }}
              onError={(e) => { e.currentTarget.src = 'https://picsum.photos/seed/cat/1600/900' }}
            />
            <div className="carousel-caption d-none d-md-block">
              <h5>Gatos</h5>
              <p>Arena, rascadores y juguetes para tu felino.</p>
            </div>
          </div>
          <div className="carousel-item" data-bs-interval="5000">
            <img
              src="https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?q=80&w=1600&auto=format&fit=crop"
              className="d-block w-100"
              alt="Perro y gato juntos"
              style={{ maxHeight: '420px', objectFit: 'cover' }}
            />
            <div className="carousel-caption d-none d-md-block">
              <h5>Complicidad</h5>
              <p>Todo para mantener felices a tus mascotas.</p>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>
    </div>
  )
}

export default Carousel