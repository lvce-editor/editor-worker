import { expect, test } from '@jest/globals'
import * as EditorCompletionType from '../src/parts/EditorCompletionType/EditorCompletionType.ts'
import * as GetVisibleCompletionItem from '../src/parts/GetVisibleCompletionItem/GetVisibleCompletionItem.ts'

test('getVisibleCompletionItem', () => {
  const visibleItem = {
    kind: EditorCompletionType.Property,
    label: 'test',
    matches: [10, 0, 1],
    top: 10,
  }
  const itemHeight = 20
  const leadingWord = 't'
  const i = 0
  const focusedIndex = 0
  expect(GetVisibleCompletionItem.getVisibleIem(visibleItem, itemHeight, leadingWord, i, focusedIndex)).toEqual({
    deprecated: 0,
    fileIcon: '',
    focused: true,
    highlights: [0, 1],
    label: 'test',
    symbolName: 'SymbolProperty',
    top: 0,
  })
})
