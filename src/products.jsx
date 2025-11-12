import React from 'react'
import { createRoot } from 'react-dom/client'
import ProductsPage from './pages/ProductsPage'
import './styles.css'

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <ProductsPage />
  </React.StrictMode>
)