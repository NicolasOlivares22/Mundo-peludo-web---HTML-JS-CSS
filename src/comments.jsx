import React from 'react'
import { createRoot } from 'react-dom/client'
import CommentsPage from './pages/CommentsPage'
import './styles.css'

const root = createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <CommentsPage />
  </React.StrictMode>
)