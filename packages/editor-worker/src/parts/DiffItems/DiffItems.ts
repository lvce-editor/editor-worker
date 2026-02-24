import type { EditorState } from '../State/State.ts'

export const isEqual = (oldState: EditorState, newState: EditorState): boolean => {
  return (
    oldState.lines === newState.lines &&
    oldState.textInfos === newState.textInfos &&
    oldState.differences === newState.differences &&
    oldState.initial === newState.initial
  )
}
