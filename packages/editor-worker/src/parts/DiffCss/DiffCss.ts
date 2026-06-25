import type { EditorState } from '../State/State.ts'

export const isEqual = (oldState: EditorState, newState: EditorState): boolean => {
  return (
    oldState.rowHeight === newState.rowHeight &&
    oldState.deltaY === newState.deltaY &&
    oldState.finalDeltaY === newState.finalDeltaY &&
    oldState.height === newState.height &&
    oldState.deltaX === newState.deltaX &&
    oldState.longestLineWidth === newState.longestLineWidth &&
    oldState.minimumSliderSize === newState.minimumSliderSize &&
    oldState.width === newState.width &&
    oldState.scrollBarHeight === newState.scrollBarHeight
  )
}
