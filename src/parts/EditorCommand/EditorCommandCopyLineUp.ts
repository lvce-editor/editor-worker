import * as TextDocument from '../TextDocument/TextDocument.ts'
import * as Editor from '../Editor/Editor.ts'

export const copyLineUp = (editor: any) => {
  const { selections, primarySelectionIndex } = editor
  const rowIndex = selections[primarySelectionIndex]
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
