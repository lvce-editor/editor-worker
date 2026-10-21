import { beforeEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(method: string, text: string, ...args: readonly unknown[]) => Promise<number>>()
jest.unstable_mockModule('@lvce-editor/rpc-registry', () => ({ TextMeasurementWorker: { invoke } }))
const { getX } = await import('../src/parts/GetX/GetX.ts')
const { getAccurateColumnIndex } = await import('../src/parts/GetAccurateColumnIndex/GetAccurateColumnIndex.ts')
const { getVisible } = await import('../src/parts/EditorSelection/EditorSelection.ts')
const { getEditorRowsVirtualDom } = await import('../src/parts/GetEditorRowsVirtualDom/GetEditorRowsVirtualDom.ts')

beforeEach(() => {
  invoke.mockReset()
  invoke.mockImplementation(async (_method, text) => text.length * 10)
})

test('RTL caret and hit testing use actual glyph measurements even in monospace mode', async () => {
  expect(await getX('abcאבגdef', 3, 400, 18, 'Fira Code', true, 0, 2, 1, 100, 20, -10, undefined, true)).toBe(49)
  expect(await getAccurateColumnIndex('abcאבגdef', 400, 18, 'Fira Code', 0, true, 20, 2, 40, true)).toBe(5)
  expect(invoke.mock.calls.every((call) => call[6] === false)).toBe(true)
})

test('partial mixed selections produce positive, separated rectangles and preserve horizontal scrolling', async () => {
  const result = await getVisible({
    charWidth: 20,
    cursorWidth: 2,
    deltaX: 5,
    deltaY: 0,
    focused: true,
    fontFamily: 'Fira Code',
    fontSize: 18,
    fontWeight: 400,
    isMonospaceFont: true,
    itemHeight: 20,
    letterSpacing: 0,
    lines: ['abcאבגdef'],
    maxLineY: 1,
    minLineY: 0,
    rowHeight: 20,
    rtl: true,
    selections: new Uint32Array([0, 1, 0, 4]),
    tabSize: 2,
    visibleLineIndices: [0],
    width: 100,
  })
  expect(result.cursorInfos).toEqual(['44px 0px'])
  expect(result.selectionInfos).toEqual(['4px', '0px', '20px', '20px', '44px', '0px', '10px', '20px'])
})

test('tokenized runs preserve logical text and token styles, including expanded tabs', () => {
  const dom = getEditorRowsVirtualDom(
    [['  abcא', 'Token String', 'בג', 'Token Comment', 'def', 'Token String']],
    [0],
    false,
    -1,
    [],
    [],
    [],
    -1,
    [],
    0,
    100,
    10,
    2,
    ['\tabcאבגdef'],
    500,
    [],
    true,
  )
  const runs = dom.filter((node) => node.className?.includes('EditorBidiRun'))
  expect(runs).toHaveLength(3)
  expect(runs[1]).toMatchObject({ childCount: 2, className: 'EditorBidiRun EditorBidiRunRtl' })
  expect(
    dom
      .filter((node) => node.text !== undefined)
      .map((node) => node.text)
      .join(''),
  ).toBe('  abcאבגdef')
  expect(dom.some((node) => node.className === 'Token Comment')).toBe(true)
})
