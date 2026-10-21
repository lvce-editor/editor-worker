import * as Bidi from '../Bidi/Bidi.ts'
import * as Editor from '../Editor/Editor.ts'
import * as EditorDelta from '../EditorCommand/EditorCommandDelta.ts'
import { getSelectionPairs } from '../GetSelectionPairs/GetSelectionPairs.ts'

export const moveBidiCharacter = (editor: any, direction: -1 | 1, extend = false): any => {
  const { lines, selections } = editor
  if (!editor.rtl) {
    return undefined
  }
  let relevant = false
  for (let i = 0; i < selections.length; i += 2) {
    const row = selections[i]
    if ([row - 1, row, row + 1].some((index) => Bidi.isBidi(lines[index] || '', true))) {
      relevant = true
      break
    }
  }
  if (!relevant) {
    return undefined
  }
  const result = new Uint32Array(selections)
  const getColumns = (row: number): readonly number[] => Bidi.getVisualColumns(lines[row])
  for (let i = 0; i < selections.length; i += 4) {
    let row = selections[i + 2]
    let column = selections[i + 3]
    const [startRow, startColumn, endRow, endColumn] = getSelectionPairs(selections, i)
    if (!extend && (startRow !== endRow || startColumn !== endColumn)) {
      row = direction === -1 ? startRow : endRow
      column = direction === -1 ? startColumn : endColumn
      if (startRow === endRow && Bidi.isBidi(lines[row], true)) {
        const columns = getColumns(row)
        const selectedColumns = columns.filter((value) => value >= startColumn && value <= endColumn)
        column = direction === -1 ? selectedColumns[0] : selectedColumns.at(-1)!
      }
    } else {
      const line = lines[row]
      if (Bidi.isBidi(line, true)) {
        const columns = getColumns(row)
        const index = columns.indexOf(column)
        const next = index + direction
        if (next >= 0 && next < columns.length) {
          column = columns[next]
        } else if (row + direction >= 0 && row + direction < lines.length) {
          row += direction
          const nextColumns = getColumns(row)
          column = direction === -1 ? nextColumns.at(-1)! : nextColumns[0]
        }
      } else if (direction === -1 && column > 0) {
        column -= EditorDelta.characterLeft(line, column)
      } else if (direction === 1 && column < line.length) {
        column += EditorDelta.characterRight(line, column)
      } else if (row + direction >= 0 && row + direction < lines.length) {
        row += direction
        const columns = getColumns(row)
        column = direction === -1 ? columns.at(-1)! : columns[0]
      }
    }
    if (!extend) {
      result[i] = row
      result[i + 1] = column
    }
    result[i + 2] = row
    result[i + 3] = column
  }
  return Editor.scheduleSelections(editor, result)
}
