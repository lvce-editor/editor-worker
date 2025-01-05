import * as Editor from '../Editor/Editor.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

export const copyLineUp = (editor: any) => {
  const { selections } = editor
  const rowIndex = selections[0]
  const position = {
    rowIndex: rowIndex,
    columnIndex: 0,
  }
  const changes = [
    {
      start: position,
      end: position,
      inserted: [TextDocument.getLine(editor, rowIndex), ''],
      deleted: [''],
    },
  ]
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
