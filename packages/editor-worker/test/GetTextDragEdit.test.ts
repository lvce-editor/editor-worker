import { expect, test } from '@jest/globals'
import * as EditOrigin from '../src/parts/EditOrigin/EditOrigin.ts'
import { getTextDragEdit } from '../src/parts/GetTextDragEdit/GetTextDragEdit.ts'

const uri = 'file:///workspace/file.txt'

test('moves text backward on the same line', () => {
  const result = getTextDragEdit(
    { lines: ['alpha beta gamma'] },
    { endOffset: 10, sourceUri: uri, startOffset: 6, text: 'beta' },
    { columnIndex: 0, rowIndex: 0 },
    EditOrigin.EditorTextDrag,
  )

  expect(result).toEqual({
    change: {
      deleted: ['alpha beta'],
      end: { columnIndex: 10, rowIndex: 0 },
      inserted: ['betaalpha '],
      origin: 'editorTextDrag',
      start: { columnIndex: 0, rowIndex: 0 },
    },
    selections: new Uint32Array([0, 0, 0, 4]),
  })
})

test('moves text forward on the same line', () => {
  const result = getTextDragEdit(
    { lines: ['alpha beta gamma'] },
    { endOffset: 5, sourceUri: uri, startOffset: 0, text: 'alpha' },
    { columnIndex: 16, rowIndex: 0 },
    EditOrigin.EditorTextDrag,
  )

  expect(result).toEqual({
    change: {
      deleted: ['alpha beta gamma'],
      end: { columnIndex: 16, rowIndex: 0 },
      inserted: [' beta gammaalpha'],
      origin: 'editorTextDrag',
      start: { columnIndex: 0, rowIndex: 0 },
    },
    selections: new Uint32Array([0, 11, 0, 16]),
  })
})

test('moves a single-line selection across lines', () => {
  const result = getTextDragEdit(
    { lines: ['one', 'two', 'three'] },
    { endOffset: 7, sourceUri: uri, startOffset: 4, text: 'two' },
    { columnIndex: 5, rowIndex: 2 },
    EditOrigin.EditorTextDrag,
  )

  expect(result?.change.inserted).toEqual(['', 'threetwo'])
  expect(result?.selections).toEqual(new Uint32Array([2, 5, 2, 8]))
})

test('moves a multiline selection to the start', () => {
  const result = getTextDragEdit(
    { lines: ['alpha beta', 'gamma omega'] },
    { endOffset: 16, sourceUri: uri, startOffset: 6, text: 'beta\ngamma' },
    { columnIndex: 0, rowIndex: 0 },
    EditOrigin.EditorTextDrag,
  )

  expect(result?.change.inserted).toEqual(['beta', 'gammaalpha '])
  expect(result?.selections).toEqual(new Uint32Array([0, 0, 1, 5]))
})

test.each([
  ['start boundary', 6],
  ['inside selection', 8],
  ['end boundary', 10],
])('dropping on the %s is a no-op', (_name, columnIndex) => {
  expect(
    getTextDragEdit(
      { lines: ['alpha beta gamma'] },
      { endOffset: 10, sourceUri: uri, startOffset: 6, text: 'beta' },
      { columnIndex, rowIndex: 0 },
      EditOrigin.EditorTextDrag,
    ),
  ).toBeUndefined()
})

test('rejects stale source text', () => {
  expect(
    getTextDragEdit(
      { lines: ['alpha changed gamma'] },
      { endOffset: 10, sourceUri: uri, startOffset: 6, text: 'beta' },
      { columnIndex: 0, rowIndex: 0 },
      EditOrigin.EditorTextDrag,
    ),
  ).toBeUndefined()
})

test('rejects an empty source range', () => {
  expect(
    getTextDragEdit(
      { lines: ['alpha'] },
      { endOffset: 2, sourceUri: uri, startOffset: 2, text: '' },
      { columnIndex: 0, rowIndex: 0 },
      EditOrigin.EditorTextDrag,
    ),
  ).toBeUndefined()
})

test('rejects a source range beyond the document', () => {
  expect(
    getTextDragEdit(
      { lines: ['alpha'] },
      { endOffset: 99, sourceUri: uri, startOffset: 0, text: 'alpha' },
      { columnIndex: 5, rowIndex: 0 },
      EditOrigin.EditorTextDrag,
    ),
  ).toBeUndefined()
})
