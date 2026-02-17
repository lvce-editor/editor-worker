import * as Assert from '../Assert/Assert.ts'
import * as Editor from '../Editor/Editor.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

export const setText = (editor: any, text: string) => {
  Assert.string(text)
  const endRowIndex = editor.lines.length - 1
  const endColumnIndex = editor.lines.at(-1).length
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
      inserted: SplitLines.splitLines(text),
      origin: EditOrigin.EditorType,
      start,
    },
  ]
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
