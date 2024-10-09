import { expect, test } from '@jest/globals'
import * as AriaRoles from '../src/parts/AriaRoles/AriaRoles.ts'
import * as GetSearchFieldButtonVirtualDom from '../src/parts/GetSearchFieldButtonVirtualDom/GetSearchFieldButtonVirtualDom.ts'
import type { ISearchFieldButton } from '../src/parts/ISearchFieldButton/ISearchFieldButton.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('getIconVirtualDom', () => {
  const button: ISearchFieldButton = {
    icon: 'MaskIconTest',
    checked: false,
    title: 'Test',
  }
  const dom = GetSearchFieldButtonVirtualDom.getSearchFieldButtonVirtualDom(button)
  expect(dom).toEqual([
    {
      type: VirtualDomElements.Div,
      className: `SearchFieldButton `,
      title: 'Test',
      role: AriaRoles.CheckBox,
      ariaChecked: false,
      tabIndex: 0,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: `MaskIcon MaskIconTest`,
      childCount: 0,
    },
  ])
})
