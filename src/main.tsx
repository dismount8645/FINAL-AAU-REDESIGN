import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'
import './global.css'
import StoreInit from '@/components/StoreInit'
import { ToastProvider } from '@/components/Toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreInit>
      <ToastProvider>
        <App />
      </ToastProvider>
    </StoreInit>
  </StrictMode>,
)
