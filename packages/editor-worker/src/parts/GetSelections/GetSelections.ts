import * as GetEditor from '../GetEditor/GetEditor.ts'

export const getSelections = (editorUid: number) => {
  const editor = GetEditor.getEditor(editorUid)
  const { selections } = editor
  return selections
}
