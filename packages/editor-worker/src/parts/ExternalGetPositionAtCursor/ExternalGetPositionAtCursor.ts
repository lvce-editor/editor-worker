import * as GetEditor from '../GetEditor/GetEditor.ts'
import * as GetPositionAtCursor from '../GetPositionAtCursor/GetPositionAtCursor.ts'

export const getPositionAtCursor = (editorUid: number): any => {
  const editor = GetEditor.getEditor(editorUid)
  return GetPositionAtCursor.getPositionAtCursor(editor)
}
