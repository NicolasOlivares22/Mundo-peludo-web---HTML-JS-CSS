import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import RegisterPage from './pages/RegisterPage'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RegisterPage />
  </React.StrictMode>
)