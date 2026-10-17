import { expect, test } from '@jest/globals'
import { getScrollBarDiagnostics } from '../src/parts/GetScrollBarDiagnostics/GetScrollBarDiagnostics.ts'

test('returns one severity-preserving marker per diagnostic', () => {
  const editor = {
    height: 100,
    lines: ['one', 'two', 'three', 'four'],
  }
  const diagnostics = [
    { rowIndex: 1, type: 'warning' },
    { rowIndex: 3, type: 'error' },
  ]

  expect(getScrollBarDiagnostics(editor, diagnostics as any)).toEqual([
    { height: 3, top: 25, type: 'warning' },
    { height: 3, top: 75, type: 'error' },
  ])
})

test('returns no markers when there are no diagnostics', () => {
  expect(getScrollBarDiagnostics({ height: 100, lines: ['one'] }, [])).toEqual([])
})

test('positions markers when the editor content does not need a scrollbar', () => {
  const editor = {
    height: 400,
    lines: ['one', 'two', 'three'],
  }

  expect(getScrollBarDiagnostics(editor, [{ rowIndex: 1, type: 'error' }] as any)).toEqual([{ height: 3, top: 133, type: 'error' }])
})

test('keeps an out-of-range marker inside the diagnostic track', () => {
  const editor = {
    height: 100,
    lines: ['one', 'two'],
  }

  expect(getScrollBarDiagnostics(editor, [{ rowIndex: 2, type: 'error' }] as any)).toEqual([{ height: 3, top: 97, type: 'error' }])
})

test('supports diagnostics while an empty document is loading', () => {
  const editor = {
    height: 100,
    lines: [],
  }

  expect(getScrollBarDiagnostics(editor, [{ rowIndex: 0, type: 'warning' }] as any)).toEqual([{ height: 3, top: 0, type: 'warning' }])
})
