import type { BracketPosition } from '../BracketMatching/BracketMatching.ts'
import * as BracketMatching from '../BracketMatching/BracketMatching.ts'
import * as Editor from '../Editor/Editor.ts'
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.ts'

const isBefore = (left: BracketPosition, right: BracketPosition): boolean =>
  left.rowIndex < right.rowIndex || (left.rowIndex === right.rowIndex && left.columnIndex < right.columnIndex)

export const selectToBracket = (editor: any) => {
  const { lines, selections } = editor
  const newSelections = new Uint32Array(selections)
  for (let i = 0; i < selections.length; i += 4) {
    const [rowIndex, columnIndex] = GetSelectionPairs.getSelectionPairs(selections, i)
    const pair = BracketMatching.findBracketPair(lines, rowIndex, columnIndex)
    if (!pair) {
      continue
    }
    const start = isBefore(pair.source, pair.match) ? pair.source : pair.match
    const end = start === pair.source ? pair.match : pair.source
    if (pair.source === end) {
      newSelections[i] = end.rowIndex
      newSelections[i + 1] = end.columnIndex + 1
      newSelections[i + 2] = start.rowIndex
      newSelections[i + 3] = start.columnIndex
    } else {
      newSelections[i] = start.rowIndex
      newSelections[i + 1] = start.columnIndex
      newSelections[i + 2] = end.rowIndex
      newSelections[i + 3] = end.columnIndex + 1
    }
  }
  return Editor.scheduleSelections(editor, newSelections)
}
