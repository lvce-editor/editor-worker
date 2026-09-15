import { expect, test } from '@jest/globals'
import { getVisible } from '../src/parts/EditorText/EditorText.ts'

const createEditor = (lines: readonly string[]) => ({
  charWidth: 8,
  deltaX: 0,
  largeFile: true,
  lines,
  tabSize: 2,
  visibleLineIndices: [0],
  width: 80,
})

test('renders a bounded plain text viewport without loading a tokenizer', async () => {
  const editor = createEditor(['1234567890'.repeat(100_000)])
  const result = await getVisible(editor, true)
  expect(result).toEqual({ differences: [0], textInfos: [['123456789012', 'Token Text']] })
  expect(editor).not.toHaveProperty('lineCache')
})

test('horizontal scrolling reveals the corresponding text', async () => {
  const editor = { ...createEditor(['0123456789abcdefghijk']), deltaX: 80 }
  expect(await getVisible(editor, false)).toEqual({ differences: [0], textInfos: [['abcdefghijk', 'Token Text']] })
})

test('renders only visible rows and expands tabs in the viewport', async () => {
  const editor = { ...createEditor(['offscreen', '\tabc', 'last']), visibleLineIndices: [1, 2] }
  expect(await getVisible(editor, false)).toEqual({
    differences: [0, 0],
    textInfos: [
      ['  abc', 'Token Text'],
      ['last', 'Token Text'],
    ],
  })
})
