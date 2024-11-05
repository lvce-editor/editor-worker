import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import type { OffsetBasedEdit } from '../OffsetBasedEdit/OffsetBasedEdit.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

export const getDocumentEdits = (editor: any, edits: readonly OffsetBasedEdit[]): readonly any[] => {
  const documentEdits: any[] = []
  for (const edit of edits) {
    const start = TextDocument.positionAt(editor, edit.startOffset)
    const end = TextDocument.positionAt(editor, edit.endOffset)
    const deleted = TextDocument.getSelectionText(editor, {
      start,
      end,
    })
    const documentEdit = {
      start,
      end,
      inserted: SplitLines.splitLines(edit.inserted),
      deleted,
      origin: EditOrigin.Format,
    }
    if (documentEdit.inserted.length === 0) {
      documentEdit.inserted = ['']
    }
    documentEdits.push(documentEdit)
  }
  return documentEdits
}
