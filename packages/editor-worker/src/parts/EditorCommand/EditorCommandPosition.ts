import * as Assert from '../Assert/Assert.ts'
import * as Clamp from '../Clamp/Clamp.ts'
import * as EditorFolding from '../EditorFolding/EditorFolding.ts'
import * as EditorViewRows from '../EditorViewRows/EditorViewRows.ts'
import * as GetAccurateColumnIndex from '../GetAccurateColumnIndex/GetAccurateColumnIndex.ts'
import * as GetX from '../GetX/GetX.ts'

export const at = async (editor: any, eventX: number, eventY: number) => {
  Assert.object(editor)
  Assert.number(eventX)
  Assert.number(eventY)
  const {
    charWidth,
    deltaX,
    deltaY,
    foldingRanges = [],
    fontFamily,
    fontSize,
    fontWeight,
    gutterWidth = 0,
    isMonospaceFont,
    letterSpacing,
    lines,
    rowHeight,
    tabSize,
    viewLineIndices,
    x,
    y,
  } = editor
  const visualRowIndex = Math.floor((eventY - y + deltaY) / rowHeight)
  if (visualRowIndex < 0) {
    return {
      columnIndex: 0,
      rowIndex: 0,
    }
  }
  const rowIndex = viewLineIndices
    ? EditorViewRows.getDocumentRowForVisualRow(visualRowIndex, viewLineIndices)
    : EditorFolding.getDocumentRowForVisualRow(visualRowIndex, foldingRanges)
  const relativeX = eventX - x - gutterWidth + deltaX
  const clampedRowIndex = Clamp.clamp(rowIndex, 0, lines.length - 1)
  const line = lines[clampedRowIndex]
  const columnIndex = await GetAccurateColumnIndex.getAccurateColumnIndex(
    line,
    fontWeight,
    fontSize,
    fontFamily,
    letterSpacing,
    isMonospaceFont,
    charWidth,
    tabSize,
    relativeX,
  )
  return {
    columnIndex,
    rowIndex: clampedRowIndex,
  }
}

/**
 * @deprecated this doesn't account for variable-width characters, gutters, or horizontal scrolling.
 */
export const x = (editor: any, rowIndex: number, columnIndex: number) => {
  const { columnWidth, x } = editor
  return columnIndex * columnWidth + x
}

export const getCursorX = async (editor: any, rowIndex: number, columnIndex: number): Promise<number> => {
  const { charWidth, deltaX, fontFamily, fontSize, fontWeight, gutterWidth = 0, isMonospaceFont, letterSpacing, lines, tabSize, width, x } = editor
  const textX = await GetX.getX(
    lines[rowIndex] || '',
    columnIndex,
    fontWeight,
    fontSize,
    fontFamily,
    isMonospaceFont,
    letterSpacing,
    tabSize,
    0,
    width,
    charWidth,
  )
  return x + gutterWidth + textX - deltaX
}

export const y = (editor: any, rowIndex: number) => {
  const { deltaY = 0, rowHeight, y } = editor
  const offsetY = (rowIndex + 1) * rowHeight + y - deltaY
  return offsetY
}
