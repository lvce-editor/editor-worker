import { afterEach, expect, jest, test } from '@jest/globals'
import * as EditorCommandMoveSelectionPx from '../src/parts/EditorCommand/EditorCommandMoveSelectionPx.ts'
import * as EditorMoveSelectionAnchorState from '../src/parts/EditorMoveSelectionAnchorState/EditorMoveSelectionAnchorState.ts'

afterEach(() => {
  jest.restoreAllMocks()
})

test('moveSelectionPx - sets selection auto move state when moving outside visible range', async () => {
  const requestAnimationFrame = jest.fn()
  Object.defineProperty(globalThis, 'requestAnimationFrame', {
    configurable: true,
    value: requestAnimationFrame,
  })
  EditorMoveSelectionAnchorState.setPosition({
    columnIndex: 0,
    rowIndex: 0,
  })
  const editor = {
    charWidth: 8,
    deltaX: 0,
    deltaY: 0,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 400,
    hasListener: false,
    isMonospaceFont: true,
    isSelecting: true,
    letterSpacing: 0,
    lines: ['a', 'b', 'c', 'd'],
    maxLineY: 1,
    minLineY: 0,
    rowHeight: 20,
    selectionAutoMovePosition: {
      columnIndex: 0,
      rowIndex: 0,
    },
    selections: new Uint32Array([0, 0, 0, 0]),
    tabSize: 2,
    uid: 1,
    x: 0,
    y: 0,
  }

  const result = await EditorCommandMoveSelectionPx.moveSelectionPx(editor, 0, 60)

  expect(requestAnimationFrame).toHaveBeenCalledTimes(1)
  expect(result).toMatchObject({
    hasListener: true,
    selectionAutoMovePosition: {
      columnIndex: 0,
      rowIndex: 3,
    },
  })
})
