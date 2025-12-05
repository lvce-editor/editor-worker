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
      const line = TextDocument.getLine({ lines }, selectionStartRow)
      const indent = TextDocument.getIndent(line)
      const insertedLinesHere = [insertedLines[0], ...insertedLines.slice(1).map((line) => indent + line)]
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
      selectionChanges.push(
        selectionEndRow + insertedLines.length - deleted.length,
        // @ts-ignore
        selectionEndColumn + lastInsertedLine.length,
        selectionEndRow + insertedLines.length - deleted.length,
        // @ts-ignore
        selectionEndColumn + lastInsertedLine.length,
      )
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
        const cursorColumnIndex = selectionEndColumn + 2
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
