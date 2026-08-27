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
  hasListener: false,
  height: 40,
  isSelecting: true,
  selectionAnchorPosition: {
    columnIndex: 0,
    rowIndex: 0,
  },
  selectionAutoMovePosition: {
    x: 0,
    y: 0,
  },
  selections: new Uint32Array([0, 0, 0, 0]),
  uid: 1,
  y: 10,
  ...overrides,
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
    hasListener: true,
    selectionAutoMovePosition: {
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
  const editor = createEditor({ hasListener: true })

  const result = await EditorCommandMoveSelectionPx.moveSelectionPx(editor, 30, 80)

  expect(requestAnimationFrame).not.toHaveBeenCalled()
  expect(result.selectionAutoMovePosition).toEqual({ x: 30, y: 80 })
})

test('moveSelectionPx - stops auto scrolling when the pointer re-enters', async () => {
  const editor = createEditor({
    hasListener: true,
    selectionAutoMovePosition: { x: 20, y: 60 },
  })

  const result = await EditorCommandMoveSelectionPx.moveSelectionPx(editor, 20, 40)

  expect(result).toMatchObject({
    hasListener: false,
  })
})

test('advanceSelectionAutoScroll - scrolls farther per frame for a more distant pointer', async () => {
  const nearbyEditor = createEditor({
    hasListener: true,
    selectionAutoMovePosition: { x: 20, y: 51 },
  })
  const distantEditor = createEditor({
    hasListener: true,
    selectionAutoMovePosition: { x: 20, y: 100 },
  })

  await EditorCommandMoveSelectionPx.advanceSelectionAutoScroll(nearbyEditor)
  await EditorCommandMoveSelectionPx.advanceSelectionAutoScroll(distantEditor)

  expect(setDeltaY).toHaveBeenNthCalledWith(1, nearbyEditor, 0.1)
  expect(setDeltaY).toHaveBeenNthCalledWith(2, distantEditor, 5)
  expect(at).toHaveBeenNthCalledWith(1, expect.objectContaining({ deltaY: 0.1 }), 20, 49)
  expect(at).toHaveBeenNthCalledWith(2, expect.objectContaining({ deltaY: 5 }), 20, 49)
})

test('advanceSelectionAutoScroll - scrolls upward above the editor', async () => {
  const editor = createEditor({
    deltaY: 20,
    hasListener: true,
    selectionAutoMovePosition: { x: 20, y: 0 },
  })

  await EditorCommandMoveSelectionPx.advanceSelectionAutoScroll(editor)

  expect(setDeltaY).toHaveBeenCalledWith(editor, 19)
  expect(at).toHaveBeenCalledWith(expect.objectContaining({ deltaY: 19 }), 20, 10)
})

test('advanceSelectionAutoScroll - stops at the scroll boundary', async () => {
  const editor = createEditor({
    hasListener: true,
    selectionAutoMovePosition: { x: 20, y: 100 },
  })
  setDeltaY.mockResolvedValueOnce(editor)

  const result = await EditorCommandMoveSelectionPx.advanceSelectionAutoScroll(editor)

  expect(result).toMatchObject({
    hasListener: false,
  })
})
