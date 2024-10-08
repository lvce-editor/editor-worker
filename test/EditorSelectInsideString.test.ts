import { expect, test } from '@jest/globals'
import * as EditorSelectInsideString from '../src/parts/EditorCommand/EditorCommandSelectInsideString.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'

test('editorSelectInsideString', () => {
  const editor = {
    lines: ['"line 1"', '"line 2"'],
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  }
  expect(EditorSelectInsideString.selectInsideString(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 1, 0, 7),
  })
})

test('editorSelectInsideString - with selection', () => {
  const editor = {
    lines: ['"line 1"', '"line 2"'],
    selections: EditorSelection.fromRange(0, 0, 0, 1),
  }
  expect(EditorSelectInsideString.selectInsideString(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 0, 0, 1),
  })
})

test('editorSelectInsideString - partial string', () => {
  const editor = {
    lines: ['line 1"'],
    selections: EditorSelection.fromRange(0, 1, 0, 1),
  }
  expect(EditorSelectInsideString.selectInsideString(editor)).toMatchObject({
    selections: EditorSelection.fromRange(0, 1, 0, 6),
  })
})
