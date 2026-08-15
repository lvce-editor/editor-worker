import * as TextDocument from '../TextDocument/TextDocument.ts'

export interface ColorRange {
  readonly endOffset: number
  readonly startOffset: number
  readonly value: string
}

const noColorRange: ColorRange = {
  endOffset: -1,
  startOffset: -1,
  value: '',
}

const colorPattern = /#[\da-f]{3,8}\b|\b(?:hsla?|rgba?)\([^)]*\)/gi

export const getColorPickerRange = (editor: any): ColorRange => {
  const { lines, selections } = editor
  if (!selections || selections.length < 4) {
    return noColorRange
  }
  const selectionStartRow = selections[0]
  const selectionEndRow = selections[2]
  if (selectionStartRow !== selectionEndRow) {
    return noColorRange
  }
  const selectionStartColumn = selections[1]
  const selectionEndColumn = selections[3]
  const rowIndex = selectionEndRow
  const line = lines[rowIndex]
  if (typeof line !== 'string') {
    return noColorRange
  }
  if (selectionStartColumn !== selectionEndColumn) {
    const startColumn = Math.min(selectionStartColumn, selectionEndColumn)
    const endColumn = Math.max(selectionStartColumn, selectionEndColumn)
    return {
      endOffset: TextDocument.offsetAt(editor, rowIndex, endColumn),
      startOffset: TextDocument.offsetAt(editor, rowIndex, startColumn),
      value: line.slice(startColumn, endColumn),
    }
  }
  const columnIndex = selectionEndColumn
  for (const match of line.matchAll(colorPattern)) {
    const startColumn = match.index
    const endColumn = startColumn + match[0].length
    if (columnIndex >= startColumn && columnIndex <= endColumn) {
      return {
        endOffset: TextDocument.offsetAt(editor, rowIndex, endColumn),
        startOffset: TextDocument.offsetAt(editor, rowIndex, startColumn),
        value: match[0],
      }
    }
  }
  return noColorRange
}
