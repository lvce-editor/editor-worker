import type { Diagnostic } from '../Diagnostic/Diagnostic.ts'
import * as Assert from '../Assert/Assert.ts'
import * as GetDiagnosticDecoration from '../GetDiagnosticDecoration/GetDiagnosticDecoration.ts'

export const getDiagnosticDecorations = async (editor: any, diagnostics: readonly Diagnostic[]): Promise<readonly any[]> => {
  Assert.object(editor)
  Assert.array(diagnostics)
  const decorations = []
  const { charWidth, cursorWidth, fontFamily, fontSize, fontWeight, isMonospaceFont, letterSpacing, lines, minLineY, rowHeight, tabSize, width } =
    editor
  const averageCharWidth = charWidth
  const halfCursorWidth = cursorWidth / 2
  for (const diagnostic of diagnostics) {
    const decoration = await GetDiagnosticDecoration.getDiagnosticDecoration(
      lines,
      minLineY,
      rowHeight,
      fontWeight,
      fontSize,
      fontFamily,
      isMonospaceFont,
      letterSpacing,
      tabSize,
      halfCursorWidth,
      width,
      averageCharWidth,
      diagnostic,
    )
    decorations.push(decoration)
  }
  return decorations
}
