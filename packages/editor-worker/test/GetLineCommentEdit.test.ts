import { expect, test } from '@jest/globals'
import * as GetLineCommentEdit from '../src/parts/GetLineCommentEdit/GetLineCommentEdit.ts'

test('add line comment', () => {
  const rowIndex = 0
  const line = ''
  const lineComment = '//'
  expect(GetLineCommentEdit.getLineCommentEdit(rowIndex, line, lineComment)).toEqual({
    deleted: [],
    end: {
      columnIndex: 0,
      rowIndex: 0,
    },
    inserted: ['// '],
    origin: 'lineComment',
    start: {
      columnIndex: 0,
      rowIndex: 0,
    },
  })
})

test('remove line comment', () => {
  const rowIndex = 0
  const line = '//'
  const lineComment = '//'
  expect(GetLineCommentEdit.getLineCommentEdit(rowIndex, line, lineComment)).toEqual({
    deleted: ['//'],
    end: {
      columnIndex: 2,
      rowIndex: 0,
    },
    inserted: [''],
    origin: 'lineComment',
    start: {
      columnIndex: 0,
      rowIndex: 0,
    },
  })
})

test('remove line comment with space', () => {
  const rowIndex = 0
  const line = '// '
  const lineComment = '//'
  expect(GetLineCommentEdit.getLineCommentEdit(rowIndex, line, lineComment)).toEqual({
    deleted: ['// '],
    end: {
      columnIndex: 3,
      rowIndex: 0,
    },
    inserted: [''],
    origin: 'lineComment',
    start: {
      columnIndex: 0,
      rowIndex: 0,
    },
  })
})
