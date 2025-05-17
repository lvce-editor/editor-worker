import * as GetEditor from '../GetEditor/GetEditor.ts'
import * as GetPositionAtCursor from '../GetPositionAtCursor/GetPositionAtCursor.ts'
import * as GetWordAt from '../GetWordAt/GetWordAt.ts'

export const getPositionAtCursor = (editorUid: number): any => {
  const editor = GetEditor.getEditor(editorUid)
  return GetPositionAtCursor.getPositionAtCursor(editor)
}

export const getWordAt = (editorUid: number): any => {
  const editor = GetEditor.getEditor(editorUid)
  return GetWordAt.getWordAt(editor)
}
