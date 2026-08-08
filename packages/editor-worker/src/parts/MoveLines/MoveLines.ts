import * as Editor from '../Editor/Editor.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.ts'

const getSelectedLineRange = (selections: Uint32Array, primarySelectionIndex: number) => {
  const [startRowIndex, , selectionEndRowIndex, endColumnIndex] = GetSelectionPairs.getSelectionPairs(selections, primarySelectionIndex)
  const endRowIndex = startRowIndex < selectionEndRowIndex && endColumnIndex === 0 ? selectionEndRowIndex - 1 : selectionEndRowIndex
  return {
    endRowIndex,
    startRowIndex,
  }
}

const movePositionDown = (lines: readonly string[], rowIndex: number, columnIndex: number): readonly [number, number] => {
  const newRowIndex = rowIndex + 1
  if (newRowIndex < lines.length) {
    return [newRowIndex, columnIndex]
  }
  const lastRowIndex = lines.length - 1
  return [lastRowIndex, lines[rowIndex - 1].length]
}

const getSelectionChanges = (lines: readonly string[], selections: Uint32Array, primarySelectionIndex: number, direction: number): Uint32Array => {
  const startRowIndex = selections[primarySelectionIndex]
  const startColumnIndex = selections[primarySelectionIndex + 1]
  const endRowIndex = selections[primarySelectionIndex + 2]
  const endColumnIndex = selections[primarySelectionIndex + 3]
  if (direction < 0) {
    return new Uint32Array([startRowIndex - 1, startColumnIndex, endRowIndex - 1, endColumnIndex])
  }
  const [newStartRowIndex, newStartColumnIndex] = movePositionDown(lines, startRowIndex, startColumnIndex)
  const [newEndRowIndex, newEndColumnIndex] = movePositionDown(lines, endRowIndex, endColumnIndex)
  return new Uint32Array([newStartRowIndex, newStartColumnIndex, newEndRowIndex, newEndColumnIndex])
}

export const moveLines = (editor: any, direction: number) => {
  const { lines, primarySelectionIndex = 0, selections } = editor
  const { endRowIndex, startRowIndex } = getSelectedLineRange(selections, primarySelectionIndex)
  const lastRowIndex = lines.length - 1
  if ((direction < 0 && startRowIndex === 0) || (direction > 0 && endRowIndex === lastRowIndex)) {
    return editor
  }
  const editStartRowIndex = direction < 0 ? startRowIndex - 1 : startRowIndex
  const editEndRowIndex = direction < 0 ? endRowIndex : endRowIndex + 1
  const selectedLines = lines.slice(startRowIndex, endRowIndex + 1)
  const inserted = direction < 0 ? [...selectedLines, lines[startRowIndex - 1]] : [lines[endRowIndex + 1], ...selectedLines]
  const changes = [
    {
      deleted: lines.slice(editStartRowIndex, editEndRowIndex + 1),
      end: {
        columnIndex: lines[editEndRowIndex].length,
        rowIndex: editEndRowIndex,
      },
      inserted,
      origin: EditOrigin.Unknown,
      start: {
        columnIndex: 0,
        rowIndex: editStartRowIndex,
      },
    },
  ]
  const selectionChanges = getSelectionChanges(lines, selections, primarySelectionIndex, direction)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes, selectionChanges)
}
