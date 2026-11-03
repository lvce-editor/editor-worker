import type { EditorState } from '../State/State.ts'

export const isEqual = (oldState: EditorState, newState: EditorState): boolean => {
  return (
    oldState.rowHeight === newState.rowHeight &&
    oldState.textDecorations === newState.textDecorations &&
    oldState.deltaY === newState.deltaY &&
    oldState.finalDeltaY === newState.finalDeltaY &&
    oldState.height === newState.height &&
    oldState.gutterWidth === newState.gutterWidth &&
    oldState.scrollBarHeight === newState.scrollBarHeight
  )
}
