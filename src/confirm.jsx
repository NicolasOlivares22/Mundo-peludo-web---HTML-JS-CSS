import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import ConfirmPage from './pages/ConfirmPage'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ConfirmPage />
  </React.StrictMode>
)