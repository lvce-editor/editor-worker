import * as EditorGetPositionLeft from '../EditorCommand/EditorCommandGetPositionLeft.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as EditorSelection from '../EditorSelection/EditorSelection.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

// TODO optimize this function by profiling and not allocating too many objects
// @ts-ignore
export const getChanges = (lines, selections, getDelta) => {
  const changes: any[] = []
  // TODO avoid closure
  const deleteSelection = (selectionStartRow: any, selectionStartColumn: any, selectionEndRow: any, selectionEndColumn: any) => {
    const positionLeft = EditorGetPositionLeft.editorGetPositionLeft(selectionStartRow, selectionStartColumn, lines, getDelta)
    const selectionEnd = {
      rowIndex: selectionEndRow,
      columnIndex: selectionEndColumn,
    }
    changes.push({
      start: positionLeft,
      end: selectionEnd,
      inserted: [''],
      deleted: TextDocument.getSelectionText(
        { lines },
        {
          start: positionLeft,
          end: selectionEnd,
        },
      ),
      origin: EditOrigin.DeleteLeft,
    })
  }
  EditorSelection.forEach(selections, deleteSelection)
  return changes
}
