import * as Assert from '../Assert/Assert.ts'
import * as Editor from '../Editor/Editor.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
// TODO handle multiline selection

export const copyLineDown = (editor: any) => {
  const { selections } = editor
  const rows: number[] = []
  for (let i = 0; i < selections.length; i += 4) {
    const rowIndex = selections[i]
    Assert.number(rowIndex)
    rows.push(rowIndex)
  }
  const uniqueRows = [...new Set(rows)].toSorted((a, b) => a - b)
  const changes = uniqueRows.map((rowIndex) => {
    const position = {
      columnIndex: 0,
      rowIndex,
    }
    return {
      deleted: [''],
      end: position,
      inserted: [TextDocument.getLine(editor, rowIndex), ''],
      start: position,
    }
  })
  const selectionChanges = new Uint32Array(uniqueRows.length * 4)
  for (let i = 0; i < uniqueRows.length; i++) {
    const rowIndex = uniqueRows[i] + i + 1
    selectionChanges[i * 4] = rowIndex
    selectionChanges[i * 4 + 1] = 0
    selectionChanges[i * 4 + 2] = rowIndex
    selectionChanges[i * 4 + 3] = 0
  }
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes, selectionChanges)
}
