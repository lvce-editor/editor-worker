import * as Editor from '../Editor/Editor.ts'
import * as ScrollBarFunctions from '../ScrollBarFunctions/ScrollBarFunctions.ts'

// TODO scrollbar position can be in interval [0, editor.height - editor.scrollBarHeight]
// when clicked at y <= editor.scrollbarHeight/2, position is set to zero
// when clicked at y >= editor.height - editor.scrollBarHeight/2, position is set to (editor.height - scrollBarHeight/2)
// when clicked at y > editor.height - editor.scrollBarHeight/2, position scrollbar at (y - scrollbarHeight/2)
// additionally, when clicked on scrollbar, scrollbar position shouldn't move

export const handleScrollBarPointerDown = (state: any, eventY: number): any => {
  const { deltaY, finalDeltaY, height, scrollBarHeight, y } = state
  const relativeY = eventY - y
  const currentScrollBarY = ScrollBarFunctions.getScrollBarY(deltaY, finalDeltaY, height, scrollBarHeight)
  const diff = relativeY - currentScrollBarY
  if (diff >= 0 && diff < scrollBarHeight) {
    return {
      ...state,
      handleOffset: diff,
    }
  }
  const { handleOffset, percent } = ScrollBarFunctions.getNewDeltaPercent(height, scrollBarHeight, relativeY)
  const newDeltaY = percent * finalDeltaY
  return {
    ...Editor.setDeltaYFixedValue(state, newDeltaY),
    handleOffset,
  }
}
