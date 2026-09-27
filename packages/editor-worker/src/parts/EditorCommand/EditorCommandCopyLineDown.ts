import * as Editor from '../Editor/Editor.ts'
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.ts'

interface CopyLineOperation {
  readonly endRowIndex: number
  readonly startRowIndex: number
}

const getCopyLineOperations = (selections: Uint32Array): CopyLineOperation[] => {
  const operations: CopyLineOperation[] = []
  for (let i = 0; i < selections.length; i += 4) {
    const [startRowIndex, , selectionEndRowIndex, endColumnIndex] = GetSelectionPairs.getSelectionPairs(selections, i)
    const endRowIndex = startRowIndex < selectionEndRowIndex && endColumnIndex === 0 ? selectionEndRowIndex - 1 : selectionEndRowIndex
    operations.push({
      endRowIndex,
      startRowIndex,
    })
  }
  operations.sort((a, b) => a.startRowIndex - b.startRowIndex || a.endRowIndex - b.endRowIndex)
  const mergedOperations: CopyLineOperation[] = []
  for (const operation of operations) {
    const previous = mergedOperations.at(-1)
    if (previous && previous.endRowIndex >= operation.startRowIndex) {
      mergedOperations[mergedOperations.length - 1] = {
        ...previous,
        endRowIndex: Math.max(previous.endRowIndex, operation.endRowIndex),
      }
    } else {
      mergedOperations.push(operation)
    }
  }
  return mergedOperations
}

export const copyLineDown = async (editor: any) => {
  const { selections } = editor
  const operations = getCopyLineOperations(selections)
  const changes = operations.map(({ endRowIndex, startRowIndex }) => {
    const selectedLines = editor.lines.slice(startRowIndex, endRowIndex + 1)
    return {
      deleted: selectedLines,
      end: {
        columnIndex: editor.lines[endRowIndex].length,
        rowIndex: endRowIndex,
      },
      inserted: [...selectedLines, ...selectedLines],
      start: {
        columnIndex: 0,
        rowIndex: startRowIndex,
      },
    }
  })
  const getRowOffset = (rowIndex: number) => {
    let offset = 0
    for (const operation of operations) {
      if (operation.startRowIndex <= rowIndex) {
        offset += operation.endRowIndex - operation.startRowIndex + 1
      }
    }
    return offset
  }
  const selectionChanges = new Uint32Array(selections.length)
  for (let i = 0; i < selections.length; i += 4) {
    selectionChanges[i] = selections[i] + getRowOffset(selections[i])
    selectionChanges[i + 1] = selections[i + 1]
    selectionChanges[i + 2] = selections[i + 2] + getRowOffset(selections[i + 2])
    selectionChanges[i + 3] = selections[i + 3]
  }
  const newEditor = await Editor.scheduleDocumentAndCursorsSelections(editor, changes, selectionChanges)
  return typeof newEditor.finalDeltaY === 'number' ? Editor.scheduleSelections(newEditor, selectionChanges) : newEditor
}
