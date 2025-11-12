import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import CartPage from './pages/CartPage.jsx'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartPage />
  </StrictMode>
)