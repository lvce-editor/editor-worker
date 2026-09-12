import * as Editor from '../Editor/Editor.ts'
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'

const moveSelectionDown = (
  lastRow: number,
  selections: any,
  i: any,
  selectionStartRow: any,
  selectionStartColumn: any,
  selectionEndRow: any,
  selectionEndColumn: any,
) => {
  EditorSelection.moveRangeToPosition(selections, i, Math.min(selectionEndRow + 1, lastRow), selectionEndColumn)
}

const getNewSelections = (selections: any, lastRow: number) => {
  return EditorSelection.map(selections, moveSelectionDown.bind(null, lastRow))
}

export const cursorDown = (editor: any) => {
  const { lines, selections } = editor
  const newSelections = getNewSelections(selections, Math.max(0, lines.length - 1))
  return Editor.scheduleSelections(editor, newSelections)
}
