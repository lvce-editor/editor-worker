import { expect, jest, test } from '@jest/globals'
import { TextMeasurementWorker } from '@lvce-editor/rpc-registry'
import * as EditorText from '../src/parts/EditorText/EditorText.ts'
import { getHorizontalVisibleRangesMeasured } from '../src/parts/GetHorizontalVisibleRange/GetHorizontalVisibleRange.ts'
import * as TokenizerMap from '../src/parts/TokenizerMap/TokenizerMap.ts'
import * as TokenMaps from '../src/parts/TokenMaps/TokenMaps.ts'

const createEditor = (lines: readonly string[], horizontalVirtualizationThreshold = 500): any => {
  const languageId = 'short-line-segmentation'
  TokenizerMap.set(languageId, {
    hasArrayReturn: true,
    initialLineState: { state: 1 },
    tokenizeLine: (line: string) => ({ state: 1, tokens: [1, line.length] }),
  })
  TokenMaps.set(languageId, { 1: 'Text' })
  return {
    charWidth: 1,
    decorations: [],
    deltaX: 0,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 400,
    horizontalVirtualizationThreshold,
    id: 1,
    invalidStartIndex: 0,
    isMonospaceFont: true,
    languageId,
    letterSpacing: 0,
    lineCache: [],
    lines,
    minLineY: 0,
    numberOfVisibleLines: lines.length,
    tabSize: 4,
    tokenizerId: languageId,
    width: 10,
  }
}

const boundaries = (lines: readonly string[]): readonly (readonly number[])[] =>
  lines.map((line) => {
    if (line.startsWith('\t👩‍💻')) return [0, 1, 6, 7]
    if (line.startsWith('👩‍💻')) return Array.from({ length: line.length / 5 + 1 }, (_, index) => index * 5)
    return Array.from({ length: line.length + 1 }, (_, index) => index)
  })

test.each(['hello', '\t👩‍💻é', 'a'.repeat(500)])('renders the complete short line without segmentation RPCs: %p', async (line) => {
  const segment = jest.fn(boundaries)
  using _rpc = TextMeasurementWorker.registerMockRpc({ 'TextMeasurement.getGraphemeSegments': segment })
  const result = await EditorText.getVisible(createEditor([line]), false)
  expect(result.horizontalVisibleRanges).toEqual([{ end: line.length, rowIndex: 0, start: 0 }])
  expect(result.textInfos[0].join('')).toContain(line.replaceAll('\t', () => ' '.repeat(4)))
  expect(segment).not.toHaveBeenCalled()
})

test('uses the configured threshold when deciding whether segmentation is needed', async () => {
  const segment = jest.fn(boundaries)
  using _rpc = TextMeasurementWorker.registerMockRpc({ 'TextMeasurement.getGraphemeSegments': segment })
  await EditorText.getVisible(createEditor(['abcde'], 5), false)
  expect(segment).not.toHaveBeenCalled()
  await EditorText.getVisible(createEditor(['abcdef'], 5), false)
  expect(segment).toHaveBeenCalledWith(['abcdef'])
})

test('preserves worker grapheme boundaries for mixed viewports with long Unicode lines', async () => {
  const segment = jest.fn(boundaries)
  using _rpc = TextMeasurementWorker.registerMockRpc({
    'TextMeasurement.getGraphemeSegments': segment,
    'TextMeasurement.measureTextWidths': (texts: readonly string[]) => texts.map((text) => text.length / 5),
  })
  const line = '👩‍💻'.repeat(120)
  const result = await EditorText.getVisible({ ...createEditor(['short', line]), deltaX: 5 }, false)
  expect(segment).toHaveBeenCalledWith(['short', line])
  const range = result.horizontalVisibleRanges[1]
  expect(range.start % 5).toBe(0)
  expect(range.end % 5).toBe(0)
  expect(result.textInfos[1].join('')).toContain('👩‍💻')
})

test('short-line geometry preserves scrolling without reading grapheme boundaries or measuring prefixes', async () => {
  const measure = jest.fn<(texts: readonly string[]) => Promise<readonly number[]>>()
  const request = {
    averageCharWidth: 1,
    deltaX: 3.5,
    line: '👩‍💻é',
    get segments(): readonly number[] {
      throw new Error('Short lines do not need grapheme boundaries')
    },
    tabSize: 4,
    threshold: 500,
    width: 10,
  }
  await expect(getHorizontalVisibleRangesMeasured([request], measure)).resolves.toEqual([{ difference: -3.5, end: 6, start: 0 }])
  expect(measure).not.toHaveBeenCalled()
})
