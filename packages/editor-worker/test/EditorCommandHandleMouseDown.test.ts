import { expect, test } from '@jest/globals'
import * as EditorCommandHandleMouseDown from '../src/parts/EditorCommand/EditorCommandHandleMouseDown.ts'

const createEditor = () => {
  return {
    charWidth: 8,
    columnWidth: 8,
    cursorWidth: 2,
    deltaX: 0,
    deltaY: 0,
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
