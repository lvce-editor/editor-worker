import { expect, test } from '@jest/globals'
import * as GetColorPickerBounds from '../src/parts/GetColorPickerBounds/GetColorPickerBounds.ts'

const editor = {
  columnWidth: 10,
  deltaX: 0,
  deltaY: 0,
  foldingRanges: [],
  height: 600,
  rowHeight: 20,
  selections: new Uint32Array([15, 10, 15, 10]),
  width: 800,
  x: 0,
  y: 60,
}

test('positions the picker above the edited line when space is available', () => {
  expect(GetColorPickerBounds.getColorPickerBounds(editor)).toEqual({
    height: 200,
    width: 300,
    x: 100,
    y: 160,
  })
})

test('positions the picker below the edited line near the top', () => {
  expect(
    GetColorPickerBounds.getColorPickerBounds({
      ...editor,
      selections: new Uint32Array([1, 10, 1, 10]),
    }),
  ).toEqual({
    height: 200,
    width: 300,
    x: 100,
    y: 100,
  })
})

test('accounts for vertical scrolling', () => {
  expect(
    GetColorPickerBounds.getColorPickerBounds({
      ...editor,
      deltaY: 280,
      selections: new Uint32Array([15, 10, 15, 10]),
    }),
  ).toEqual({
    height: 200,
    width: 300,
    x: 100,
    y: 100,
  })
})

test('accounts for folded rows', () => {
  expect(
    GetColorPickerBounds.getColorPickerBounds({
      ...editor,
      foldingRanges: [{ end: 10, start: 2 }],
    }),
  ).toEqual({
    height: 200,
    width: 300,
    x: 100,
    y: 220,
  })
})

test('keeps the picker within the editor horizontally', () => {
  expect(
    GetColorPickerBounds.getColorPickerBounds({
      ...editor,
      deltaX: 20,
      selections: new Uint32Array([15, 100, 15, 100]),
    }),
  ).toEqual({
    height: 200,
    width: 300,
    x: 500,
    y: 160,
  })
})

test('keeps the picker within a small editor', () => {
  expect(
    GetColorPickerBounds.getColorPickerBounds({
      ...editor,
      height: 150,
      selections: new Uint32Array([1, 10, 1, 10]),
      width: 250,
    }),
  ).toEqual({
    height: 150,
    width: 250,
    x: 0,
    y: 60,
  })
})
