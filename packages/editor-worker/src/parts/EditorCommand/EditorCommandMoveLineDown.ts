// @ts-ignore
import * as Editor from '../Editor/Editor.ts'
// @ts-ignore
import * as TextDocument from '../TextDocument/TextDocument.ts'

// TODO move cursor
// TODO multiple cursors -> vscode removes multiple cursors
// TODO with selection -> vscode moves whole selection
// @ts-ignore
export const moveLineDown = (editor) => {
  const { rowIndex } = editor.cursor
  if (rowIndex === editor.lines.length - 1) {
    return
  }
  const documentEdits = [
    {
      count: 2,
      newLines: [TextDocument.getLine(editor.textDocument, rowIndex + 1), TextDocument.getLine(editor.textDocument, rowIndex)],
      rowIndex: rowIndex,
      type: /* splice */ 2,
    },
  ]
  // @ts-ignore
  const cursorEdits = Editor.moveCursors(editor, (editor, cursor) => {
    return {
      columnIndex: cursor.columnIndex,
      rowIndex: cursor.rowIndex + 1,
    }
  })
  // @ts-ignore
  Editor.scheduleDocumentAndCursors(editor, documentEdits, cursorEdits)
}
