import { expect, jest, test } from '@jest/globals'

const measureWidth = jest.fn<(text: string, ...options: readonly any[]) => Promise<number>>()
jest.unstable_mockModule('../src/parts/MeasureTextWidth/MeasureTextWidth.ts', () => ({ measureTextWidth: measureWidth }))
const { updateHorizontalLayout } = await import('../src/parts/UpdateHorizontalLayout/UpdateHorizontalLayout.ts')

const createState = (): any => ({
  charWidth: 1,
  deltaX: 100,
  fontFamily: 'test',
  fontSize: 14,
  fontWeight: 400,
  isMonospaceFont: false,
  letterSpacing: 0,
  lifecycle: { disposed: false },
  lines: ['short', '\t👩‍💻long'],
  tabSize: 4,
  width: 10,
})

test('measures offscreen lines and expanded tabs, then clamps to the document extent', async () => {
  measureWidth.mockImplementation(async (text) => (text.includes('👩‍💻') ? 40 : text.length))
  const state = createState()
  const result = await updateHorizontalLayout(state)
  expect(result).toMatchObject({ deltaX: 30, longestLineWidth: 40 })
  expect(measureWidth).toHaveBeenCalledWith('    👩‍💻long', 400, 14, 'test', 0, false, 1)
})

test('reuses unchanged line widths across edits and remeasures after font changes', async () => {
  measureWidth.mockClear()
  measureWidth.mockImplementation(async (text) => text.length * 2)
  const state = createState()
  await updateHorizontalLayout(state)
  expect(measureWidth).toHaveBeenCalledTimes(2)
  await updateHorizontalLayout({ ...state, lines: [...state.lines, 'new'] })
  expect(measureWidth).toHaveBeenCalledTimes(3)
  const narrowed = await updateHorizontalLayout({ ...state, lines: ['short'], width: 100 })
  expect(narrowed).toMatchObject({ deltaX: 0, longestLineWidth: 10 })
  expect(measureWidth).toHaveBeenCalledTimes(3)
  await updateHorizontalLayout({ ...state, fontSize: 20, lines: ['short'] })
  expect(measureWidth).toHaveBeenCalledTimes(4)
})

test('reserves a measured gutter and clamps against the text viewport', async () => {
  measureWidth.mockImplementation(async (text) => text.length * 10)
  const state = { ...createState(), lineNumbers: true, lines: ['0123456789'], width: 80 }
  expect(await updateHorizontalLayout(state)).toMatchObject({ deltaX: 50, gutterWidth: 30, longestLineWidth: 100 })
})
