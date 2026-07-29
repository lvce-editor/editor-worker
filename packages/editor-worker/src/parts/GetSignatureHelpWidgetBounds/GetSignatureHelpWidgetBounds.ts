import * as Clamp from '../Clamp/Clamp.ts'
import * as EditorPosition from '../EditorCommand/EditorCommandPosition.ts'

const borderHeight = 2
const documentationPaddingHeight = 8
const displayStringLineHeight = 20
const displayStringPaddingHeight = 8
const preferredWidth = 600

const getHeight = (lineCount: number, documentationHeight: number, hasDocumentation: boolean): number => {
  const displayStringHeight = lineCount * displayStringLineHeight + displayStringPaddingHeight
  const fullDocumentationHeight = hasDocumentation ? documentationHeight + documentationPaddingHeight : 0
  return borderHeight + displayStringHeight + fullDocumentationHeight
}

export const getSignatureHelpWidgetBounds = (
  editor: any,
  rowIndex: number,
  columnIndex: number,
  lineCount: number,
  documentationHeight: number,
  hasDocumentation: boolean,
) => {
  const width = Math.min(preferredWidth, editor.width)
  const height = Math.min(getHeight(lineCount, documentationHeight, hasDocumentation), editor.height)
  const cursorX = EditorPosition.x(editor, rowIndex, columnIndex)
  const cursorY = EditorPosition.y(editor, rowIndex)
  const editorRight = editor.x + editor.width
  const editorBottom = editor.y + editor.height
  const x = Clamp.clamp(cursorX, editor.x, editorRight - width)
  const yBelow = cursorY
  const yAbove = cursorY - editor.rowHeight - height
  const preferredY = yBelow + height <= editorBottom ? yBelow : yAbove
  const y = Clamp.clamp(preferredY, editor.y, editorBottom - height)
  return {
    height,
    width,
    x,
    y,
  }
}
