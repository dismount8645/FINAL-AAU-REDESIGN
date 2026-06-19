export interface WidgetItem {
  id: string
  span: number
  size?: 'small' | 'medium' | 'large'
}

const SIZE_TO_SPAN: Record<'small' | 'medium' | 'large', number> = {
  small: 4,
  medium: 8,
  large: 12,
}

export function useWidgetGrid(widgets: WidgetItem[], onLayoutChange?: (widgets: WidgetItem[]) => void) {
  const handleSizeChange = (id: string, newSize: 'small' | 'medium' | 'large') => {
    if (!onLayoutChange) return
    const updated = widgets.map((w) => {
      if (w.id === id) {
        return {
          ...w,
          size: newSize,
          span: SIZE_TO_SPAN[newSize],
        }
      }
      return w
    })
    onLayoutChange(updated)
  }

  const handleMoveUp = (index: number) => {
    if (!onLayoutChange || index === 0) return
    const updated = [...widgets]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    onLayoutChange(updated)
  }

  const handleMoveDown = (index: number) => {
    if (!onLayoutChange || index === widgets.length - 1) return
    const updated = [...widgets]
    ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    onLayoutChange(updated)
  }

  return { handleSizeChange, handleMoveUp, handleMoveDown }
}
