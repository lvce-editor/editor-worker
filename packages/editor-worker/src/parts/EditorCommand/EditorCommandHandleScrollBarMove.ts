import type { EditorState } from '../State/State.ts'
import * as Editor from '../Editor/Editor.ts'

const getNewPercent = (state: EditorState, relativeY: number): number => {
  const { height, scrollBarHeight } = state
  // if (relativeY <= editor.scrollBarHeight / 2) {
  //   // clicked at top
  //   return 0
  // }
  if (relativeY <= height - scrollBarHeight / 2) {
    // clicked in middle
    return relativeY / (height - scrollBarHeight)
  }
  // clicked at bottom
  return 1
}

export const handleScrollBarMove = async (state: EditorState, eventY: number): Promise<EditorState> => {
  const { finalDeltaY, handleOffset = 0, y } = state
  const relativeY = eventY - y - handleOffset
  const newPercent = getNewPercent(state, relativeY)
  const newDeltaY = newPercent * finalDeltaY
  const newState = await Editor.setDeltaYFixedValue(state, newDeltaY)
  return newState
}

export const handleScrollBarVerticalPointerMove = handleScrollBarMove
