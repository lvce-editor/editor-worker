import * as EditorCommandGetWordAt from '../EditorCommand/EditorCommandGetWordAt.ts'
import * as GetEditor from '../GetEditor/GetEditor.ts'
import * as GetPositionAtCursor from '../GetPositionAtCursor/GetPositionAtCursor.ts'

export const getPositionAtCursor = (editorUid: number): any => {
  const editor = GetEditor.getEditor(editorUid)
  return GetPositionAtCursor.getPositionAtCursor(editor)
}

export const getWordAt = (editorUid: number, rowIndex: number, columnIndex: number): any => {
  const editor = GetEditor.getEditor(editorUid)
  return EditorCommandGetWordAt.getWordAt(editor, rowIndex, columnIndex)
}
