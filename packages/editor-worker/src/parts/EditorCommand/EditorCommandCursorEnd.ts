import * as Editor from '../Editor/Editor.ts'
import * as GetLineLength from '../GetLineLength/GetLineLength.ts'
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.ts'

const getSelectionsAtLineEnd = (selections: Uint32Array, lines: readonly string[]) => {
  const newSelections = new Uint32Array(selections.length)
  for (let i = 0; i < selections.length; i += 4) {
    const [selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn] = GetSelectionPairs.getSelectionPairs(selections, i)
    const rowIndex = selectionStartRow === selectionEndRow && selectionStartColumn === selectionEndColumn ? selectionStartRow : selectionEndRow
    const columnIndex =
      selectionStartRow === selectionEndRow && selectionStartColumn === selectionEndColumn
        ? GetLineLength.getLineLength(lines[rowIndex])
        : selectionEndColumn
    newSelections[i] = rowIndex
    newSelections[i + 1] = columnIndex
    newSelections[i + 2] = rowIndex
    newSelections[i + 3] = columnIndex
  }
  return newSelections
}

const removeDuplicateSelections = (editor: any, selections: Uint32Array) => {
  const uniqueSelections = new Uint32Array(selections.length)
  const selectionIndices = new Map<string, number>()
  const primarySelectionIndex = editor.primarySelectionIndex || 0
  let uniqueSelectionCount = 0
  let newPrimarySelectionIndex = 0
  for (let i = 0; i < selections.length; i += 4) {
    const rowIndex = selections[i + 2]
    const columnIndex = selections[i + 3]
    const key = `${rowIndex}:${columnIndex}`
    const existingSelectionIndex = selectionIndices.get(key)
    if (existingSelectionIndex !== undefined) {
      if (i === primarySelectionIndex) {
        newPrimarySelectionIndex = existingSelectionIndex * 4
      }
      continue
    }
    selectionIndices.set(key, uniqueSelectionCount)
    uniqueSelections.set(selections.subarray(i, i + 4), uniqueSelectionCount * 4)
    if (i === primarySelectionIndex) {
      newPrimarySelectionIndex = uniqueSelectionCount * 4
    }
    uniqueSelectionCount++
  }
  return {
    primarySelectionIndex: newPrimarySelectionIndex,
    selections: uniqueSelections.slice(0, uniqueSelectionCount * 4),
  }
}

// @ts-ignore
export const cursorEnd = (editor) => {
  const { lines, selections: oldSelections } = editor
  const movedSelections = getSelectionsAtLineEnd(oldSelections, lines)
  const { primarySelectionIndex, selections } = removeDuplicateSelections(editor, movedSelections)
  return Editor.scheduleSelections(
    {
      ...editor,
      primarySelectionIndex,
    },
    selections,
  )
}
