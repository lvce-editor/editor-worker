import * as Editor from '../Editor/Editor.ts'
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.ts'
import * as EditorGetPositionRight from './EditorCommandGetPositionRight.ts'

const getNewSelections = (selections: any, lines: readonly string[], getDelta: any) => {
  const newSelections = new Uint32Array(selections.length)
  for (let i = 0; i < selections.length; i += 4) {
    const [selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn] = GetSelectionPairs.getSelectionPairs(selections, i)
    if (selectionStartRow === selectionEndRow && selectionStartColumn === selectionEndColumn) {
      EditorGetPositionRight.moveToPositionRight(newSelections, i, selectionStartRow, selectionStartColumn, lines, getDelta)
    } else {
      newSelections[i] = newSelections[i + 2] = selectionEndRow
      newSelections[i + 1] = newSelections[i + 3] = selectionEndColumn
    }
  }
  return newSelections
}

export const editorCursorHorizontalRight = (editor: any, getDelta: any) => {
  const { lines, selections } = editor
  const newSelections = getNewSelections(selections, lines, getDelta)
  return Editor.scheduleSelections(editor, newSelections)
}
