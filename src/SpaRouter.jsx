import React, { useEffect, useMemo, useState } from 'react'
import App from './App.jsx'
import ProductsPage from './pages/ProductsPage.jsx'
import CartPage from './pages/CartPage.jsx'
import ConfirmPage from './pages/ConfirmPage.jsx'
import CommentsPage from './pages/CommentsPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'

const routes = {
  '/': App,
  '/productos': ProductsPage,
  '/carrito': CartPage,
  '/confirmacion': ConfirmPage,
  '/comentarios': CommentsPage,
  '/registro': RegisterPage,
  '/administrador': AdminPage,
  '/producto': ProductDetailPage,
}

function normalize(hash) {
  const raw = (hash || '').replace(/^#/, '')
  if (!raw || raw === '/') return '/'
  // Mantener hashes de ancla (sin barra) para permitir scroll por id
  if (!raw.startsWith('/')) return raw
  return raw
}

export default function SpaRouter() {
  const [path, setPath] = useState(normalize(window.location.hash))

  useEffect(() => {
    const onHash = () => setPath(normalize(window.location.hash))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const Page = useMemo(() => routes[path] || App, [path])
  return <Page />
}