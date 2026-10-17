import type { EditorState } from '../State/State.ts'
import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as EditorFolding from '../EditorFolding/EditorFolding.ts'
import * as EditorViewRows from '../EditorViewRows/EditorViewRows.ts'
import * as GetX from '../GetX/GetX.ts'
import { mergeClassNames } from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getTextDecorationsVirtualDom = async (editor: EditorState): Promise<readonly VirtualDomNode[]> => {
  const dom: VirtualDomNode[] = []
  const { deltaY, foldingRanges = [], itemHeight, lines, maxLineY, minLineY, rowHeight, textDecorations = [], viewLineIndices } = editor
  const visibleRows = editor.visibleLineIndices || Array.from({ length: Math.max(0, maxLineY - minLineY) }, (_, index) => minLineY + index)
  const getVisualRow = (row: number): number =>
    viewLineIndices ? EditorViewRows.getVisualRowForDocumentRow(row, viewLineIndices) : EditorFolding.getVisualRowForDocumentRow(row, foldingRanges)
  const startVisualRow = itemHeight ? Math.floor(deltaY / itemHeight) : getVisualRow(minLineY)
  for (const [decorationIndex, decoration] of textDecorations.entries()) {
    const { endColumnIndex, endRowIndex, startColumnIndex, startRowIndex, thickness = 2 } = decoration
    const addRow = async (row: number): Promise<void> => {
      if (row < startRowIndex || row > endRowIndex || row >= lines.length) {
        return
      }
      const start = row === startRowIndex ? startColumnIndex : 0
      const end = row === endRowIndex ? endColumnIndex : lines[row].length
      if (end <= start) {
        return
      }
      const getX = (column: number): Promise<number> =>
        GetX.getX(
          lines[row],
          column,
          editor.fontWeight,
          editor.fontSize,
          editor.fontFamily,
          editor.isMonospaceFont,
          editor.letterSpacing,
          editor.tabSize,
          0,
          Infinity,
          editor.charWidth,
          -(editor.deltaX || 0),
        )
      const x = await getX(start)
      const endX = await getX(end)
      const left = Math.max(0, x)
      const right = Math.min(editor.width - (editor.gutterWidth || 0), endX)
      if (right <= left) {
        return
      }
      const top = (getVisualRow(row) - startVisualRow + 1) * rowHeight - thickness
      dom.push({
        childCount: 0,
        className: mergeClassNames('EditorTextDecoration', `EditorTextDecoration${decorationIndex}`),
        height: thickness,
        left,
        top,
        type: VirtualDomElements.Div,
        width: right - left,
      })
    }
    for (const row of visibleRows) {
      await addRow(row)
    }
  }
  return dom
}
