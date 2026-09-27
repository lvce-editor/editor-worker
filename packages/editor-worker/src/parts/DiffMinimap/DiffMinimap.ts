import type { EditorState } from '../State/State.ts'

export const isEqual = (oldState: EditorState, newState: EditorState): boolean => {
  if (!oldState.minimapEnabled && !newState.minimapEnabled) {
    return true
  }
  return (
    oldState.minimapEnabled === newState.minimapEnabled &&
    oldState.minimapLines === newState.minimapLines &&
    oldState.minimapRevision === newState.minimapRevision &&
    oldState.deltaY === newState.deltaY &&
    oldState.finalDeltaY === newState.finalDeltaY &&
    oldState.height === newState.height &&
    oldState.numberOfVisibleLines === newState.numberOfVisibleLines
  )
}
