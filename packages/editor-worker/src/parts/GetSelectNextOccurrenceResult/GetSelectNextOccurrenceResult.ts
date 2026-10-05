import * as EditorSelection from '../EditorSelection/EditorSelection.ts'
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.ts'
import * as GetWordMatchAtPosition from '../GetWordMatchAtPosition/GetWordMatchAtPosition.ts'
// TODO handle virtual space

const getOccurrenceIndex = (line: string, word: string, startIndex: number, caseInsensitive: boolean): number => {
  if (!caseInsensitive) {
    return line.indexOf(word, startIndex)
  }
  const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const expression = new RegExp(escapedWord, 'giu')
  expression.lastIndex = startIndex
  return expression.exec(line)?.index ?? -1
}

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
// - VS Code selects next position 3 and refuses to select position 1
// - atom also selects next position 3 and refuses to select position 1
// - WebStorm also selects next position 3 and refuses to select position 1
// - brackets (codemirror) selects position 3 and then selects position 1
// - sublime selects next position 1, then next position 3

const getSelectionEditsSingleLineWord = (editor: any) => {
  const { lines, selections } = editor
  const lastSelectionIndex = selections.length - 4
  const [rowIndex, lastSelectionStartColumnIndex, , lastSelectionEndColumnIndex] = GetSelectionPairs.getSelectionPairs(selections, lastSelectionIndex)
  const line = lines[rowIndex]
  const word = line.slice(lastSelectionStartColumnIndex, lastSelectionEndColumnIndex)
  const caseInsensitive = editor.selectedTextOccurrenceMatching === 'caseInsensitive'
  const columnIndexAfter = getOccurrenceIndex(line, word, lastSelectionEndColumnIndex, caseInsensitive)
  if (columnIndexAfter !== -1) {
    const columnIndexAfterEnd = columnIndexAfter + word.length
    // @ts-ignore
    const revealRange = {
      end: {
        columnIndex: columnIndexAfterEnd,
        rowIndex,
      },
      start: {
        columnIndex: columnIndexAfter,
        rowIndex,
      },
    }
    const newSelections = new Uint32Array(selections.length + 4)
    newSelections.set(selections, 0)
    const insertIndex = selections.length
    newSelections[insertIndex] = rowIndex
    newSelections[insertIndex + 1] = columnIndexAfter
    newSelections[insertIndex + 2] = rowIndex
    newSelections[insertIndex + 3] = columnIndexAfterEnd
    return {
      revealRange: newSelections.length - 4,
      selectionEdits: newSelections,
    }
  }
  for (let i = rowIndex + 1; i < lines.length; i++) {
    const line = lines[i]
    const columnIndex = getOccurrenceIndex(line, word, 0, caseInsensitive)
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
    while ((columnIndex = getOccurrenceIndex(line, word, columnIndex + word.length, caseInsensitive)) !== -1) {
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
      const isSelected = startRowIndex === i && startColumnIndex <= columnIndex && columnIndex <= endColumnIndex
      if (!isSelected) {
        if (startRowIndex > i) {
          selectionIndex -= 4
        }
        const columnEndIndex = columnIndex + word.length
        // @ts-ignore
        const revealRange = {
          end: {
            columnIndex: columnEndIndex,
            rowIndex: i,
          },
          start: {
            columnIndex,
            rowIndex: i,
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
      newSelections[i] = selectionStartRow
      if (wordMatch.start === wordMatch.end) {
        newSelections[i + 1] = selectionStartColumn
        newSelections[i + 2] = selectionEndRow
        newSelections[i + 3] = selectionEndColumn
      } else {
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
    return getSelectionEditsSingleLineWord(editor)
  }
  return undefined
}
