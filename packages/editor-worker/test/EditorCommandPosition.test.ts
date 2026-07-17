import { beforeEach, expect, test } from '@jest/globals'
import * as EditorCommandPosition from '../src/parts/EditorCommand/EditorCommandPosition.ts'

beforeEach(() => {
  Object.defineProperty(globalThis, 'OffscreenCanvas', {
    configurable: true,
    value: class {
      getContext() {
        return {
          measureText: (text: string) => ({
            width: text.length * 10,
          }),
        }
      }
    },
  })
})

test('at - accounts for editor x and deltaX', async () => {
  const editor = {
    charWidth: 10,
    deltaX: 30,
    deltaY: 0,
    differences: [0],
    fontFamily: 'test',
    fontSize: 16,
    fontWeight: 400,
    isMonospaceFont: true,
    letterSpacing: 0,
    lines: ['abcdef'],
    rowHeight: 20,
    tabSize: 2,
    x: 100,
    y: 50,
  }
  const position = await EditorCommandPosition.at(editor, 120, 55)
  expect(position).toEqual({
    columnIndex: 5,
    rowIndex: 0,
  })
})

test('at - maps a visual row after a folded range to its document row', async () => {
  const editor = {
    charWidth: 10,
    deltaX: 0,
    deltaY: 0,
    differences: [0, 0],
    foldingRanges: [{ end: 3, start: 0 }],
    fontFamily: 'test',
    fontSize: 16,
    fontWeight: 400,
    isMonospaceFont: true,
    letterSpacing: 0,
    lines: ['function run() {', '  first()', '  second()', '}', 'after()'],
    rowHeight: 20,
    tabSize: 2,
    x: 0,
    y: 0,
  }
  const position = await EditorCommandPosition.at(editor, 10, 25)
  expect(position).toEqual({
    columnIndex: 1,
    rowIndex: 4,
  })
})
