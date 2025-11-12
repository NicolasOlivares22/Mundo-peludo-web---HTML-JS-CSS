import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AdminPage from './pages/AdminPage.jsx'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminPage />
  </StrictMode>
)