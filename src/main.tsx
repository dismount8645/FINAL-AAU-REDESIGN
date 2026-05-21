import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/App'
import './styles/global.css'
import StoreInit from '@/components/StoreInit'
import { ToastProvider } from '@/context/providers/ToastProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreInit>
      <ToastProvider>
        <App />
      </ToastProvider>
    </StoreInit>
  </StrictMode>,
)
