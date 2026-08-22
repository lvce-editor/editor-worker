import type { TextDragData } from '../TextDragData/TextDragData.ts'
import * as SplitLines from '../SplitLines/SplitLines.ts'
import * as TextDocument from '../TextDocument/TextDocument.ts'

interface Position {
  readonly columnIndex: number
  readonly rowIndex: number
}

export interface TextDragEditResult {
  readonly change: {
    readonly deleted: readonly string[]
    readonly end: Position
    readonly inserted: readonly string[]
    readonly origin: string
    readonly start: Position
  }
  readonly selections: Uint32Array
}

const getSelection = (lines: readonly string[], startOffset: number, endOffset: number): Uint32Array => {
  const start = TextDocument.positionAt({ lines }, startOffset)
  const end = TextDocument.positionAt({ lines }, endOffset)
  return new Uint32Array([start.rowIndex, start.columnIndex, end.rowIndex, end.columnIndex])
}

export const getTextDragEdit = (
  editor: { readonly lines: readonly string[] },
  data: TextDragData,
  target: Position,
  origin: string,
): TextDragEditResult | undefined => {
  const documentText = TextDocument.getText(editor as any)
  const targetOffset = TextDocument.offsetAt(editor, target.rowIndex, target.columnIndex)
  const { endOffset, startOffset, text } = data
  if (
    startOffset < 0 ||
    startOffset >= endOffset ||
    endOffset > documentText.length ||
    documentText.slice(startOffset, endOffset) !== text ||
    (targetOffset >= startOffset && targetOffset <= endOffset)
  ) {
    return undefined
  }

  const regionStartOffset = Math.min(startOffset, targetOffset)
  const regionEndOffset = Math.max(endOffset, targetOffset)
  const replacement =
    targetOffset < startOffset ? text + documentText.slice(targetOffset, startOffset) : documentText.slice(endOffset, targetOffset) + text
  const newSelectionStartOffset = targetOffset < startOffset ? targetOffset : targetOffset - text.length
  const newText = documentText.slice(0, regionStartOffset) + replacement + documentText.slice(regionEndOffset)
  const newLines = SplitLines.splitLines(newText)
  const start = TextDocument.positionAt(editor, regionStartOffset)
  const end = TextDocument.positionAt(editor, regionEndOffset)

  return {
    change: {
      deleted: SplitLines.splitLines(documentText.slice(regionStartOffset, regionEndOffset)),
      end,
      inserted: SplitLines.splitLines(replacement),
      origin,
      start,
    },
    selections: getSelection(newLines, newSelectionStartOffset, newSelectionStartOffset + text.length),
  }
}
