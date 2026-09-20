import { cssNamedColors } from '../CssNamedColors/CssNamedColors.ts'
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

const colorPattern = new RegExp(`#[\\da-f]{3,8}\\b|\\b(?:hsla?|rgba?)\\([^)]*\\)|\\b(?:${cssNamedColors.join('|')})\\b`, 'gi')

const isColorIdentifierCharacter = (character: string | undefined): boolean => {
  return character !== undefined && /[\da-z_-]/i.test(character)
}

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
    if (isColorIdentifierCharacter(line[startColumn - 1]) || isColorIdentifierCharacter(line[endColumn])) {
      continue
    }
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
