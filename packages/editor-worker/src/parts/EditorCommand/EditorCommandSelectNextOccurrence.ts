import * as Editor from '../Editor/Editor.ts'
import * as GetSelectNextOccurrenceResult from '../GetSelectNextOccurrenceResult/GetSelectNextOccurrenceResult.ts'
// TODO handle virtual space

// TODO editors behave differently when selecting next occurrence, for example:

// aaa
// bbb 1
// ccc
// bbb 2
// bbb 3
// aaa
// bbb 4
// ccc

// when clicking first at position 4 and then position 2,
// - vscode selects next position 3 and refuses to select position 1
// - atom also selects next position 3 and refuses to select position 1
// - WebStorm also selects next position 3 and refuses to select position 1
// - brackets (codemirror) selects position 3 and then selects position 1
// - sublime selects next position 1, then next position 3

const isRangeInViewPort = (minLineY: number, maxLineY: number, startRowIndex: number, endRowIndex: number) => {
  return startRowIndex >= minLineY && endRowIndex <= maxLineY
}

// TODO handle virtual space
export const selectNextOccurrence = (editor: any) => {
  const result = GetSelectNextOccurrenceResult.getSelectNextOccurrenceResult(editor)
  if (!result) {
    return editor
  }
  const revealRange = result.revealRange
  const selectionEdits = result.selectionEdits
  const revealRangeStartRowIndex = selectionEdits[revealRange]
  const revealRangeEndRowIndex = selectionEdits[revealRange + 2]
  if (isRangeInViewPort(editor.minLineY, editor.maxLineY, revealRangeStartRowIndex, revealRangeEndRowIndex)) {
    return Editor.scheduleSelections(editor, selectionEdits)
  }
  // TODO what is this magic number 5?
  // const deltaY = (revealRangeStartRowIndex - 5) * editor.rowHeight
  return Editor.scheduleDocumentAndCursorsSelections(editor, [], selectionEdits)
}
