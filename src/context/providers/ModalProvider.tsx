import { useState, useCallback, type ReactNode } from 'react'
import { ModalContext, type ActiveModal } from '@/context/ModalContext'

interface ModalProviderProps {
  children: ReactNode;
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [modals, setModals] = useState<ActiveModal[]>([])

  const openModal = useCallback((id: string, data: Record<string, unknown> = {}) => {
    setModals((prev) => [...prev.filter((m) => m.id !== id), { id, data }])
  }, [])

  const closeModal = useCallback((id: string) => {
    setModals((prev) => prev.filter((m) => m.id !== id))
  }, [])

  const closeAll = useCallback(() => {
    setModals([])
  }, [])

  const isOpen = useCallback((id: string) => {
    return modals.some((m) => m.id === id)
  }, [modals])

  const getModalData = useCallback((id: string) => {
    return modals.find((m) => m.id === id)?.data || {}
  }, [modals])

  return (
    <ModalContext.Provider value={{ openModal, closeModal, closeAll, isOpen, getModalData, activeModals: modals }}>
      {children}
    </ModalContext.Provider>
  )
}
