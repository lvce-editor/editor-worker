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

const getSelectionEditsSingleLineWord = (lines: string[], selections: any) => {
  const lastSelectionIndex = selections.length - 4
  const rowIndex = selections[lastSelectionIndex]
  const lastSelectionStartColumnIndex = selections[lastSelectionIndex + 1]
  const lastSelectionEndColumnIndex = selections[lastSelectionIndex + 3]
  const line = lines[rowIndex]
  const word = line.slice(lastSelectionStartColumnIndex, lastSelectionEndColumnIndex)
  const columnIndexAfter = line.indexOf(word, lastSelectionEndColumnIndex)
  if (columnIndexAfter !== -1) {
    const columnIndexAfterEnd = columnIndexAfter + word.length
    // @ts-ignore
    const revealRange = {
      start: {
        rowIndex,
        columnIndex: columnIndexAfter,
      },
      end: {
        rowIndex,
        columnIndex: columnIndexAfterEnd,
      },
    }
    const newSelections = EditorSelection.push(selections, rowIndex, columnIndexAfter, rowIndex, columnIndexAfterEnd)
    return {
      revealRange: newSelections.length - 4,
      selectionEdits: newSelections,
    }
  }
  for (let i = rowIndex + 1; i < lines.length; i++) {
    const line = lines[i]
    const columnIndex = line.indexOf(word)
    if (columnIndex !== -1) {
      const columnIndexEnd = columnIndex + word.length
      const newSelections = new Uint32Array(selections.length + 4)
      newSelections.set(selections, 0)
      const insertIndex = selections.length
      newSelections[insertIndex] = i
      newSelections[insertIndex + 1] = columnIndex
      newSelections[insertIndex + 2] = i
      newSelections[insertIndex + 3] = columnIndexEnd
      return {
        revealRange: newSelections.length - 4,
        selectionEdits: newSelections,
      }
    }
  }
  let selectionIndex = 0
  // TODO use text document search for this
  for (let i = 0; i <= rowIndex; i++) {
    const line = lines[i]
    let columnIndex = -word.length
    while ((columnIndex = line.indexOf(word, columnIndex + word.length)) !== -1) {
      let startRowIndex = selections[selectionIndex]
      while (startRowIndex < i && selectionIndex < selections.length) {
        selectionIndex += 4
        startRowIndex = selections[selectionIndex]
      }
      if (startRowIndex === i) {
        let endColumnIndex = selections[selectionIndex + 3]
        while (endColumnIndex < columnIndex && selectionIndex < selections.length) {
          selectionIndex += 4
          endColumnIndex = selections[endColumnIndex + 3]
        }
      }
      startRowIndex = selections[selectionIndex]
      const startColumnIndex = selections[selectionIndex + 1]
      const endColumnIndex = selections[selectionIndex + 3]
      if (startRowIndex === i && startColumnIndex <= columnIndex && columnIndex <= endColumnIndex) {
        continue
      }
      if (startRowIndex > i) {
        selectionIndex -= 4
      }
      const columnEndIndex = columnIndex + word.length
      // @ts-ignore
      const revealRange = {
        start: {
          rowIndex: i,
          columnIndex,
        },
        end: {
          rowIndex: i,
          columnIndex: columnEndIndex,
        },
      }
      selectionIndex += 4
      const newSelections = new Uint32Array(selections.length + 4)
      newSelections.set(selections.subarray(0, selectionIndex), 0)
      newSelections[selectionIndex] = i
      newSelections[selectionIndex + 1] = columnIndex
      newSelections[selectionIndex + 2] = i
      newSelections[selectionIndex + 3] = columnEndIndex
      newSelections.set(selections.subarray(selectionIndex), selectionIndex + 4)
      return {
        revealRange: newSelections.length - 4,
        selectionEdits: newSelections,
      }
    }
  }
  return undefined
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
      selectionEdits: newSelections,
      revealRange: newSelections.length - 4, // TODO should be primary selection
    }
  }

  if (EditorSelection.isEverySelectionSingleLine(editor.selections)) {
    return getSelectionEditsSingleLineWord(editor.lines, editor.selections)
  }
  return undefined
}
