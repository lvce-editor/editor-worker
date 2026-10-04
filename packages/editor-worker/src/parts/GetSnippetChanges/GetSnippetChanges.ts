import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

export const getSnippetChanges = (lines: readonly string[], selections: any, snippet: any) => {
  // TODO verify that deleted fits in the line
  const insertedLines = SplitLines.splitLines(snippet.inserted)
  const changes: any[] = []
  const selectionChanges: any[] = []
  for (let i = 0; i < selections.length; i += 4) {
    const [selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn] = GetSelectionPairs.getSelectionPairs(selections, i)
    if (insertedLines.length > 1) {
      let placeholderRow = -1
      let placeholderColumn = -1
      const insertedLinesWithoutPlaceholder = insertedLines.map((line, rowIndex) => {
        const index = line.indexOf('$0')
        if (index !== -1 && placeholderRow === -1) {
          placeholderRow = rowIndex
          placeholderColumn = index
        }
        return line.replace('$0', '')
      })
      const line = TextDocument.getLine({ lines }, selectionStartRow)
      const indent = TextDocument.getIndent(line)
      const insertedLinesHere = [insertedLinesWithoutPlaceholder[0], ...insertedLinesWithoutPlaceholder.slice(1).map((line) => indent + line)]
      const deleted = ['']
      changes.push({
        deleted,
        end: {
          columnIndex: selectionEndColumn,
          rowIndex: selectionEndRow,
        },
        inserted: insertedLinesHere,
        origin: EditOrigin.EditorSnippet,
        start: {
          columnIndex: selectionStartColumn - snippet.deleted,
          rowIndex: selectionStartRow,
        },
      })
      const lastInsertedLine = insertedLines.at(-1)
      if (placeholderRow === -1) {
        selectionChanges.push(
          selectionEndRow + insertedLines.length - deleted.length,
          // @ts-ignore
          selectionEndColumn + lastInsertedLine.length,
          selectionEndRow + insertedLines.length - deleted.length,
          // @ts-ignore
          selectionEndColumn + lastInsertedLine.length,
        )
      } else {
        const cursorRow = selectionStartRow + placeholderRow
        const cursorColumn = placeholderColumn + (placeholderRow === 0 ? selectionStartColumn - snippet.deleted : indent.length)
        selectionChanges.push(cursorRow, cursorColumn, cursorRow, cursorColumn)
      }
    } else {
      const line = insertedLines[0]
      const placeholderIndex = line.indexOf('$0')
      if (placeholderIndex === -1) {
        const cursorColumnIndex = selectionStartColumn - snippet.deleted
        // @ts-ignore
        selectionChanges.push(selectionStartRow, cursorColumnIndex, selectionStartRow, cursorColumnIndex)
        // @ts-ignore
        changes.push({
          deleted: [''],
          end: {
            columnIndex: selectionEndColumn,
            rowIndex: selectionEndRow,
          },
          inserted: insertedLines,
          origin: EditOrigin.EditorSnippet,
          start: {
            columnIndex: selectionStartColumn - snippet.deleted,
            rowIndex: selectionStartRow,
          },
        })
      } else {
        const inserted = line.replace('$0', '')
        const cursorColumnIndex = selectionStartColumn - snippet.deleted + placeholderIndex
        selectionChanges.push(selectionStartRow, cursorColumnIndex, selectionStartRow, cursorColumnIndex)
        changes.push({
          deleted: [''],
          end: {
            columnIndex: selectionEndColumn,
            rowIndex: selectionEndRow,
          },
          inserted: [inserted],
          origin: EditOrigin.EditorSnippet,
          start: {
            columnIndex: selectionStartColumn - snippet.deleted,
            rowIndex: selectionStartRow,
          },
        })
      }
    }
  }
  return {
    changes,
    selectionChanges: new Uint32Array(selectionChanges),
  }
}
