import React, { useEffect, useMemo, useState } from 'react'
import { formatCLP } from '../utils/currency'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const CART_KEY = 'cart_items'
const LAST_ORDER_KEY = 'last_order'

function ConfirmPage() {
  const [order, setOrder] = useState(null)
  const cartCount = useMemo(() => {
    try {
      const raw = localStorage.getItem(CART_KEY)
      const items = raw ? JSON.parse(raw) : []
      return items.reduce((s, it) => s + it.qty, 0)
    } catch {
      return 0
    }
  }, [])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LAST_ORDER_KEY)
      setOrder(raw ? JSON.parse(raw) : null)
    } catch {
      setOrder(null)
    }
  }, [])

  return (
    <>
      <Navbar cartCount={cartCount} />
      <main className="container my-4">
        <h2 className="mb-3">Confirmación de pago</h2>

        {!order && (
          <div className="alert alert-info">No encontramos un pedido reciente. Vuelve a la tienda para realizar una compra.</div>
        )}

        {order && (
          <div className="card">
            <div className="card-header fw-bold">¡Gracias por tu compra!</div>
            <div className="card-body">
              <div className="mb-3">
                <h5 className="card-title">Datos del cliente</h5>
                <p className="mb-1"><span className="fw-semibold">Nombre:</span> {order.customerName}</p>
                <p className="mb-1"><span className="fw-semibold">Dirección:</span> {order.customerAddress}</p>
              </div>
              <div className="mb-3">
                <h5 className="card-title">Pago</h5>
                <p className="mb-1"><span className="fw-semibold">Método:</span> {order.paymentMethod === 'debito' ? 'Tarjeta de débito' : 'Tarjeta de crédito'}</p>
                <p className="mb-1"><span className="fw-semibold">Tarjeta:</span> **** **** **** {order.cardLast4}</p>
              </div>
              <div className="mb-3">
                <h5 className="card-title">Resumen del pedido</h5>
                <ul className="list-group list-group-flush mb-3">
                  {order.items.map((it) => (
                    <li className="list-group-item d-flex justify-content-between align-items-center" key={it.id}>
                      <span>{it.name} <small className="text-muted">x{it.qty}</small></span>
                      <span>{formatCLP(it.price * it.qty)}</span>
                    </li>
                  ))}
                </ul>
                <div className="d-flex justify-content-between">
                  <span className="fw-semibold">Total</span>
                  <span className="fw-bold">{formatCLP(order.total)}</span>
                </div>
              </div>
              <div className="small text-muted">Orden #{order.id} · {new Date(order.createdAt).toLocaleString()}</div>
            </div>
          </div>
        )}

        <div className="mt-3 d-flex gap-2">
          <a href="#/" className="btn btn-outline-primary">Ir al inicio</a>
          <a href="#/productos" className="btn btn-primary">Seguir comprando</a>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default ConfirmPage