import type { EditorState } from '../State/State.ts'
import { clamp } from '../Clamp/Clamp.ts'
import { measureTextWidth } from '../MeasureTextWidth/MeasureTextWidth.ts'

interface WidthCache {
  readonly font: string
  readonly widths: ReadonlyMap<string, number>
}

// Owned by the editor lifecycle, with only the current document's distinct lines retained.
const caches = new WeakMap<object, WidthCache>()

export const updateHorizontalLayout = async (state: EditorState): Promise<EditorState> => {
  const { breakPoints = [], deltaX, gutterDecorations = [], largeFile, lifecycle, lightBulbRowIndex = -1, lineNumbers } = state
  if (largeFile || lifecycle?.disposed) {
    return state
  }
  const { charWidth, fontFamily, fontSize, fontWeight, isMonospaceFont, letterSpacing, lines, tabSize, width } = state
  const font = JSON.stringify([charWidth, fontFamily, fontSize, fontWeight, isMonospaceFont, letterSpacing, tabSize])
  const owner = lifecycle || lines
  const previous = caches.get(owner)
  const previousWidths = previous?.font === font ? previous.widths : undefined
  const widths = new Map<string, number>()
  let longestLineWidth = 0
  for (const line of lines) {
    let measured = widths.get(line) ?? previousWidths?.get(line)
    if (measured === undefined) {
      measured = await measureTextWidth(
        line.replaceAll('\t', () => ' '.repeat(tabSize)),
        fontWeight,
        fontSize,
        fontFamily,
        letterSpacing,
        isMonospaceFont,
        charWidth,
      )
    }
    widths.set(line, measured)
    longestLineWidth = Math.max(longestLineWidth, measured)
  }
  const showGutter = lineNumbers || breakPoints.length > 0 || lightBulbRowIndex >= 0 || gutterDecorations.length > 0
  const gutterText = String(lines.length)
  let gutterWidth = 0
  if (showGutter) {
    const measured =
      widths.get(gutterText) ??
      previousWidths?.get(gutterText) ??
      (await measureTextWidth(gutterText, fontWeight, fontSize, fontFamily, letterSpacing, isMonospaceFont, charWidth))
    widths.set(gutterText, measured)
    gutterWidth = Math.max(30, measured + 1)
  }
  if (lifecycle?.disposed) {
    return state
  }
  caches.set(owner, { font, widths })
  return {
    ...state,
    deltaX: clamp(deltaX, 0, Math.max(0, longestLineWidth - Math.max(0, width - gutterWidth))),
    gutterWidth,
    longestLineWidth,
  }
}
