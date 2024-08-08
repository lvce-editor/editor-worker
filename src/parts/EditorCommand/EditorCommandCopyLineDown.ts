import * as Assert from '../Assert/Assert.ts'
import * as Editor from '../Editor/Editor.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
// TODO handle multiline selection
// TODO handle multiple cursors

export const copyLineDown = (editor: any) => {
  const { selections, primarySelectionIndex } = editor
  const rowIndex = selections[primarySelectionIndex]
  Assert.number(rowIndex)
  const position = {
    rowIndex,
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
