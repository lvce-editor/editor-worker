import * as EditorSelection from '../EditorSelection/EditorSelection.ts'
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.ts'
import * as GetWordMatchAtPosition from '../GetWordMatchAtPosition/GetWordMatchAtPosition.ts'
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

const createResult = (selectionEdits: Uint32Array) => {
  return {
    revealRange: selectionEdits.length - 4,
    selectionEdits,
  }
}

const appendSelection = (selections: Uint32Array, rowIndex: number, startColumnIndex: number, endColumnIndex: number) => {
  return createResult(EditorSelection.push(selections, rowIndex, startColumnIndex, rowIndex, endColumnIndex))
}

const insertSelection = (selections: Uint32Array, insertIndex: number, rowIndex: number, startColumnIndex: number, endColumnIndex: number) => {
  const newSelections = new Uint32Array(selections.length + 4)
  newSelections.set(selections.subarray(0, insertIndex), 0)
  newSelections[insertIndex] = rowIndex
  newSelections[insertIndex + 1] = startColumnIndex
  newSelections[insertIndex + 2] = rowIndex
  newSelections[insertIndex + 3] = endColumnIndex
  newSelections.set(selections.subarray(insertIndex), insertIndex + 4)
  return createResult(newSelections)
}

const getSelectionIndexForColumn = (selections: Uint32Array, rowIndex: number, columnIndex: number) => {
  let selectionIndex = 0
  while (selectionIndex < selections.length && selections[selectionIndex] < rowIndex) {
    selectionIndex += 4
  }
  while (selectionIndex < selections.length && selections[selectionIndex] === rowIndex && selections[selectionIndex + 3] < columnIndex) {
    selectionIndex += 4
  }
  return selectionIndex
}

const isCoveredBySelection = (selections: Uint32Array, selectionIndex: number, rowIndex: number, columnIndex: number) => {
  if (selectionIndex >= selections.length) {
    return false
  }
  return selections[selectionIndex] === rowIndex && selections[selectionIndex + 1] <= columnIndex && columnIndex <= selections[selectionIndex + 3]
}

const getNextOccurrenceInCurrentLine = (line: string, word: string, startColumnIndex: number) => {
  const columnIndexAfter = line.indexOf(word, startColumnIndex)
  if (columnIndexAfter === -1) {
    return undefined
  }
  return {
    endColumnIndex: columnIndexAfter + word.length,
    startColumnIndex: columnIndexAfter,
  }
}

const getNextOccurrenceAfterRow = (lines: string[], word: string, startRowIndex: number, selections: Uint32Array) => {
  for (let i = startRowIndex; i < lines.length; i++) {
    const columnIndex = lines[i].indexOf(word)
    if (columnIndex !== -1) {
      return appendSelection(selections, i, columnIndex, columnIndex + word.length)
    }
  }
  return undefined
}

const getWrappedOccurrence = (lines: string[], word: string, rowIndex: number, selections: Uint32Array) => {
  for (let i = 0; i <= rowIndex; i++) {
    const line = lines[i]
    let columnIndex = -word.length
    while ((columnIndex = line.indexOf(word, columnIndex + word.length)) !== -1) {
      const selectionIndex = getSelectionIndexForColumn(selections, i, columnIndex)
      if (isCoveredBySelection(selections, selectionIndex, i, columnIndex)) {
        continue
      }
      return insertSelection(selections, selectionIndex, i, columnIndex, columnIndex + word.length)
    }
  }
  return undefined
}

const getSelectionEditsSingleLineWord = (lines: string[], selections: any) => {
  const lastSelectionIndex = selections.length - 4
  const rowIndex = selections[lastSelectionIndex]
  const lastSelectionStartColumnIndex = selections[lastSelectionIndex + 1]
  const lastSelectionEndColumnIndex = selections[lastSelectionIndex + 3]
  const line = lines[rowIndex]
  const word = line.slice(lastSelectionStartColumnIndex, lastSelectionEndColumnIndex)
  const nextInCurrentLine = getNextOccurrenceInCurrentLine(line, word, lastSelectionEndColumnIndex)
  if (nextInCurrentLine) {
    return appendSelection(selections, rowIndex, nextInCurrentLine.startColumnIndex, nextInCurrentLine.endColumnIndex)
  }
  const nextAfterCurrentRow = getNextOccurrenceAfterRow(lines, word, rowIndex + 1, selections)
  if (nextAfterCurrentRow) {
    return nextAfterCurrentRow
  }
  return getWrappedOccurrence(lines, word, rowIndex, selections)
}

export const getSelectNextOccurrenceResult = (editor: any) => {
  const { lines } = editor
  const { selections } = editor
  if (EditorSelection.isEverySelectionEmpty(selections)) {
    const newSelections = new Uint32Array(selections.length)
    for (let i = 0; i < selections.length; i += 4) {
      const [selectionStartRow, selectionStartColumn, selectionEndRow, selectionEndColumn] = GetSelectionPairs.getSelectionPairs(selections, i)

      const wordMatch = GetWordMatchAtPosition.getWordMatchAtPosition(lines, selectionStartRow, selectionStartColumn)
      wordMatch // ?
      if (wordMatch.start === wordMatch.end) {
        newSelections[i] = selectionStartRow
        newSelections[i + 1] = selectionStartColumn
        newSelections[i + 2] = selectionEndRow
        newSelections[i + 3] = selectionEndColumn
      } else {
        newSelections[i] = selectionStartRow
        newSelections[i + 1] = wordMatch.start
        newSelections[i + 2] = selectionStartRow
        newSelections[i + 3] = wordMatch.end
      }
    }

    return {
      revealRange: newSelections.length - 4, // TODO should be primary selection
      selectionEdits: newSelections,
    }
  }

  if (EditorSelection.isEverySelectionSingleLine(editor.selections)) {
    return getSelectionEditsSingleLineWord(editor.lines, editor.selections)
  }
  return undefined
}
