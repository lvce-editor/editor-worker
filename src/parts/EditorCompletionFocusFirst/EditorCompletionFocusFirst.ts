import * as EditorCompletionFocusIndex from '../EditorCompletionFocusIndex/EditorCompletionFocusIndex.ts'

export const focusFirst = (editor: any) => {
  const firstIndex = 0
  return EditorCompletionFocusIndex.focusIndex(editor, firstIndex)
}
