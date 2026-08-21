import { expect, test } from '@jest/globals'
import { getEditorStatus } from '../src/parts/GetEditorStatus/GetEditorStatus.ts'

test('returns one-based position, indentation, encoding, and language id', () => {
  const editor = {
    endOfLine: 'lf',
    insertSpaces: true,
    languageId: 'typescript',
    primarySelectionIndex: 4,
    selections: new Uint32Array([0, 0, 0, 0, 2, 3, 4, 5]),
    tabSize: 2,
  }

  expect(getEditorStatus(editor as any)).toEqual({
    column: 6,
    encoding: 'utf8',
    endOfLine: 'lf',
    insertSpaces: true,
    languageId: 'typescript',
    line: 5,
    tabSize: 2,
  })
})

test('uses the first position while the editor has no selection', () => {
  const editor = {
    endOfLine: 'crlf',
    insertSpaces: false,
    languageId: 'plaintext',
    primarySelectionIndex: 0,
    selections: new Uint32Array(),
    tabSize: 4,
  }

  expect(getEditorStatus(editor as any)).toEqual({
    column: 1,
    encoding: 'utf8',
    endOfLine: 'crlf',
    insertSpaces: false,
    languageId: 'plaintext',
    line: 1,
    tabSize: 4,
  })
})
