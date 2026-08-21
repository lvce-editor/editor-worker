import * as Editor from '../Editor/Editor.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import { getIndentString } from '../GetIndentString/GetIndentString.ts'

const getChanges = (selections: any, indent: string) => {
  const rowsToIndent: any[] = []
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionEndRow = selections[i + 2]
    for (let i = selectionStartRow; i <= selectionEndRow; i++) {
      rowsToIndent.push(i)
    }
  }
  const changes: any[] = Array.from(rowsToIndent, (rowToIndent) => ({
    deleted: [''],
    end: {
      columnIndex: 0,
      rowIndex: rowToIndent,
    },
    inserted: [indent],
    origin: EditOrigin.IndentMore,
    start: {
      columnIndex: 0,
      rowIndex: rowToIndent,
    },
  }))
  return changes
}

export const indentMore = (editor: any) => {
  const { selections } = editor
  const changes = getChanges(selections, getIndentString(editor))
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
