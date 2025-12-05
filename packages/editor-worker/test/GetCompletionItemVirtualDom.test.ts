import { expect, test } from '@jest/globals'
import * as GetCompletionItemVirtualDom from '../src/parts/GetCompletionItemVirtualDom/GetCompletionItemVirtualDom.ts'

test('focused', () => {
  const visibleItem = {
    deprecated: true,
    fileIcon: '',
    focused: true,
    highlights: [],
    label: 'test',
    symbolName: 'test',
    top: 0,
  }
  expect(GetCompletionItemVirtualDom.getCompletionItemVirtualDom(visibleItem)).toEqual([
    {
      childCount: 2,
      className: 'EditorCompletionItem EditorCompletionItemFocused EditorCompletionItemDeprecated',
      role: 'option',
      top: 0,
      type: 4,
    },
    {
      childCount: 0,
      className: 'ColoredMaskIcon test',
      type: 4,
    },
    {
      childCount: 1,
      className: 'Label',
      type: 4,
    },
    {
      childCount: 0,
      text: 'test',
      type: 12,
    },
  ])
})
