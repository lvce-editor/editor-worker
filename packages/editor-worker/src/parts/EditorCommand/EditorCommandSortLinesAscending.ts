import * as Compare from '../Compare/Compare.ts'
import * as Editor from '../Editor/Editor.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

// @ts-ignore
const getSortedLines = (lines) => {
  const newLines = [...lines]
  newLines.sort(Compare.compareString)
  return newLines
}

const origin = 'sort-lines-ascending'

// @ts-ignore
const getSortLinesAscendingChanges = (lines, selections) => {
  const startRowIndex = selections[0]
  // @ts-ignore
  const startColumnIndex = selections[1]
  const endRowIndex = selections[2]
  // @ts-ignore
  const endColumnIndex = selections[3]
  // @ts-ignore
  const startRow = lines[startRowIndex]
  // @ts-ignore
  const endRow = lines[endRowIndex]
  const changes: any[] = []
  for (let i = 0; i < selections.length; i += 4) {
    const selectionStartRow = selections[i]
    const selectionStartColumn = selections[i + 1]
    const selectionEndRow = selections[i + 2]
    const selectionEndColumn = selections[i + 3]
    const start = {
      columnIndex: selectionStartColumn,
      rowIndex: selectionStartRow,
    }
    const end = {
      columnIndex: selectionEndColumn,
      rowIndex: selectionEndRow,
    }
    const selection = {
      end,
      start,
    }
    const selectionLines = lines.slice(startRowIndex, endRowIndex + 1)
    const sortedSelectionLines = getSortedLines(selectionLines)
    changes.push({
      deleted: TextDocument.getSelectionText({ lines }, selection),
      end: end,
      inserted: sortedSelectionLines,
      origin,
      start: start,
    })
  }
  return changes
}

// @ts-ignore
export const sortLinesAscending = (editor) => {
  const { lines, selections } = editor
  const changes = getSortLinesAscendingChanges(lines, selections)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
