import { expect, test } from '@jest/globals'
import * as GetColorPickerVirtualDom from '../src/parts/GetColorPickerVirtualDom/GetColorPickerVirtualDom.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('getColorPickerVirtualDom', () => {
  const dom = GetColorPickerVirtualDom.getColorPickerVirtualDom()
  expect(dom).toEqual([
    {
      childCount: 3,
      className: 'Viewlet ColorPicker',
      onPointerDown: 'handlePointerDown',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 3,
      className: 'ColorPickerRectangle',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'ColorPickerBackgroundColor',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'ColorPickerLight',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'ColorPickerDark',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'ColorPickerSlider',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'ColorPickerSliderThumb',
      type: VirtualDomElements.Div,
    },
  ])
})
