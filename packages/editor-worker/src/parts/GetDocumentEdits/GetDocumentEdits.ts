import type { DocumentEdit } from '../DocumentEdit/DocumentEdit.ts'
import type { OffsetBasedEdit } from '../OffsetBasedEdit/OffsetBasedEdit.ts'
import * as EditOrigin from '../EditOrigin/EditOrigin.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

export const getDocumentEdits = (editor: any, edits: readonly OffsetBasedEdit[]): readonly DocumentEdit[] => {
  const documentEdits: DocumentEdit[] = []
  let currentDocument = editor
  let linesDelta = 0
  let offsetDelta = 0
  const sortedEdits = edits.toSorted((a, b) => a.startOffset - b.startOffset || a.endOffset - b.endOffset)
  for (const edit of sortedEdits) {
    const currentStart = TextDocument.positionAt(currentDocument, edit.startOffset + offsetDelta)
    const currentEnd = TextDocument.positionAt(currentDocument, edit.endOffset + offsetDelta)
    const deleted = TextDocument.getSelectionText(currentDocument, {
      end: currentEnd,
      start: currentStart,
    })
    const documentEdit = {
      deleted,
      end: {
        columnIndex: currentEnd.columnIndex,
        rowIndex: currentEnd.rowIndex - linesDelta,
      },
      inserted: SplitLines.splitLines(edit.inserted),
      origin: EditOrigin.Format,
      start: {
        columnIndex: currentStart.columnIndex,
        rowIndex: currentStart.rowIndex - linesDelta,
      },
    }
    if (documentEdit.inserted.length === 0) {
      documentEdit.inserted = ['']
    }
    documentEdits.push(documentEdit)
    const currentEdit = {
      ...documentEdit,
      end: currentEnd,
      start: currentStart,
    }
    currentDocument = {
      ...currentDocument,
      lines: TextDocument.applyEdits(currentDocument, [currentEdit]),
    }
    linesDelta += documentEdit.inserted.length - documentEdit.deleted.length
    offsetDelta += edit.inserted.length - (edit.endOffset - edit.startOffset)
  }
  return documentEdits
}
