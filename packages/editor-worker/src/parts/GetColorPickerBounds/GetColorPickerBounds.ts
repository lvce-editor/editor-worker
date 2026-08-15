import * as Clamp from '../Clamp/Clamp.ts'
import * as EditorFolding from '../EditorFolding/EditorFolding.ts'

const preferredHeight = 200
const preferredWidth = 300

export const getColorPickerBounds = (editor: any) => {
  const {
    columnWidth,
    deltaX = 0,
    deltaY = 0,
    foldingRanges = [],
    height: editorHeight,
    rowHeight,
    selections,
    width: editorWidth,
    x: editorX,
    y: editorY,
  } = editor
  const rowIndex = selections[0]
  const columnIndex = selections[1]
  const width = Math.min(preferredWidth, editorWidth)
  const height = Math.min(preferredHeight, editorHeight)
  const editorRight = editorX + editorWidth
  const editorBottom = editorY + editorHeight
  const cursorX = editorX + columnIndex * columnWidth - deltaX
  const visualRowIndex = EditorFolding.getVisualRowForDocumentRow(rowIndex, foldingRanges)
  const lineTop = editorY + visualRowIndex * rowHeight - deltaY
  const lineBottom = lineTop + rowHeight
  const yAbove = lineTop - height
  const yBelow = lineBottom
  const preferredY = yAbove >= editorY ? yAbove : yBelow
  return {
    height,
    width,
    x: Clamp.clamp(cursorX, editorX, editorRight - width),
    y: Clamp.clamp(preferredY, editorY, editorBottom - height),
  }
}
