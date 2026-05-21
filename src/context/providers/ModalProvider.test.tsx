import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ModalProvider } from '@/context/providers/ModalProvider'
import { useModal } from '@/context/ModalContext'

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ModalProvider>{children}</ModalProvider>
)

describe('ModalProvider', () => {
  it('manages modals correctly', () => {
    const { result } = renderHook(() => useModal(), { wrapper })
    
    expect(result.current.isOpen('test')).toBe(false)
    
    act(() => {
      result.current.openModal('test', { foo: 'bar' })
    })
    expect(result.current.isOpen('test')).toBe(true)
    expect(result.current.getModalData('test')).toEqual({ foo: 'bar' })
    expect(result.current.activeModals.length).toBe(1)
    
    act(() => {
      result.current.closeModal('test')
    })
    expect(result.current.isOpen('test')).toBe(false)
    expect(result.current.activeModals.length).toBe(0)
  })

  it('handles multiple modals and closeAll', () => {
    const { result } = renderHook(() => useModal(), { wrapper })
    
    act(() => {
      result.current.openModal('m1')
      result.current.openModal('m2')
    })
    expect(result.current.activeModals.length).toBe(2)
    
    act(() => {
      result.current.closeAll()
    })
    expect(result.current.activeModals.length).toBe(0)
  })

  it('updates modal data if same id opened again', () => {
    const { result } = renderHook(() => useModal(), { wrapper })
    
    act(() => {
      result.current.openModal('m1', { v: 1 })
    })
    expect(result.current.getModalData('m1').v).toBe(1)
    
    act(() => {
      result.current.openModal('m1', { v: 2 })
    })
    expect(result.current.getModalData('m1').v).toBe(2)
    expect(result.current.activeModals.length).toBe(1)
  })

  it('returns empty object for non-existent modal data', () => {
    const { result } = renderHook(() => useModal(), { wrapper })
    expect(result.current.getModalData('none')).toEqual({})
  })

  it('throws error when used outside of ModalProvider', () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useModal())).toThrow('useModal must be used within ModalProvider')
    spy.mockRestore()
  })
})
