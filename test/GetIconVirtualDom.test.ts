import { expect, test } from '@jest/globals'
import * as GetIconVirtualDom from '../src/parts/GetIconVirtualDom/GetIconVirtualDom.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('getIconVirtualDom', () => {
  const dom = GetIconVirtualDom.getIconVirtualDom('Test')
  expect(dom).toEqual({
    type: VirtualDomElements.Div,
    className: 'MaskIcon MaskIconTest',
    role: 'none',
    childCount: 0,
  })
})
