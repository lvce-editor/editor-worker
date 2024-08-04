import * as GetVisibleCompletionItem from '../GetVisibleCompletionItem/GetVisibleCompletionItem.js'

export const getVisibleItems = (
  filteredItems: any[],
  itemHeight: number,
  leadingWord: any,
  minLineY: number,
  maxLineY: number,
  focusedIndex: number,
) => {
  const visibleItems = []
  for (let i = minLineY; i < maxLineY; i++) {
    const filteredItem = filteredItems[i]
    visibleItems.push(GetVisibleCompletionItem.getVisibleIem(filteredItem, itemHeight, leadingWord, i, focusedIndex))
  }
  return visibleItems
}
