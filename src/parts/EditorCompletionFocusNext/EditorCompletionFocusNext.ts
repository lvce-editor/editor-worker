import * as EditorCompletionFocusIndex from '../EditorCompletionFocusIndex/EditorCompletionFocusIndex.ts'
import * as GetCompletionState from '../GetCompletionState/GetCompletionState.ts'

export const focusNext = (editor: any) => {
  const child = GetCompletionState.getCompletionState(editor)
  const nextIndex = child.focusedIndex + 1
  return EditorCompletionFocusIndex.focusIndex(editor, nextIndex)
}
