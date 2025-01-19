import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RutinasComponent from './RutinasComponent.jsx'
import CrearRutinaForm from './CrearRutinaForm.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CrearRutinaForm/>
    <RutinasComponent/>
  </StrictMode>,
)
