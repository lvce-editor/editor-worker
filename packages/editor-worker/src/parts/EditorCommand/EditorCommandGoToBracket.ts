import * as BracketMatching from '../BracketMatching/BracketMatching.ts'
import * as Editor from '../Editor/Editor.ts'
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.ts'

export const goToBracket = (editor: any) => {
  const { lines, selections } = editor
  const newSelections = new Uint32Array(selections)
  for (let i = 0; i < selections.length; i += 4) {
    const [startRowIndex, startColumnIndex] = GetSelectionPairs.getSelectionPairs(selections, i)
    const directPair = BracketMatching.findMatchingBracket(lines, startRowIndex, startColumnIndex)
    let target = directPair?.match
    if (!target) {
      target = BracketMatching.findEnclosingBrackets(lines, startRowIndex, startColumnIndex)?.match
    }
    if (!target) {
      target = BracketMatching.findNextBracket(lines, startRowIndex, startColumnIndex)
    }
    if (!target) {
      continue
    }
    newSelections[i] = target.rowIndex
    newSelections[i + 1] = target.columnIndex
    newSelections[i + 2] = target.rowIndex
    newSelections[i + 3] = target.columnIndex
  }
  return Editor.scheduleSelections(editor, newSelections)
}
