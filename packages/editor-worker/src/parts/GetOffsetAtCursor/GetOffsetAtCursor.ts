import * as TextDocument from '../TextDocument/TextDocument.ts'

export const getOffsetAtCursor = (editor: any): number => {
  const { selections } = editor
  const rowIndex = selections[0]
  const columnIndex = selections[1]
  const offset = TextDocument.offsetAt(editor, rowIndex, columnIndex)
  return offset
}
