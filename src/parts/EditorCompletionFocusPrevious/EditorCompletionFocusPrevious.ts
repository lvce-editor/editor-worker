import * as EditorCompletionFocusIndex from '../EditorCompletionFocusIndex/EditorCompletionFocusIndex.ts'
import * as GetCompletionState from '../GetCompletionState/GetCompletionState.ts'

export const focusPrevious = (editor: any) => {
  const child = GetCompletionState.getCompletionState(editor)
  const previousIndex = child.focusedIndex - 1
  return EditorCompletionFocusIndex.focusIndex(editor, previousIndex)
}
