import * as Editor from '../Editor/Editor.ts'
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'

const moveSelectionDown = (
  lastRow: number,
  lines: readonly string[],
  selections: any,
  i: any,
  selectionStartRow: any,
  selectionStartColumn: any,
  selectionEndRow: any,
  selectionEndColumn: any,
) => {
  const rowIndex = Math.min(selectionEndRow + 1, lastRow)
  const columnIndex = Math.min(selectionEndColumn, lines[rowIndex].length)
  EditorSelection.moveRangeToPosition(selections, i, rowIndex, columnIndex)
}

const getNewSelections = (selections: any, lines: readonly string[]) => {
  return EditorSelection.map(selections, moveSelectionDown.bind(null, Math.max(0, lines.length - 1), lines))
}

export const cursorDown = (editor: any) => {
  const { lines, selections } = editor
  const newSelections = getNewSelections(selections, lines)
  return Editor.scheduleSelections(editor, newSelections)
}
