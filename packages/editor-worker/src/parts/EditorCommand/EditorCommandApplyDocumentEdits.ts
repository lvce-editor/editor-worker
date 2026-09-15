import type { OffsetBasedEdit } from '../OffsetBasedEdit/OffsetBasedEdit.ts'
import * as Editor from '../Editor/Editor.ts'
import * as GetDocumentEdits from '../GetDocumentEdits/GetDocumentEdits.ts'
import { getFormattingSelections } from '../GetFormattingSelections/GetFormattingSelections.ts'
import * as Logger from '../Logger/Logger.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

export const applyDocumentEdits = (editor: any, edits: readonly OffsetBasedEdit[]): any => {
  if (!Array.isArray(edits)) {
    Logger.warn('something is wrong with format on save', edits)
    return editor
  }
  if (edits.length === 0) {
    return editor
  }
  const documentEdits = GetDocumentEdits.getDocumentEdits(editor, edits)
  const newLines = TextDocument.applyEdits({ ...editor }, documentEdits)
  const selections = getFormattingSelections(editor.lines, newLines, editor.selections)
  return Editor.scheduleDocumentAndCursorsSelections(editor, documentEdits, selections)
}
