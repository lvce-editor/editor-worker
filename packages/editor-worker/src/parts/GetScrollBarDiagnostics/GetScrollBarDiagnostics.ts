import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'
import type { ScrollBarDiagnostic } from '../ScrollbarDiagnostic/ScrollBarDiagnostic.ts'
import * as EditorViewRows from '../EditorViewRows/EditorViewRows.ts'

export const getScrollBarDiagnostics = (editor: any, diagnostics: readonly Diagnostic[]): readonly ScrollBarDiagnostic[] => {
  const height = editor.height || 0
  const lineCount = Math.max(editor.viewLineIndices?.length || editor.lines?.length || 0, 1)
  const markerHeight = 3
  const scrollBarDecorations: ScrollBarDiagnostic[] = Array.from(diagnostics, (diagnostic) => ({
    height: markerHeight,
    top: Math.min(
      Math.round(
        ((editor.viewLineIndices ? EditorViewRows.getVisualRowForDocumentRow(diagnostic.rowIndex, editor.viewLineIndices) : diagnostic.rowIndex) /
          lineCount) *
          height,
      ),
      Math.max(height - markerHeight, 0),
    ),
    type: diagnostic.type,
  }))
  return scrollBarDecorations
}
