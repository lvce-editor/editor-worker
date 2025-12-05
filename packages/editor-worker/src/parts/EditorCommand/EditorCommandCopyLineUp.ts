import * as Editor from '../Editor/Editor.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

export const copyLineUp = (editor: any) => {
  const { selections } = editor
  const rowIndex = selections[0]
  const position = {
    columnIndex: 0,
    rowIndex: rowIndex,
  }
  const changes = [
    {
      deleted: [''],
      end: position,
      inserted: [TextDocument.getLine(editor, rowIndex), ''],
      start: position,
    },
  ]
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
