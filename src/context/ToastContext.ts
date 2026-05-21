import { createContext, useContext } from 'react'

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

export const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
