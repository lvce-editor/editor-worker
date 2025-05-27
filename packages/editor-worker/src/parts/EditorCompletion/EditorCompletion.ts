import * as EditorCompletionState from '../EditorCompletionState/EditorCompletionState.ts'
import * as FilterCompletionItems from '../FilterCompletionItems/FilterCompletionItems.ts'

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

export const advance = (state: any, word: string) => {
  const filteredItems = FilterCompletionItems.filterCompletionItems(state.items, word)
  return {
    ...state,
    filteredItems,
  }
}
