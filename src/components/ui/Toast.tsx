import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { Text } from '@/components/ui'
import Button from '@/components/ui/Button'
import { Stack } from '@/components/Layout'

export interface Toast {
  id: number;
  message: string;
  variant: 'success' | 'error' | 'info';
}

export interface ToastOptions {
  variant?: 'success' | 'error' | 'info';
  duration?: number;
}

export interface ToastContextType {
  addToast: (message: string, options?: ToastOptions) => number;
  removeToast: (id: number) => void;
  success: (message: string, options?: ToastOptions) => number;
  error: (message: string, options?: ToastOptions) => number;
  info: (message: string, options?: ToastOptions) => number;
  toasts: Toast[];
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}

let toastId = 0

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, options: ToastOptions = {}) => {
    const id = ++toastId
    const { variant = 'success', duration = 4000 } = options
    setToasts((prev) => [...prev, { id, message, variant }])
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
    return id
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const success = useCallback((message: string, options?: ToastOptions) => addToast(message, { ...options, variant: 'success' }), [addToast])
  const error = useCallback((message: string, options?: ToastOptions) => addToast(message, { ...options, variant: 'error' }), [addToast])
  const info = useCallback((message: string, options?: ToastOptions) => addToast(message, { ...options, variant: 'info' }), [addToast])

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info, toasts }}>
      {children}
      <Stack gap="xs" className="fixed bottom-md right-md md:bottom-lg md:right-lg left-md md:left-auto z-[var(--z-toast,6000)] w-[calc(100%-var(--space-md)*2)] md:w-auto">
        {toasts.map((toast) => {
          const bgMap = { success: 'var(--color-success)', error: 'var(--color-danger)', info: 'var(--color-primary)' }
          return (
            <Stack
              key={toast.id}
              direction="row"
              align="center"
              gap="sm"
              className="text-sm font-semibold text-white px-md py-sm rounded-[var(--radius-md)] shadow-[var(--shadow-md)] min-w-[280px] max-w-[420px] animate-slide-in"
              style={{
                background: bgMap[toast.variant] || 'var(--color-primary)',
              }}
            >
              <Text className="flex-1">{toast.message}</Text>
              <Button variant="ghost" icon={X} onClick={() => removeToast(toast.id)} aria-label="Close" />
            </Stack>
          )
        })}
      </Stack>
    </ToastContext.Provider>
  )
}
