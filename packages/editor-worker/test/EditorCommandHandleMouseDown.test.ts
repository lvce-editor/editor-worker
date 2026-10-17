import { expect, test } from '@jest/globals'
import { DragAndDropWorker } from '@lvce-editor/rpc-registry'
import * as EditorCommandHandleMouseDown from '../src/parts/EditorCommand/EditorCommandHandleMouseDown.ts'

const createEditor = () => {
  return {
    charWidth: 8,
    columnWidth: 8,
    cursorWidth: 2,
    deltaX: 0,
    deltaY: 0,
    dragAndDropEnabled: true,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 400,
    halfCursorWidth: 1,
    height: 200,
    hoverEnabled: false,
    isMonospaceFont: true,
    isSelecting: false,
    letterSpacing: 0,
    lineCache: [],
    lineHeight: 20,
    lines: ['hello world'],
    maxLineY: 10,
    minLineY: 0,
    primarySelectionIndex: 0,
    rowHeight: 20,
    rowHeightIncludingMargin: 20,
    selections: new Uint32Array([0, 0, 0, 0]),
    tabSize: 2,
    textDragDropPosition: { columnIndex: 0, rowIndex: 0 },
    textDragId: 0,
    uri: 'file:///workspace/file.txt',
    widgets: [],
    width: 400,
    x: 0,
    y: 0,
  }
}

test('handleMouseDown - single click sets collapsed selection and starts selecting', async () => {
  const editor = createEditor()

  const result = await EditorCommandHandleMouseDown.handleMouseDown(editor as any, 0, false, false, 0, 0, 1)

  expect(result).toMatchObject({
    focused: true,
    isSelecting: true,
    selections: new Uint32Array([0, 0, 0, 0]),
  })
})

test('handleMouseDown - right click inside selection keeps selection unchanged', async () => {
  const editor = {
    ...createEditor(),
    selections: new Uint32Array([0, 0, 0, 5]),
  }

  const result = await EditorCommandHandleMouseDown.handleMouseDown(editor as any, 2, false, false, 24, 0, 1)

  expect(result).toBe(editor)
})

test('handleMouseDown - right click outside selection moves cursor', async () => {
  const editor = {
    ...createEditor(),
    selections: new Uint32Array([0, 0, 0, 5]),
  }

  const result = await EditorCommandHandleMouseDown.handleMouseDown(editor as any, 2, false, false, 80, 0, 1)

  expect(result).toMatchObject({
    focused: true,
    isSelecting: false,
    selections: new Uint32Array([0, 10, 0, 10]),
  })
})

test('handleMouseDown - right click inside reversed selection keeps selection unchanged', async () => {
  const editor = {
    ...createEditor(),
    selections: new Uint32Array([0, 5, 0, 0]),
  }

  const result = await EditorCommandHandleMouseDown.handleMouseDown(editor as any, 2, false, false, 24, 0, 1)

  expect(result).toBe(editor)
})

test('handleMouseDown - double click selects word and starts selecting', async () => {
  const editor = createEditor()

  const result = await EditorCommandHandleMouseDown.handleMouseDown(editor as any, 0, false, false, 0, 0, 2)

  expect(result).toMatchObject({
    isSelecting: true,
    selections: new Uint32Array([0, 0, 0, 5]),
  })
})

test('handleMouseDown - triple click selects line and starts selecting', async () => {
  const editor = createEditor()

  const result = await EditorCommandHandleMouseDown.handleMouseDown(editor as any, 0, false, false, 0, 0, 3)

  expect(result).toMatchObject({
    isSelecting: true,
    selections: new Uint32Array([0, 0, 0, 11]),
  })
})

test('handleMouseDown - unknown detail returns state unchanged', async () => {
  const editor = createEditor()

  const result = await EditorCommandHandleMouseDown.handleMouseDown(editor as any, 0, false, false, 0, 0, 0)

  expect(result).toBe(editor)
})

test('handleMouseDown - Shift click inside a selection starts a text drag session', async () => {
  using mockRpc = DragAndDropWorker.registerMockRpc({
    'DragAndDrop.createTextDrag'() {
      return 42
    },
  })
  const editor = {
    ...createEditor(),
    selections: new Uint32Array([0, 0, 0, 5]),
  }

  const result = await EditorCommandHandleMouseDown.handleMouseDown(editor as any, 0, false, false, 24, 0, 1, true)

  expect(result).toMatchObject({
    isSelecting: false,
    selections: editor.selections,
    textDragDropPosition: { columnIndex: 3, rowIndex: 0 },
    textDragId: 42,
  })
  expect(mockRpc.invocations).toEqual([
    [
      'DragAndDrop.createTextDrag',
      {
        endOffset: 5,
        sourceUri: 'file:///workspace/file.txt',
        startOffset: 0,
        text: 'hello',
      },
    ],
  ])
})

test('handleMouseDown - starting a new text drag discards the previous session', async () => {
  using mockRpc = DragAndDropWorker.registerMockRpc({
    'DragAndDrop.createTextDrag'() {
      return 8
    },
    'DragAndDrop.discardTextDrag'() {},
  })
  const editor = {
    ...createEditor(),
    selections: new Uint32Array([0, 0, 0, 5]),
    textDragId: 7,
  }

  const result = await EditorCommandHandleMouseDown.handleMouseDown(editor as any, 0, false, false, 24, 0, 1, true)

  expect(result.textDragId).toBe(8)
  expect(mockRpc.invocations[0]).toEqual(['DragAndDrop.discardTextDrag', 7])
})

test('handleMouseDown - Shift click outside a selection keeps normal selection behavior', async () => {
  using mockRpc = DragAndDropWorker.registerMockRpc({})
  const editor = {
    ...createEditor(),
    selections: new Uint32Array([0, 0, 0, 5]),
  }

  const result = await EditorCommandHandleMouseDown.handleMouseDown(editor as any, 0, false, false, 80, 0, 1, true)

  expect(result).toMatchObject({
    isSelecting: true,
    selections: new Uint32Array([0, 10, 0, 10]),
    textDragId: 0,
  })
  expect(mockRpc.invocations).toEqual([])
})

test('handleMouseDown - disabled drag and drop keeps normal selection behavior', async () => {
  using mockRpc = DragAndDropWorker.registerMockRpc({})
  const editor = {
    ...createEditor(),
    dragAndDropEnabled: false,
    selections: new Uint32Array([0, 0, 0, 5]),
  }

  const result = await EditorCommandHandleMouseDown.handleMouseDown(editor as any, 0, false, false, 24, 0, 1, true)

  expect(result).toMatchObject({
    isSelecting: true,
    selections: new Uint32Array([0, 3, 0, 3]),
    textDragId: 0,
  })
  expect(mockRpc.invocations).toEqual([])
})
