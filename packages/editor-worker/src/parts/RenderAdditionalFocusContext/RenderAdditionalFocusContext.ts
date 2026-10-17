import type { EditorState } from '../State/State.ts'

export const renderAdditionalFocusContext = (oldState: EditorState, newState: EditorState): readonly any[] => {
  if (newState.additionalFocus) {
    return ['Viewlet.setAdditionalFocus', newState.uid, newState.additionalFocus]
  }
  return ['Viewlet.unsetAdditionalFocus', newState.uid, oldState.additionalFocus]
}
