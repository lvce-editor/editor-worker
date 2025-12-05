import { expect, test } from '@jest/globals'
import * as GetCompletionItemIconVirtualDom from '../src/parts/GetCompletionItemIconVirtualDom/GetCompletionItemIconVirtualDom.ts'

test('getIconDom - symbol - default', () => {
  const fileIcon = ''
  const symbolName = 'SymbolDefault'
  expect(GetCompletionItemIconVirtualDom.getIconDom(fileIcon, symbolName)).toEqual({
    childCount: 0,
    className: 'ColoredMaskIcon SymbolDefault',
    type: 4,
  })
})

test('getIconDom - fileIcon', () => {
  const fileIcon = '/test/xyz.svg'
  const symbolName = ''
  expect(GetCompletionItemIconVirtualDom.getIconDom(fileIcon, symbolName)).toEqual({
    childCount: 0,
    className: 'FileIcon',
    role: 'none',
    src: '/test/xyz.svg',
    type: 17,
  })
})
