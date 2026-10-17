import * as Clipboard from '../ClipBoard/ClipBoard.ts'
import * as Editor from '../Editor/Editor.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.ts'
import * as JoinLines from '../JoinLines/JoinLines.ts'
import * as EditorCommandReplaceRange from './EditorCommandReplaceRange.ts'

export const cutLine = async (editor: any) => {
  const { lines, selections } = editor
  const seenRows = new Set<number>()
  const rows: number[] = []
  for (let i = 0; i < selections.length; i += 4) {
    const [startRowIndex] = GetSelectionPairs.getSelectionPairs(selections, i)
    if (!seenRows.has(startRowIndex)) {
      seenRows.add(startRowIndex)
      rows.push(startRowIndex)
    }
  }
  rows.sort((a, b) => a - b)
  const ranges: number[][] = []
  const cutLines: string[] = []
  const removedRows: number[] = []
  for (const row of rows) {
    const line = lines[row]
    const range = [row, 0, row, line.length]
    if (line === '' && lines.length > 1) {
      if (row < lines.length - 1) {
        range[2] = row + 1
      } else {
        range[0] = row - 1
        range[1] = lines[row - 1].length
      }
      removedRows.push(row)
    }
    const previous = ranges.at(-1)
    if (previous && (range[0] < previous[2] || (range[0] === previous[2] && range[1] <= previous[3]))) {
      if (row === lines.length - 1 && line === '' && previous[0] > 0 && lines[previous[0]] === '') {
        previous[0]--
        previous[1] = lines[previous[0]].length
      }
      previous[2] = range[2]
      previous[3] = range[3]
    } else {
      ranges.push(range)
    }
    cutLines.push(line)
  }
  const mergedRanges: number[][] = []
  for (const range of ranges) {
    const previous = mergedRanges.at(-1)
    if (previous && range[0] === previous[2] && range[1] <= previous[3]) {
      previous[2] = range[2]
      previous[3] = range[3]
    } else {
      mergedRanges.push(range)
    }
  }
  const replaceRange = new Uint32Array(mergedRanges.flat())
  const changes = EditorCommandReplaceRange.replaceRange(editor, replaceRange, [''], EditOrigin.EditorCut)
  const deletedRowCount = changes.reduce((count, change) => count + change.end.rowIndex - change.start.rowIndex, 0)
  const lastRow = lines.length - deletedRowCount - 1
  const selectionChanges = new Uint32Array(rows.length * 4)
  let removedBefore = 0
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    while (removedBefore < removedRows.length && removedRows[removedBefore] < row) {
      removedBefore++
    }
    const cursorRow = Math.min(row - removedBefore, lastRow)
    selectionChanges[i * 4] = cursorRow
    selectionChanges[i * 4 + 2] = cursorRow
  }
  await Clipboard.writeText(JoinLines.joinLines(cutLines))
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes, selectionChanges)
}
