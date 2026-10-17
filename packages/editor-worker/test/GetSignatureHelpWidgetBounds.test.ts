import { expect, test } from '@jest/globals'
import * as GetSignatureHelpWidgetBounds from '../src/parts/GetSignatureHelpWidgetBounds/GetSignatureHelpWidgetBounds.ts'

const editor = {
  columnWidth: 9,
  height: 500,
  rowHeight: 20,
  width: 1024,
  x: 0,
  y: 55,
}

test('positions signature help below the cursor when it fits', () => {
  expect(GetSignatureHelpWidgetBounds.getSignatureHelpWidgetBounds(editor, 4, 20, 1, 60, true)).toEqual({
    height: 98,
    width: 600,
    x: 180,
    y: 155,
  })
})

test('positions signature help above the cursor near the bottom of the editor', () => {
  expect(GetSignatureHelpWidgetBounds.getSignatureHelpWidgetBounds(editor, 23, 20, 1, 60, true)).toEqual({
    height: 98,
    width: 600,
    x: 180,
    y: 417,
  })
})

test('keeps signature help within a narrow editor', () => {
  expect(
    GetSignatureHelpWidgetBounds.getSignatureHelpWidgetBounds(
      {
        ...editor,
        width: 400,
      },
      4,
      50,
      1,
      0,
      false,
    ),
  ).toEqual({
    height: 30,
    width: 400,
    x: 0,
    y: 155,
  })
})

test('keeps tall signature help within the editor', () => {
  expect(
    GetSignatureHelpWidgetBounds.getSignatureHelpWidgetBounds(
      {
        ...editor,
        height: 100,
      },
      4,
      20,
      1,
      300,
      true,
    ),
  ).toEqual({
    height: 100,
    width: 600,
    x: 180,
    y: 55,
  })
})
