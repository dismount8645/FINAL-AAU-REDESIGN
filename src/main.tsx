import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'
import './global.css'
import { ToastProvider } from '@/components/ui'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>,
)
