import * as ViewletEditorCompletionSelectIndex from '../../EditorCompletionSelectIndex/EditorCompletionSelectIndex.ts'

const isCompletion = (widget: any) => {
  return widget.id === 'completion'
}

export const selectCurrent = (editor: any) => {
  const { widgets } = editor
  const child = widgets.find(isCompletion)
  const { focusedIndex } = child
  return ViewletEditorCompletionSelectIndex.selectIndex(editor, focusedIndex)
}
