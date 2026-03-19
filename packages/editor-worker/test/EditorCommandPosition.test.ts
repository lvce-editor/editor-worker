import { beforeEach, expect, test } from '@jest/globals'
import * as EditorCommandPosition from '../src/parts/EditorCommand/EditorCommandPosition.ts'

beforeEach(() => {
  // @ts-ignore
  globalThis.OffscreenCanvas = class {
    getContext() {
      return {
        measureText(text: string) {
          return {
            width: text.length * 10,
          }
        },
      }
    }
  }
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
