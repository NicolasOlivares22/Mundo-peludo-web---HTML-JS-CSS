import React, { useState } from 'react'
import { formatCLP } from '../utils/currency'

function Cart({ items, onRemove, onClear }) {
  const [customerName, setCustomerName] = useState('')
  const [customerAddress, setCustomerAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [payError, setPayError] = useState('')
  const [paySuccess, setPaySuccess] = useState('')

  const total = items.reduce((sum, it) => sum + it.price * it.qty, 0)

  const handleCheckout = (e) => {
    e.preventDefault()
    setPayError('')
    setPaySuccess('')

    const name = customerName.trim()
    const addr = customerAddress.trim()
    const method = paymentMethod.trim()
    if (!name || !addr || !method) {
      setPayError('Por favor complete nombre, dirección y método de pago.')
      return
    }
    if (!cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim() || !cardHolder.trim()) {
      setPayError('Complete datos de la tarjeta: número, fecha de caducidad, N° de seguridad y nombre del representante.')
      return
    }

    // Construir y guardar la orden en localStorage
    try {
      const digits = cardNumber.replace(/\D/g, '')
      const order = {
        id: Date.now(),
        customerName: name,
        customerAddress: addr,
        paymentMethod: method,
        cardLast4: digits.slice(-4),
        total,
        items: items.map((it) => ({ id: it.id, name: it.name, price: it.price, qty: it.qty })),
        createdAt: new Date().toISOString(),
      }
      localStorage.setItem('last_order', JSON.stringify(order))
      const raw = localStorage.getItem('orders')
      const list = raw ? JSON.parse(raw) : []
      list.push(order)
      localStorage.setItem('orders', JSON.stringify(list))
    } catch {}

    // Limpiar carrito tras pagar y redirigir a confirmación
    try { onClear?.() } catch {}
    setPaySuccess('Pago confirmado. ¡Gracias por su compra!')
    setTimeout(() => { window.location.hash = '#/confirmacion' }, 200)
  }

  return (
    <section className="position-relative">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span className="fw-bold">Carrito</span>
          <button className="btn btn-sm btn-outline-danger" onClick={onClear} disabled={!items.length}>Vaciar</button>
        </div>
        <ul className="list-group list-group-flush">
          {items.length === 0 && (
            <li className="list-group-item text-muted">Tu carrito está vacío.</li>
          )}
          {items.map((it) => (
            <li key={it.id} className="list-group-item d-flex align-items-center justify-content-between">
              <div>
                <div className="fw-semibold">{it.name}</div>
                <small className="text-muted">x{it.qty} · {formatCLP(it.price)}</small>
              </div>
              <button className="btn btn-sm btn-outline-secondary" onClick={() => onRemove(it.id)}>Quitar</button>
            </li>
          ))}
        </ul>
        <div className="card-footer d-flex justify-content-between align-items-center">
          <span className="fw-bold">Total: {formatCLP(total)}</span>
          <button className="btn btn-success" disabled={!items.length} data-bs-toggle="modal" data-bs-target="#paymentModal">Pagar</button>
        </div>
      </div>

      {/* Modal de pago */}
      <div className="modal fade" id="paymentModal" tabIndex="-1" aria-labelledby="paymentModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="paymentModalLabel">Datos de pago</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleCheckout}>
              <div className="modal-body">
                <p className="text-muted">Complete los datos para finalizar la compra.</p>
                <div className="mb-3">
                  <label className="form-label" htmlFor="customerName">Nombre del cliente</label>
                  <input id="customerName" type="text" className="form-control" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="customerAddress">Dirección</label>
                  <input id="customerAddress" type="text" className="form-control" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} required />
                </div>
              <div className="mb-3">
                <label className="form-label d-block">Método de pago</label>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="metodoPago" id="debito" value="debito" checked={paymentMethod === 'debito'} onChange={(e) => setPaymentMethod(e.target.value)} required />
                  <label className="form-check-label" htmlFor="debito">Tarjeta de débito</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="metodoPago" id="credito" value="credito" checked={paymentMethod === 'credito'} onChange={(e) => setPaymentMethod(e.target.value)} />
                  <label className="form-check-label" htmlFor="credito">Tarjeta de crédito</label>
                </div>
              </div>

                {paymentMethod && (
                  <div className="border rounded p-3 mb-3">
                    <h6 className="mb-3">Datos de la tarjeta</h6>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="cardNumber">N° de tarjeta</label>
                      <input id="cardNumber" type="text" inputMode="numeric" pattern="[0-9]{13,19}" maxLength="19" className="form-control" placeholder="Solo números" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />
                      <div className="form-text">Entre 13 y 19 dígitos.</div>
                    </div>
                    <div className="row g-3">
                      <div className="col-12 col-md-6">
                        <label className="form-label" htmlFor="cardExpiry">Fecha de caducidad</label>
                        <input id="cardExpiry" type="text" className="form-control" placeholder="MM/AA" pattern="(0[1-9]|1[0-2])\/\d{2}" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} required />
                        <div className="form-text">Formato MM/AA</div>
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label" htmlFor="cardCvv">N° de seguridad (CVV)</label>
                        <input id="cardCvv" type="text" inputMode="numeric" pattern="[0-9]{3,4}" maxLength="4" className="form-control" placeholder="3 o 4 dígitos" value={cardCvv} onChange={(e) => setCardCvv(e.target.value)} required />
                      </div>
                    </div>
                    <div className="mt-3">
                      <label className="form-label" htmlFor="cardHolder">Nombre del representante de la tarjeta</label>
                      <input id="cardHolder" type="text" className="form-control" value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} required />
                    </div>
                  </div>
                )}

                {payError && <div className="alert alert-danger py-2">{payError}</div>}
                {paySuccess && <div className="alert alert-success py-2">{paySuccess}</div>}

                <div className="small text-muted">Total a pagar: {formatCLP(total)}</div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="submit" className="btn btn-success">Confirmar pago</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Cart