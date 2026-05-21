import { createContext, useContext } from 'react'

export interface ActiveModal {
  id: string;
  data: Record<string, unknown>;
}

export interface ModalContextType {
  openModal: (id: string, data?: Record<string, unknown>) => void;
  closeModal: (id: string) => void;
  closeAll: () => void;
  isOpen: (id: string) => boolean;
  getModalData: (id: string) => Record<string, unknown>;
  activeModals: ActiveModal[];
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function useModal() {
  const context = useContext(ModalContext)
  if (!context) throw new Error('useModal must be used within ModalProvider')
  return context
}
