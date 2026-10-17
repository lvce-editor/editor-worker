import * as EditorFolding from '../EditorFolding/EditorFolding.ts'
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'

export const fold = (editor: any) => {
  const { foldingRanges = [], lines, primarySelectionIndex = 0, selections } = editor
  const rowIndex = selections[primarySelectionIndex]
  const range = EditorFolding.findRange(lines, rowIndex)
  if (!range) {
    return editor
  }
  const newRanges = EditorFolding.addRange(foldingRanges, range)
  if (newRanges === foldingRanges) {
    return editor
  }
  const newSelections = EditorSelection.map(
    selections,
    (result: Uint32Array, index: number, startRow: number, startColumn: number, endRow: number, endColumn: number) => {
      if (startRow >= range.start && endRow <= range.end) {
        EditorSelection.moveRangeToPosition(result, index, range.start, Math.min(endColumn, lines[range.start].length))
        return
      }
      result[index] = startRow
      result[index + 1] = startColumn
      result[index + 2] = endRow
      result[index + 3] = endColumn
    },
  )
  return EditorFolding.updateLayout(
    {
      ...editor,
      selections: newSelections,
    },
    newRanges,
  )
}
