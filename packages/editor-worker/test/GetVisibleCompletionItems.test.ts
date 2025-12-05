import { expect, test } from '@jest/globals'
import * as EditorCompletionType from '../src/parts/EditorCompletionType/EditorCompletionType.ts'
import * as GetVisibleCompletionItems from '../src/parts/GetVisibleCompletionItems/GetVisibleCompletionItems.ts'

test('getVisibleCompletionItems', () => {
  const filteredItems = [
    {
      kind: EditorCompletionType.Property,
      label: 'test',
      matches: [10, 0, 1],
      top: 10,
    },
  ]
  const itemHeight = 20
  const leadingWord = 't'
  const minLineY = 0
  const maxLineY = 1
  const focusedIndex = 0
  expect(GetVisibleCompletionItems.getVisibleItems(filteredItems, itemHeight, leadingWord, minLineY, maxLineY, focusedIndex)).toEqual([
    {
      deprecated: 0,
      fileIcon: '',
      focused: true,
      highlights: [0, 1],
      label: 'test',
      symbolName: 'SymbolProperty',
      top: 0,
    },
  ])
})
