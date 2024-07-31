import * as ViewletEditorCompletionSelectIndex from '../EditorCompletionSelectIndex/EditorCompletionSelectIndex.ts'

export const selectCurrent = (state: any) => {
  const { focusedIndex } = state
  return ViewletEditorCompletionSelectIndex.selectIndex(state, focusedIndex)
}
