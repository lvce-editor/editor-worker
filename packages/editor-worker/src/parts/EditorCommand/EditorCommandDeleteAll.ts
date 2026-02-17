import * as Editor from '../Editor/Editor.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

export const deleteAll = (editor: any) => {
  const { lines } = editor
  const endRowIndex = lines.length - 1
  const endColumnIndex = lines.at(-1).length
  const start = {
    columnIndex: 0,
    rowIndex: 0,
  }
  const end = {
    columnIndex: endColumnIndex,
    rowIndex: endRowIndex,
  }
  const changes = [
    {
      deleted: TextDocument.getSelectionText(editor, { end, start }),
      end,
      inserted: [''],
      origin: EditOrigin.Delete,
      start,
    },
  ]
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
