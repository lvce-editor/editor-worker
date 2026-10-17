import { beforeEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(method: string, text: string | readonly string[], ...options: readonly unknown[]) => Promise<number | readonly number[]>>()
jest.unstable_mockModule('@lvce-editor/rpc-registry', () => ({ TextMeasurementWorker: { invoke } }))

const { getVisible } = await import('../src/parts/EditorSelection/EditorSelection.ts')
const { updateHorizontalLayout } = await import('../src/parts/UpdateHorizontalLayout/UpdateHorizontalLayout.ts')

const createEditor = (line = 'hello'): any => ({
  charWidth: 3,
  cursorWidth: 2,
  deltaX: 0,
  deltaY: 0,
  focused: true,
  fontFamily: 'proportional',
  fontSize: 14,
  fontWeight: 400,
  isMonospaceFont: false,
  itemHeight: 20,
  letterSpacing: 0,
  lifecycle: { disposed: false },
  lines: [line],
  maxLineY: 1,
  minLineY: 0,
  rowHeight: 20,
  selections: new Uint32Array([0, line.length, 0, line.length]),
  tabSize: 4,
  visibleLineIndices: [0],
  width: 100,
})

beforeEach(() => {
  invoke.mockReset()
  invoke.mockImplementation(async (_method, text) => (typeof text === 'string' ? text.length * 3 : text.map((item) => item.length * 3)))
})

test.each(['hello', '\t👩‍💻é', ''])('reuses the layout measurement at the end of %p', async (line) => {
  const editor = await updateHorizontalLayout(createEditor(line))
  invoke.mockClear()
  const result = await getVisible(editor)
  const normalizedWidth = line.replaceAll('\t', () => ' '.repeat(4)).length * 3
  expect(result.cursorInfos).toEqual(line ? [`${normalizedWidth - 1}px 0px`] : ['0px 0px'])
  expect(invoke).not.toHaveBeenCalled()
})

test('measures a partial line instead of using its full width', async () => {
  const editor = await updateHorizontalLayout(createEditor())
  invoke.mockClear()
  expect((await getVisible({ ...editor, selections: new Uint32Array([0, 2, 0, 2]) })).cursorInfos).toEqual(['5px 0px'])
  expect(invoke).toHaveBeenCalledWith('TextMeasurement.measureTextWidth', 'he', 400, 14, 'proportional', 0, false, 3)
})

test('preserves fractional horizontal scrolling and viewport clipping', async () => {
  const editor = await updateHorizontalLayout(createEditor('hello world'))
  invoke.mockClear()
  expect((await getVisible({ ...editor, deltaX: 4.5, width: 20 })).cursorInfos).toEqual(['20px 0px'])
  expect((await getVisible({ ...editor, deltaX: 14.5, width: 20 })).cursorInfos).toEqual(['17.5px 0px'])
  expect(invoke).not.toHaveBeenCalled()
})

test.each([
  { fontFamily: 'other' },
  { fontSize: 20 },
  { fontWeight: 700 },
  { letterSpacing: 1 },
  { charWidth: 4, isMonospaceFont: true },
  { tabSize: 8 },
  { lifecycle: { disposed: false } },
  { lifecycle: { disposed: true } },
  { lines: ['longer'], selections: new Uint32Array([0, 6, 0, 6]) },
])('does not reuse stale measurements after %p', async (change) => {
  const editor = await updateHorizontalLayout(createEditor())
  invoke.mockClear()
  const changed = { ...editor, ...change }
  const expectedWidth = changed.isMonospaceFont ? 20 : changed.lines[0].length * 3
  expect((await getVisible(changed)).cursorInfos).toEqual([`${expectedWidth - 1}px 0px`])
  expect(invoke).toHaveBeenCalledTimes(changed.isMonospaceFont ? 0 : 1)
})

test('remeasures an edited line once and uses its new width for the cursor', async () => {
  const editor = await updateHorizontalLayout(createEditor())
  invoke.mockClear()
  const changed = await updateHorizontalLayout({ ...editor, lines: ['longer'], selections: new Uint32Array([0, 6, 0, 6]) })
  expect((await getVisible(changed)).cursorInfos).toEqual(['17px 0px'])
  expect(invoke).toHaveBeenCalledTimes(1)
})
