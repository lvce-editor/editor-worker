import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

const getSnippetLines = (inserted: string) => {
  return SplitLines.splitLines(inserted).map((line) => {
    const tabStops: { index: number; position: number }[] = []
    let text = ''
    for (let i = 0; i < line.length; i++) {
      if (line[i] === '$' && line[i + 1] >= '0' && line[i + 1] <= '9' && line[i - 1] !== '\\') {
        tabStops.push({
          index: Number(line[i + 1]),
          position: text.length,
        })
        i++
      } else {
        text += line[i]
      }
    }
    return { tabStops, text }
  })
}

export const getSnippetChanges = (lines: readonly string[], selections: any, snippet: any) => {
  // TODO verify that deleted fits in the line
  const parsedLines = getSnippetLines(snippet.inserted)
  const insertedLines = parsedLines.map((line) => line.text)
  const changes: any[] = []
  const selectionChanges: any[] = []
  const tabStops: { index: number; rowIndex: number; columnIndex: number }[] = []
  for (let i = 0; i < selections.length; i += 4) {
    const [selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn] = GetSelectionPairs.getSelectionPairs(selections, i)
    if (insertedLines.length > 1) {
      const insertedLinesWithoutPlaceholder = insertedLines
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
      const stops = parsedLines.flatMap((line, rowIndex) =>
        line.tabStops.map((stop) => ({
          ...stop,
          rowIndex,
        })),
      )
      const initialStop = stops.find((stop) => stop.index === 0) ?? stops.filter((stop) => stop.index > 0).sort((a, b) => a.index - b.index)[0]
      if (!initialStop) {
        selectionChanges.push(
          selectionEndRow + insertedLines.length - deleted.length,
          // @ts-ignore
          selectionEndColumn + lastInsertedLine.length,
          selectionEndRow + insertedLines.length - deleted.length,
          // @ts-ignore
          selectionEndColumn + lastInsertedLine.length,
        )
      } else {
        const cursorRow = selectionStartRow + initialStop.rowIndex
        const cursorColumn = initialStop.position + (initialStop.rowIndex === 0 ? selectionStartColumn - snippet.deleted : indent.length)
        selectionChanges.push(cursorRow, cursorColumn, cursorRow, cursorColumn)
      }
      for (const stop of stops) {
        const columnIndex = stop.position + (stop.rowIndex === 0 ? selectionStartColumn - snippet.deleted : indent.length)
        tabStops.push({ index: stop.index, rowIndex: selectionStartRow + stop.rowIndex, columnIndex })
      }
    } else {
      const line = insertedLines[0]
      const stops = parsedLines[0].tabStops
      const initialStop = stops.find((stop) => stop.index === 0) ?? stops.filter((stop) => stop.index > 0).sort((a, b) => a.index - b.index)[0]
      if (!initialStop) {
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
        const inserted = line
        const cursorColumnIndex = selectionStartColumn - snippet.deleted + initialStop.position
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
      for (const stop of stops) {
        tabStops.push({
          index: stop.index,
          rowIndex: selectionStartRow,
          columnIndex: selectionStartColumn - snippet.deleted + stop.position,
        })
      }
    }
  }
  return {
    changes,
    tabStops,
    selectionChanges: new Uint32Array(selectionChanges),
  }
}
