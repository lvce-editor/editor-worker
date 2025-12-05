import * as Editor from '../Editor/Editor.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'

// @ts-ignore
const getChanges = (selections) => {
  const changes: any[] = []
  const rowsToIndentLess: number[] = []
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionEndRow = selections[i + 2]
    for (let i = selectionStartRow; i <= selectionEndRow; i++) {
      rowsToIndentLess.push(i)
    }
  }
  for (const rowToIndent of rowsToIndentLess) {
    changes.push({
      deleted: ['  '],
      end: {
        columnIndex: 2,
        rowIndex: rowToIndent,
      },
      inserted: [''],
      origin: EditOrigin.IndentLess,
      start: {
        columnIndex: 0,
        rowIndex: rowToIndent,
      },
    })
  }
  return changes
}

// @ts-ignore
export const indentLess = (editor) => {
  const { selections } = editor
  const changes = getChanges(selections)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
