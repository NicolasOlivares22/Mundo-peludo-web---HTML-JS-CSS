import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SpaRouter from './SpaRouter.jsx'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SpaRouter />
  </StrictMode>,
)
