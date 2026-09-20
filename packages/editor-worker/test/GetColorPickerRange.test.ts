import { expect, test } from '@jest/globals'
import * as EditorSelection from '../src/parts/EditorSelection/EditorSelection.ts'
import * as GetColorPickerRange from '../src/parts/GetColorPickerRange/GetColorPickerRange.ts'

test('finds a short hex color under the cursor', () => {
  const editor = {
    lines: ['x', '  color: #000;'],
    selections: EditorSelection.fromRange(1, 11, 1, 11),
  }
  expect(GetColorPickerRange.getColorPickerRange(editor)).toEqual({ endOffset: 15, startOffset: 11, value: '#000' })
})

test('finds a functional color under the cursor', () => {
  const editor = {
    lines: ['color: hsl(240, 100%, 50%);'],
    selections: EditorSelection.fromRange(0, 15, 0, 15),
  }
  expect(GetColorPickerRange.getColorPickerRange(editor)).toEqual({ endOffset: 26, startOffset: 7, value: 'hsl(240, 100%, 50%)' })
})

test('finds a named color under the cursor', () => {
  const editor = {
    lines: ['color: orange; background: blue;'],
    selections: EditorSelection.fromRange(0, 10, 0, 10),
  }
  expect(GetColorPickerRange.getColorPickerRange(editor)).toEqual({ endOffset: 13, startOffset: 7, value: 'orange' })
})

test('finds a mixed-case named color under the cursor', () => {
  const editor = {
    lines: ['color: ReBeccAPurple;'],
    selections: EditorSelection.fromRange(0, 12, 0, 12),
  }
  expect(GetColorPickerRange.getColorPickerRange(editor)).toEqual({ endOffset: 20, startOffset: 7, value: 'ReBeccAPurple' })
})

test('does not find a named color inside an identifier', () => {
  const editor = {
    lines: ['--orange-color: 1;'],
    selections: EditorSelection.fromRange(0, 4, 0, 4),
  }
  expect(GetColorPickerRange.getColorPickerRange(editor)).toEqual({ endOffset: -1, startOffset: -1, value: '' })
})

test('uses a non-empty single-line selection', () => {
  const editor = {
    lines: ['color: rgba(1, 2, 3, 0.5);'],
    selections: EditorSelection.fromRange(0, 7, 0, 25),
  }
  expect(GetColorPickerRange.getColorPickerRange(editor)).toEqual({ endOffset: 25, startOffset: 7, value: 'rgba(1, 2, 3, 0.5)' })
})

test('returns no range when the cursor is outside a color', () => {
  const editor = {
    lines: ['color: #000;'],
    selections: EditorSelection.fromRange(0, 2, 0, 2),
  }
  expect(GetColorPickerRange.getColorPickerRange(editor)).toEqual({ endOffset: -1, startOffset: -1, value: '' })
})

test('returns no range for a multi-line selection', () => {
  const editor = {
    lines: ['color:', '#000'],
    selections: EditorSelection.fromRange(0, 2, 1, 2),
  }
  expect(GetColorPickerRange.getColorPickerRange(editor)).toEqual({ endOffset: -1, startOffset: -1, value: '' })
})
