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
      columnIndex: selectionEndColumn,
      rowIndex: selectionEndRow,
    }
    changes.push({
      deleted: TextDocument.getSelectionText(
        { lines },
        {
          end: selectionEnd,
          start: positionLeft,
        },
      ),
      end: selectionEnd,
      inserted: [''],
      origin: EditOrigin.DeleteLeft,
      start: positionLeft,
    })
  }
  EditorSelection.forEach(selections, deleteSelection)
  return changes
}
