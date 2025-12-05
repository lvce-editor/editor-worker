import * as EditorPosition from '../EditorCommand/EditorCommandPosition.ts'

export const getPositionAtCursor = (editor: any) => {
  const { selections } = editor
  const rowIndex = selections[0]
  const columnIndex = selections[1]
  const x = EditorPosition.x(editor, rowIndex, columnIndex)
  const y = EditorPosition.y(editor, rowIndex)
  return {
    columnIndex,
    rowIndex,
    x,
    y,
  }
}
