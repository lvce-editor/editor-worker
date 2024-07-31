import * as ViewletEditorCompletionSelectIndex from '../EditorCompletionSelectIndex/EditorCompletionSelectIndex.ts'

export const selectCurrent = (editorUid: number, state: any) => {
  const { focusedIndex } = state
  return ViewletEditorCompletionSelectIndex.selectIndex(editorUid, state, focusedIndex)
}
