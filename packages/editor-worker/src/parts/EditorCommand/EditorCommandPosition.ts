import * as Assert from '../Assert/Assert.ts'
import * as Clamp from '../Clamp/Clamp.ts'
import * as EditorFolding from '../EditorFolding/EditorFolding.ts'
import * as GetAccurateColumnIndex from '../GetAccurateColumnIndex/GetAccurateColumnIndex.ts'

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
    isMonospaceFont,
    letterSpacing,
    lines,
    rowHeight,
    tabSize,
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
  const rowIndex = EditorFolding.getDocumentRowForVisualRow(visualRowIndex, foldingRanges)
  const relativeX = eventX - x + deltaX
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
 * @deprecated this doesn't work for variable width characters (Unicode/emoji).
 * Use position computation in renderer process instead
 *
 * @param {object} editor
 * @param {number} rowIndex
 * @param {number} columnIndex
 * @returns
 */
export const x = (editor: any, rowIndex: number, columnIndex: number) => {
  const { columnWidth, x } = editor
  const offsetX = columnIndex * columnWidth + x
  return offsetX
}

export const y = (editor: any, rowIndex: number) => {
  const { rowHeight, y } = editor
  const offsetY = (rowIndex + 1) * rowHeight + y
  return offsetY
}
