import { expect, test } from '@jest/globals'
import type { ISearchFieldButton } from '../src/parts/ISearchFieldButton/ISearchFieldButton.ts'
import * as AriaRoles from '../src/parts/AriaRoles/AriaRoles.ts'
import * as GetSearchFieldButtonVirtualDom from '../src/parts/GetSearchFieldButtonVirtualDom/GetSearchFieldButtonVirtualDom.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('getIconVirtualDom', () => {
  const button: ISearchFieldButton = {
    checked: false,
    icon: 'MaskIconTest',
    title: 'Test',
  }
  const dom = GetSearchFieldButtonVirtualDom.getSearchFieldButtonVirtualDom(button)
  expect(dom).toEqual([
    {
      ariaChecked: false,
      childCount: 1,
      className: 'SearchFieldButton',
      role: AriaRoles.CheckBox,
      tabIndex: 0,
      title: 'Test',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'MaskIcon MaskIconTest',
      type: VirtualDomElements.Div,
    },
  ])
})
