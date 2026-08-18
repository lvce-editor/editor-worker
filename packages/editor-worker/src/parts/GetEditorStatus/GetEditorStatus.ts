import type { EditorStatus } from '../EditorStatus/EditorStatus.ts'
import type { EditorState } from '../State/State.ts'

export const getEditorStatus = (editor: EditorState): EditorStatus => {
  const primarySelectionIndex = editor.primarySelectionIndex || 0
  const rowIndex = editor.selections[primarySelectionIndex + 2] || 0
  const columnIndex = editor.selections[primarySelectionIndex + 3] || 0
  return {
    column: columnIndex + 1,
    encoding: 'utf8',
    languageId: editor.languageId,
    line: rowIndex + 1,
    tabSize: editor.tabSize,
  }
}
