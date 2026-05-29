import { expect, test } from '@jest/globals'
import * as GetEditorSelectionsVirtualDom from '../src/parts/GetEditorSelectionsVirtualDom/GetEditorSelectionsVirtualDom.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('getEditorSelectionsVirtualDom', () => {
  const dom = GetEditorSelectionsVirtualDom.getEditorSelectionsVirtualDom([1, 2, 3, 4, 5, 6, 7, 8])
  expect(dom[0]).toEqual({
    childCount: 2,
    className: 'Selections',
    type: VirtualDomElements.Div,
  })
  expect(dom.slice(1)).toEqual([
    {
      childCount: 0,
      className: 'EditorSelection',
      height: 4,
      left: 1,
      top: 2,
      type: VirtualDomElements.Div,
      width: 3,
    },
    {
      childCount: 0,
      className: 'EditorSelection',
      height: 8,
      left: 5,
      top: 6,
      type: VirtualDomElements.Div,
      width: 7,
    },
  ])
})
