import * as Editor from '../Editor/Editor.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'
import * as EditorGetSelectionFromNativeRange from './EditorCommandGetSelectionFromNativeRange.ts'

// @ts-ignore
const getChanges = (editor, data, range) => {
  const selection = EditorGetSelectionFromNativeRange.getSelectionFromNativeRange(editor, range)
  const selectionRange = {
    end: {
      columnIndex: selection[3],
      rowIndex: selection[2],
    },
    start: {
      columnIndex: selection[1],
      rowIndex: selection[0],
    },
  }
  const changes = [
    {
      deleted: TextDocument.getSelectionText(editor, selectionRange),
      end: selectionRange.end,
      inserted: [data],
      origin: EditOrigin.ContentEditableInput,
      start: selectionRange.start,
    },
  ]
  return changes
}

export const handleBeforeInputFromContentEditable = (editor: any, data: any, range: any) => {
  const changes = getChanges(editor, data, range)
  return Editor.scheduleDocumentAndCursorsSelections(editor, changes)
}
