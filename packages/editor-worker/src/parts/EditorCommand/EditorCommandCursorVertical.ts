import * as Editor from '../Editor/Editor.ts'
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'

const moveSelectionWithoutIntlSegmenter = (
  selections: any,
  i: number,
  selectionStartRow: number,
  selectionStartColumn: number,
  selectionEndRow: number,
  selectionEndColumn: number
) => {
  if (selectionStartRow === 0) {
    EditorSelection.moveRangeToPosition(selections, i, 0, 0)
  } else {
    EditorSelection.moveRangeToPosition(selections, i, selectionStartRow - 1, selectionStartColumn)
  }
}

const getNewSelections = (selections: any) => {
  return EditorSelection.map(selections, moveSelectionWithoutIntlSegmenter)
}

export const cursorVertical = (editor: any, getPosition: any, getEdgePosition: any, delta: any) => {
  const { selections } = editor
  const newSelections = getNewSelections(selections)
  return Editor.scheduleSelections(editor, newSelections)
}
