// @ts-ignore
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.ts'

// TODO duplicate code with vertical pointer down event listener

// @ts-ignore
export const handleScrollBarHorizontalPointerDown = (state, eventX) => {
  // @ts-ignore
  const { deltaX, finalDeltaY, height, longestLineWidth, scrollBarHeight, width, x } = state
  const relativeX = eventX - x
  const scrollBarWidth = ScrollBarFunctions.getScrollBarWidth(width, longestLineWidth)
  const finalDeltaX = width - scrollBarWidth
  const currentScrollBarX = ScrollBarFunctions.getScrollBarOffset(deltaX, finalDeltaX, width, scrollBarWidth)
  const diff = relativeX - currentScrollBarX
  if (diff >= 0 && diff < scrollBarWidth) {
    return {
      ...state,
      handleOffsetX: diff,
    }
  }
  const { handleOffset, percent } = ScrollBarFunctions.getNewDeltaPercent(width, scrollBarWidth, relativeX)
  const newDeltaX = percent * finalDeltaX
  return {
    ...state,
    deltaX: newDeltaX,
    handleOffsetX: handleOffset,
  }
}
