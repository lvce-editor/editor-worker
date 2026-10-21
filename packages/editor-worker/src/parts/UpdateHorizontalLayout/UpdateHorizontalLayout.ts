import type { EditorState } from '../State/State.ts'
import * as Bidi from '../Bidi/Bidi.ts'
import { clamp } from '../Clamp/Clamp.ts'
import { measureTextWidths } from '../MeasureTextWidth/MeasureTextWidth.ts'

interface WidthCache {
  readonly font: string
  readonly widths: ReadonlyMap<string, number>
}

// Owned by the editor lifecycle, with only the current document's distinct lines retained.
const caches = new WeakMap<object, WidthCache>()

const getFontKey = ({ charWidth, fontFamily, fontSize, fontWeight, isMonospaceFont, letterSpacing, rtl, tabSize }: EditorState): string =>
  JSON.stringify([charWidth, fontFamily, fontSize, fontWeight, isMonospaceFont, letterSpacing, rtl, tabSize])

export const getCachedLineWidth = (state: EditorState, line: string): number | undefined => {
  const { largeFile, lifecycle, lines } = state
  if (largeFile || lifecycle?.disposed) {
    return undefined
  }
  const cache = caches.get(lifecycle || lines)
  return cache?.font === getFontKey(state) ? cache.widths.get(line) : undefined
}

export const updateHorizontalLayout = async (state: EditorState): Promise<EditorState> => {
  const { breakPoints = [], deltaX, gutterDecorations = [], largeFile, lifecycle, lightBulbRowIndex = -1, lineNumbers } = state
  if (largeFile || lifecycle?.disposed) {
    return state
  }
  const { charWidth, fontFamily, fontSize, fontWeight, isMonospaceFont, letterSpacing, lines, rtl, tabSize, width } = state
  const font = getFontKey(state)
  const owner = lifecycle || lines
  const previous = caches.get(owner)
  const previousWidths = previous?.font === font ? previous.widths : undefined
  const widths = new Map<string, number>()
  const textsToMeasure = new Set<string>()
  const textByLine = new Map<string, string>()
  for (const line of lines) {
    const measured = previousWidths?.get(line)
    if (measured !== undefined) {
      widths.set(line, measured)
      continue
    }
    const text = line.replaceAll('\t', () => ' '.repeat(tabSize))
    textByLine.set(line, text)
    textsToMeasure.add(text)
  }
  const showGutter = lineNumbers || breakPoints.length > 0 || lightBulbRowIndex >= 0 || gutterDecorations.length > 0
  const gutterText = String(lines.length)
  if (showGutter && !widths.has(gutterText)) {
    const measured = previousWidths?.get(gutterText)
    if (measured === undefined) {
      textsToMeasure.add(gutterText)
    } else {
      widths.set(gutterText, measured)
    }
  }
  const texts = [...textsToMeasure]
  const regularTexts = texts.filter((text) => !Bidi.isBidi(text, rtl))
  const bidiTexts = texts.filter((text) => Bidi.isBidi(text, rtl))
  const [regularWidths, bidiWidths] = await Promise.all([
    regularTexts.length > 0 ? measureTextWidths(regularTexts, fontWeight, fontSize, fontFamily, letterSpacing, isMonospaceFont, charWidth) : [],
    bidiTexts.length > 0 ? measureTextWidths(bidiTexts, fontWeight, fontSize, fontFamily, letterSpacing, false, charWidth) : [],
  ])
  const measuredByText = new Map([
    ...regularTexts.map((text, index) => [text, regularWidths[index]] as const),
    ...bidiTexts.map((text, index) => [text, bidiWidths[index]] as const),
  ])
  for (const [line, text] of textByLine) {
    widths.set(line, measuredByText.get(text)!)
  }
  if (showGutter && !widths.has(gutterText)) {
    widths.set(gutterText, measuredByText.get(gutterText)!)
  }
  let longestLineWidth = 0
  for (const line of lines) {
    longestLineWidth = Math.max(longestLineWidth, widths.get(line)!)
  }
  if (lifecycle?.disposed) {
    return state
  }
  const gutterWidth = showGutter ? Math.max(30, widths.get(gutterText)! + 1) : 0
  caches.set(owner, { font, widths })
  return {
    ...state,
    deltaX: clamp(deltaX, 0, Math.max(0, longestLineWidth - Math.max(0, width - gutterWidth))),
    gutterWidth,
    longestLineWidth,
  }
}
