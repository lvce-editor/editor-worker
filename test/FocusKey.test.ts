import { expect, test } from '@jest/globals'
import * as FocusKey from '../src/parts/FocusKey/FocusKey.ts'

test('colorPicker', () => {
  expect(FocusKey.ColorPicker).toBe(41)
})

test('editorCompletion', () => {
  expect(FocusKey.EditorCompletion).toBe(9)
})
