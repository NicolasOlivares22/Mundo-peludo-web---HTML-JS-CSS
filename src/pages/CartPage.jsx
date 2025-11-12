import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Cart from '../components/Cart'
import Footer from '../components/Footer'

const CART_KEY = 'cart_items'

const getCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

const setCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

function CartPage() {
  const [items, setItems] = useState([])
  const [count, setCount] = useState(0)

  useEffect(() => {
    const init = getCart()
    setItems(init)
    setCount(init.reduce((s, it) => s + it.qty, 0))

    const onStorage = (e) => {
      if (e.key === CART_KEY) {
        const updated = getCart()
        setItems(updated)
        setCount(updated.reduce((s, it) => s + it.qty, 0))
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const handleRemove = (id) => {
    const next = items.filter((it) => it.id !== id)
    setItems(next)
    setCart(next)
    setCount(next.reduce((s, it) => s + it.qty, 0))
  }

  const handleClear = () => {
    setItems([])
    setCart([])
    setCount(0)
  }

  return (
    <>
      <Navbar cartCount={count} />
      <main className="container my-4">
        <h2 className="mb-3">Tu carrito</h2>
        <Cart items={items} onRemove={handleRemove} onClear={handleClear} />
        <div className="mt-3">
          <a href="#/productos" className="btn btn-outline-primary">Seguir comprando</a>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default CartPage