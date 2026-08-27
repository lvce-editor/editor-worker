import { afterEach, expect, jest, test } from '@jest/globals'

const setDeltaY = jest.fn(async (editor: any, deltaY: number) => ({ ...editor, deltaY }))
const at = jest.fn(async (_editor: any, _x: number, _y: number) => ({ columnIndex: 0, rowIndex: 2 }))

jest.unstable_mockModule('../src/parts/EditorScrolling/EditorScrolling.ts', () => ({
  setDeltaY,
}))

jest.unstable_mockModule('../src/parts/EditorCommand/EditorCommandPosition.ts', () => ({
  at,
}))

const EditorCommandMoveSelectionPx = await import('../src/parts/EditorCommand/EditorCommandMoveSelectionPx.ts')

afterEach(() => {
  at.mockClear()
  setDeltaY.mockClear()
  jest.restoreAllMocks()
})

const createEditor = (overrides: Record<string, any> = {}) => ({
  deltaY: 0,
  height: 40,
  isSelecting: true,
  isSelectionAutoScrolling: false,
  selectionAnchorPosition: {
    columnIndex: 0,
    rowIndex: 0,
  },
  selectionAutoScrollPointer: {
    x: 0,
    y: 0,
  },
  selections: new Uint32Array([0, 0, 0, 0]),
  uid: 1,
  y: 10,
  ...overrides,
})

test('getSelectionAutoScrollDeltaY - returns zero inside the editor', () => {
  const editor = createEditor()

  expect(EditorCommandMoveSelectionPx.getSelectionAutoScrollDeltaY(editor, 10)).toBe(0)
  expect(EditorCommandMoveSelectionPx.getSelectionAutoScrollDeltaY(editor, 30)).toBe(0)
  expect(EditorCommandMoveSelectionPx.getSelectionAutoScrollDeltaY(editor, 50)).toBe(0)
})

test('getSelectionAutoScrollDeltaY - increases with distance below the editor', () => {
  const editor = createEditor()

  expect(EditorCommandMoveSelectionPx.getSelectionAutoScrollDeltaY(editor, 51)).toBeCloseTo(0.1)
  expect(EditorCommandMoveSelectionPx.getSelectionAutoScrollDeltaY(editor, 100)).toBe(5)
})

test('getSelectionAutoScrollDeltaY - increases with distance above the editor', () => {
  const editor = createEditor()

  expect(EditorCommandMoveSelectionPx.getSelectionAutoScrollDeltaY(editor, 9)).toBeCloseTo(-0.1)
  expect(EditorCommandMoveSelectionPx.getSelectionAutoScrollDeltaY(editor, -40)).toBe(-5)
})

test('moveSelectionPx - starts auto scrolling below the editor', async () => {
  const requestAnimationFrame = jest.fn()
  Object.defineProperty(globalThis, 'requestAnimationFrame', {
    configurable: true,
    value: requestAnimationFrame,
  })
  const editor = createEditor()

  const result = await EditorCommandMoveSelectionPx.moveSelectionPx(editor, 20, 60)

  expect(requestAnimationFrame).toHaveBeenCalledTimes(1)
  expect(result).toMatchObject({
    isSelectionAutoScrolling: true,
    selectionAutoScrollPointer: {
      x: 20,
      y: 60,
    },
  })
  expect(at).toHaveBeenCalledWith(editor, 20, 49)
})

test('moveSelectionPx - updates pointer distance without starting a second loop', async () => {
  const requestAnimationFrame = jest.fn()
  Object.defineProperty(globalThis, 'requestAnimationFrame', {
    configurable: true,
    value: requestAnimationFrame,
  })
  const editor = createEditor({ isSelectionAutoScrolling: true })

  const result = await EditorCommandMoveSelectionPx.moveSelectionPx(editor, 30, 80)

  expect(requestAnimationFrame).not.toHaveBeenCalled()
  expect(result.selectionAutoScrollPointer).toEqual({ x: 30, y: 80 })
})

test('moveSelectionPx - stops auto scrolling when the pointer re-enters', async () => {
  const editor = createEditor({
    isSelectionAutoScrolling: true,
    selectionAutoScrollPointer: { x: 20, y: 60 },
  })

  const result = await EditorCommandMoveSelectionPx.moveSelectionPx(editor, 20, 40)

  expect(result).toMatchObject({
    isSelectionAutoScrolling: false,
    selectionAutoScrollPointer: { x: 0, y: 0 },
  })
})

test('advanceSelectionAutoScroll - scrolls farther per frame for a more distant pointer', async () => {
  const nearbyEditor = createEditor({
    isSelectionAutoScrolling: true,
    selectionAutoScrollPointer: { x: 20, y: 51 },
  })
  const distantEditor = createEditor({
    isSelectionAutoScrolling: true,
    selectionAutoScrollPointer: { x: 20, y: 100 },
  })

  await EditorCommandMoveSelectionPx.advanceSelectionAutoScroll(nearbyEditor)
  await EditorCommandMoveSelectionPx.advanceSelectionAutoScroll(distantEditor)

  expect(setDeltaY).toHaveBeenNthCalledWith(1, nearbyEditor, 0.1)
  expect(setDeltaY).toHaveBeenNthCalledWith(2, distantEditor, 5)
  expect(at).toHaveBeenNthCalledWith(1, expect.objectContaining({ deltaY: 0.1 }), 20, 49)
  expect(at).toHaveBeenNthCalledWith(2, expect.objectContaining({ deltaY: 5 }), 20, 49)
})

test('advanceSelectionAutoScroll - stops at the scroll boundary', async () => {
  const editor = createEditor({
    isSelectionAutoScrolling: true,
    selectionAutoScrollPointer: { x: 20, y: 100 },
  })
  setDeltaY.mockResolvedValueOnce(editor)

  const result = await EditorCommandMoveSelectionPx.advanceSelectionAutoScroll(editor)

  expect(result).toMatchObject({
    isSelectionAutoScrolling: false,
    selectionAutoScrollPointer: { x: 0, y: 0 },
  })
})
