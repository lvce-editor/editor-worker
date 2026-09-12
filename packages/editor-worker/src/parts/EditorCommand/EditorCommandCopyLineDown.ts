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
  const rowOffsets = new Map(uniqueRows.map((row, index) => [row, index + 1]))
  const selectionChanges = new Uint32Array(selections.length)
  for (let i = 0; i < selections.length; i += 4) {
    const rowIndex = selections[i] + rowOffsets.get(selections[i])!
    const columnIndex = selections[i + 1]
    selectionChanges[i] = rowIndex
    selectionChanges[i + 1] = columnIndex
    selectionChanges[i + 2] = rowIndex
    selectionChanges[i + 3] = columnIndex
  }
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes, selectionChanges)
}
