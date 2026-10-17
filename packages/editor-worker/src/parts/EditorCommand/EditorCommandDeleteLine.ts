import * as Editor from '../Editor/Editor.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as GetSelectionPairs from '../GetSelectionPairs/GetSelectionPairs.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

interface DeleteLineOperation {
  readonly endRowIndex: number
  readonly positionColumnIndex: number
  readonly startRowIndex: number
}

const getDeleteLineOperations = (selections: Uint32Array): DeleteLineOperation[] => {
  const operations: DeleteLineOperation[] = []
  for (let i = 0; i < selections.length; i += 4) {
    const [startRowIndex, , selectionEndRowIndex, endColumnIndex] = GetSelectionPairs.getSelectionPairs(selections, i)
    const endRowIndex = startRowIndex < selectionEndRowIndex && endColumnIndex === 0 ? selectionEndRowIndex - 1 : selectionEndRowIndex
    operations.push({
      endRowIndex,
      positionColumnIndex: selections[i + 3],
      startRowIndex,
    })
  }
  operations.sort((a, b) => a.startRowIndex - b.startRowIndex || a.endRowIndex - b.endRowIndex)
  const mergedOperations: DeleteLineOperation[] = []
  for (const operation of operations) {
    const previous = mergedOperations.at(-1)
    if (previous && previous.endRowIndex + 1 >= operation.startRowIndex) {
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

export const deleteLine = async (editor: any) => {
  const { lines, selections } = editor
  if (lines.length === 1 && lines[0] === '') {
    return editor
  }
  const operations = getDeleteLineOperations(selections)
  const changes: any[] = []
  const selectionChanges = new Uint32Array(operations.length * 4)
  const lastRowIndex = lines.length - 1
  let linesDeleted = 0
  for (let i = 0; i < operations.length; i++) {
    const operation = operations[i]
    let { endRowIndex, startRowIndex } = operation
    let startColumnIndex = 0
    let endColumnIndex = lines[endRowIndex].length
    let survivingLine = ''
    if (endRowIndex < lastRowIndex) {
      endRowIndex++
      endColumnIndex = 0
      survivingLine = lines[endRowIndex]
    } else if (startRowIndex > 0) {
      startRowIndex--
      startColumnIndex = lines[startRowIndex].length
      survivingLine = lines[startRowIndex]
    }
    const start = {
      columnIndex: startColumnIndex,
      rowIndex: startRowIndex,
    }
    const end = {
      columnIndex: endColumnIndex,
      rowIndex: endRowIndex,
    }
    changes.push({
      deleted: TextDocument.getSelectionText(editor, { end, start }),
      end,
      inserted: [''],
      origin: EditOrigin.Delete,
      start,
    })
    const cursorRowIndex = startRowIndex - linesDeleted
    const cursorColumnIndex = Math.min(operation.positionColumnIndex, survivingLine.length)
    const offset = i * 4
    selectionChanges[offset] = cursorRowIndex
    selectionChanges[offset + 1] = cursorColumnIndex
    selectionChanges[offset + 2] = cursorRowIndex
    selectionChanges[offset + 3] = cursorColumnIndex
    linesDeleted += operation.endRowIndex - operation.startRowIndex + 1
  }
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes, selectionChanges)
}
