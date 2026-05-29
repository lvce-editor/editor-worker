import { expect, test } from '@jest/globals'
import * as GetEditorLayersVirtualDom from '../src/parts/GetEditorLayersVirtualDom/GetEditorLayersVirtualDom.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('getEditorLayersVirtualDom', () => {
  const dom = GetEditorLayersVirtualDom.getEditorLayersVirtualDom(
    [1, 2, 3, 4],
    [['x', 'Token X']],
    [0],
    true,
    -1,
    ['1px 2px'],
    [{ height: 10, type: 'error', width: 20, x: 3, y: 4 }],
  )

  expect(dom[0]).toEqual({
    childCount: 4,
    className: 'EditorLayers',
    type: VirtualDomElements.Div,
  })
})
