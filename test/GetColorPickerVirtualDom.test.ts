import { expect, test } from '@jest/globals'
import * as GetColorPickerVirtualDom from '../src/parts/GetColorPickerVirtualDom/GetColorPickerVirtualDom.ts'
import * as VirtualDomElements from '../src/parts/VirtualDomElements/VirtualDomElements.ts'

test('getColorPickerVirtualDom', () => {
  const dom = GetColorPickerVirtualDom.getColorPickerVirtualDom()
  expect(dom).toEqual([
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet ColorPicker',
      onPointerDown: 'handlePointerDown',
      childCount: 3,
    },
    {
      type: VirtualDomElements.Div,
      className: 'ColorPickerRectangle',
      childCount: 3,
    },
    {
      type: VirtualDomElements.Div,
      className: 'ColorPickerBackgroundColor',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'ColorPickerLight',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'ColorPickerDark',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'ColorPickerSlider',
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: 'ColorPickerSliderThumb',
      childCount: 0,
    },
  ])
})
