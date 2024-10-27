import * as ViewletEditorCompletionSelectIndex from '../EditorCompletionSelectIndex/EditorCompletionSelectIndex.ts'
import * as GetCompletionState from '../GetCompletionState/GetCompletionState.ts'

export const selectCurrent = (editor: any) => {
  const child = GetCompletionState.getCompletionState(editor)
  if (!child) {
    return editor
  }
  const { focusedIndex } = child
  return ViewletEditorCompletionSelectIndex.selectIndex(editor, focusedIndex)
}
