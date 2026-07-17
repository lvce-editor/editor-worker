import * as Editor from '../Editor/Editor.ts'
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'

export const cursorPageDown = (editor: any) => {
  const { deltaY, itemHeight, lines, numberOfVisibleLines, selections } = editor
  const pageSize = Math.max(numberOfVisibleLines, 1)
  const lastRowIndex = lines.length - 1
  const newSelections = EditorSelection.map(
    selections,
    (result: any, index: number, _startRow: number, _startColumn: number, endRow: number, endColumn: number) => {
      EditorSelection.moveRangeToPosition(result, index, Math.min(endRow + pageSize, lastRowIndex), endColumn)
    },
  )
  const newEditor = Editor.scheduleSelections(editor, newSelections)
  return Editor.setDeltaYFixedValue(newEditor, deltaY + pageSize * itemHeight)
}
