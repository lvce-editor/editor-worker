import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

export const replaceRange = (editor: any, ranges: any, replacement: any, origin: any) => {
  const changes: any[] = []
  const columnDeltas = new Map<number, number>()
  const rangesLength = ranges.length
  for (let i = 0; i < rangesLength; i += 4) {
    const [selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn] = GetSelectionPairs.getSelectionPairs(ranges, i)
    const columnDelta = selectionStartRow === selectionEndRow ? (columnDeltas.get(selectionStartRow) ?? 0) : 0
    const start = {
      columnIndex: selectionStartColumn + columnDelta,
      rowIndex: selectionStartRow,
    }
    const end = {
      columnIndex: selectionEndColumn + columnDelta,
      rowIndex: selectionEndRow,
    }
    const selection = {
      end: {
        columnIndex: selectionEndColumn,
        rowIndex: selectionEndRow,
      },
      start: {
        columnIndex: selectionStartColumn,
        rowIndex: selectionStartRow,
      },
    }
    changes.push({
      deleted: TextDocument.getSelectionText(editor, selection),
      end: end,
      inserted: replacement,
      origin,
      start: start,
    })
    if (selectionStartRow === selectionEndRow) {
      if (replacement.length <= 1) {
        const insertedLength = replacement[0]?.length ?? 0
        columnDeltas.set(selectionStartRow, columnDelta + insertedLength - (selectionEndColumn - selectionStartColumn))
      } else {
        columnDeltas.set(selectionStartRow, replacement.at(-1).length - selectionEndColumn)
      }
    }
  }
  return changes
}
