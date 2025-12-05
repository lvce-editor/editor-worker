// @ts-ignore
import * as Editor from '../Editor/Editor.ts'
// @ts-ignore
import * as TextDocument from '../TextDocument/TextDocument.ts'

// TODO handle multiple cursors
// @ts-ignore
export const moveLineUp = (editor) => {
  const { rowIndex } = editor.cursor
  if (rowIndex === 0) {
    return
  }
  const documentEdits = [
    {
      count: 2,
      newLines: [TextDocument.getLine(editor.textDocument, rowIndex), TextDocument.getLine(editor.textDocument, rowIndex - 1)],
      rowIndex: rowIndex - 1,
      type: /* splice */ 2,
    },
  ]
  // @ts-ignore
  const cursorEdits = Editor.moveCursors(editor, (editor, cursor) => {
    return {
      columnIndex: cursor.columnIndex,
      // TODO handle bottom 0
      rowIndex: cursor.rowIndex - 1,
    }
  })
  // @ts-ignore
  Editor.scheduleDocumentAndCursors(editor, documentEdits, cursorEdits)
}
