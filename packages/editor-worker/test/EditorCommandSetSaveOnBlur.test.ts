import { expect, test } from '@jest/globals'
import * as EditorCommandSetSaveOnBlur from '../src/parts/EditorCommand/EditorCommandSetSaveOnBlur.ts'

test('setSaveOnBlur - updates save on blur', () => {
  const editor: any = {
    saveOnBlur: true,
  }

  expect(EditorCommandSetSaveOnBlur.setSaveOnBlur(editor, false)).toEqual({
    saveOnBlur: false,
  })
})

test('setSaveOnBlur - returns same editor when value is unchanged', () => {
  const editor: any = {
    saveOnBlur: true,
  }

  expect(EditorCommandSetSaveOnBlur.setSaveOnBlur(editor, true)).toBe(editor)
})

test('setSaveOnBlur - requires boolean value', () => {
  const editor: any = {
    saveOnBlur: true,
  }

  expect(() => EditorCommandSetSaveOnBlur.setSaveOnBlur(editor, 'nope' as any)).toThrow()
})
