import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

export const replaceRange = (editor: any, ranges: any, replacement: any, origin: any) => {
  const changes: any[] = []
  const rangesLength = ranges.length
  for (let i = 0; i < rangesLength; i += 4) {
    const [selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn] = GetSelectionPairs.getSelectionPairs(ranges, i)
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
    changes.push({
      deleted: TextDocument.getSelectionText(editor, selection),
      end: end,
      inserted: replacement,
      origin,
      start: start,
    })
  }
  return changes
}
