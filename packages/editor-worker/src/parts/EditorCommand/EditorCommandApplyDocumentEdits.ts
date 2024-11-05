import * as Editor from '../Editor/Editor.ts'
import * as GetDocumentEdits from '../GetDocumentEdits/GetDocumentEdits.ts'
import * as Logger from '../Logger/Logger.ts'
import type { OffsetBasedEdit } from '../OffsetBasedEdit/OffsetBasedEdit.ts'

export const applyDocumentEdits = (editor: any, edits: readonly OffsetBasedEdit[]): any => {
  if (!Array.isArray(edits)) {
    Logger.warn('something is wrong with format on save', edits)
    return editor
  }
  if (edits.length === 0) {
    return editor
  }
  const documentEdits = GetDocumentEdits.getDocumentEdits(editor, edits)
  return Editor.scheduleDocumentAndCursorsSelections(editor, documentEdits)
}
