import * as EditorCompletionState from '../EditorCompletionState/EditorCompletionState.ts'

const disposeWithEditor = (state: any, editor: any) => {
  editor.completionState = EditorCompletionState.None
  editor.completionUid = 0
  // Focus.removeAdditionalFocus(FocusKey.EditorCompletion)
  return state
}

export const handleEditorClick = disposeWithEditor

export const handleEditorBlur = disposeWithEditor

// @ts-ignore
const handleSelectionChange = (state, selectionChanges) => {}
