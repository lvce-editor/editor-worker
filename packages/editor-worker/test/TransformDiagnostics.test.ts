import { expect, test } from '@jest/globals'
import { transformDiagnostics } from '../src/parts/TransformDiagnostics/TransformDiagnostics.ts'

const diagnostic = {
  columnIndex: 2,
  endColumnIndex: 5,
  endRowIndex: 0,
  message: 'problem',
  rowIndex: 0,
  type: 'error',
  uri: '/test.ts',
}

test('moves diagnostics after inserted text at their start', () => {
  expect(
    transformDiagnostics([diagnostic] as any, [
      {
        deleted: [''],
        end: { columnIndex: 0, rowIndex: 0 },
        inserted: ['// '],
        start: { columnIndex: 0, rowIndex: 0 },
      },
    ]),
  ).toEqual([{ ...diagnostic, columnIndex: 5, endColumnIndex: 8 }])
})

test('keeps diagnostics before an insertion at their end', () => {
  expect(
    transformDiagnostics([diagnostic] as any, [
      {
        deleted: [''],
        end: { columnIndex: 5, rowIndex: 0 },
        inserted: [' suffix'],
        start: { columnIndex: 5, rowIndex: 0 },
      },
    ]),
  ).toEqual([diagnostic])
})

test('moves diagnostic positions across multiline insertions and batched edits', () => {
  const multiline = {
    ...diagnostic,
    columnIndex: 1,
    endColumnIndex: 4,
    endRowIndex: 1,
    rowIndex: 1,
  }
  expect(
    transformDiagnostics([multiline] as any, [
      {
        deleted: [''],
        end: { columnIndex: 0, rowIndex: 0 },
        inserted: ['first', 'inserted'],
        start: { columnIndex: 0, rowIndex: 0 },
      },
      {
        deleted: [''],
        end: { columnIndex: 0, rowIndex: 1 },
        inserted: ['next'],
        start: { columnIndex: 0, rowIndex: 1 },
      },
    ]),
  ).toEqual([{ ...multiline, columnIndex: 5, endColumnIndex: 8, endRowIndex: 2, rowIndex: 2 }])
})

test('drops diagnostics whose reported text is replaced', () => {
  expect(
    transformDiagnostics([diagnostic] as any, [
      {
        deleted: ['ob'],
        end: { columnIndex: 4, rowIndex: 0 },
        inserted: ['new'],
        start: { columnIndex: 2, rowIndex: 0 },
      },
    ]),
  ).toEqual([])
})

test('moves diagnostics back across an inverse edit', () => {
  const insertion = {
    deleted: [''],
    end: { columnIndex: 0, rowIndex: 0 },
    inserted: ['// '],
    start: { columnIndex: 0, rowIndex: 0 },
  }
  const inverse = {
    deleted: ['// '],
    end: { columnIndex: 3, rowIndex: 0 },
    inserted: [''],
    start: { columnIndex: 0, rowIndex: 0 },
  }
  const moved = transformDiagnostics([diagnostic] as any, [insertion])
  expect(transformDiagnostics(moved, [inverse])).toEqual([diagnostic])
})
