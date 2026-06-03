interface WidgetDisplayLayout {
  itemsToShow: number
  gridColumns: number
}

export function getWidgetDisplayLayout(span: number, maxItems = 3, compactItems = 1): WidgetDisplayLayout {
  if (span <= 4) {
    return { itemsToShow: Math.min(compactItems, maxItems), gridColumns: 1 }
  }

  if (span <= 8) {
    return { itemsToShow: Math.min(2, maxItems), gridColumns: Math.min(2, maxItems) }
  }

  return { itemsToShow: maxItems, gridColumns: maxItems }
}
