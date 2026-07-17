import { expect, test } from '@jest/globals'
import * as EditorCommandReplaceRange from '../src/parts/EditorCommand/EditorCommandReplaceRange.ts'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'
import * as TextDocument from '../src/parts/TextDocument/TextDocument.ts'

test('replaceRange - adjusts later replacements on the same line', () => {
  const editor = {
    lines: ['foo foo', 'foo'],
  }
  const ranges = EditorSelection.fromRanges([0, 3, 0, 0], [0, 4, 0, 7])
  const changes = EditorCommandReplaceRange.replaceRange(editor, ranges, ['X'], 'paste')

  expect(changes).toEqual([
    {
      deleted: ['foo'],
      end: { columnIndex: 3, rowIndex: 0 },
      inserted: ['X'],
      origin: 'paste',
      start: { columnIndex: 0, rowIndex: 0 },
    },
    {
      deleted: ['foo'],
      end: { columnIndex: 5, rowIndex: 0 },
      inserted: ['X'],
      origin: 'paste',
      start: { columnIndex: 2, rowIndex: 0 },
    },
  ])
  expect(TextDocument.applyEdits(editor, changes)).toEqual(['X X', 'foo'])
})
