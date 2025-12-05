import * as Assert from '../Assert/Assert.ts'
import * as Editor from '../Editor/Editor.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
// TODO handle multiline selection
// TODO handle multiple cursors

export const copyLineDown = (editor: any) => {
  const { selections } = editor
  const rowIndex = selections[0]
  Assert.number(rowIndex)
  const position = {
    columnIndex: 0,
    rowIndex,
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
