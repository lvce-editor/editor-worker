import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

const colorPickerRectangleNode: VirtualDomNode = {
  childCount: 3,
  className: ClassNames.ColorPickerRectangle,
  type: VirtualDomElements.Div,
}

const colorPickerBackgroundColorNode: VirtualDomNode = {
  childCount: 0,
  className: ClassNames.ColorPickerBackgroundColor,
  type: VirtualDomElements.Div,
}

const colorPickerLightNode: VirtualDomNode = {
  childCount: 0,
  className: ClassNames.ColorPickerLight,
  type: VirtualDomElements.Div,
}

const colorPickerDarkNode: VirtualDomNode = {
  childCount: 0,
  className: ClassNames.ColorPickerDark,
  type: VirtualDomElements.Div,
}

const colorPickerSliderNode: VirtualDomNode = {
  childCount: 0,
  className: ClassNames.ColorPickerSlider,
  type: VirtualDomElements.Div,
}

const colorPickerSliderThumbNode: VirtualDomNode = {
  childCount: 0,
  className: ClassNames.ColorPickerSliderThumb,
  type: VirtualDomElements.Div,
}

export const getColorPickerVirtualDom = () => {
  return [
    {
      childCount: 3,
      className: MergeClassNames.mergeClassNames(ClassNames.Viewlet, ClassNames.ColorPicker),
      onPointerDown: DomEventListenerFunctions.HandlePointerDown,
      type: VirtualDomElements.Div,
    },
    colorPickerRectangleNode,
    colorPickerBackgroundColorNode,
    colorPickerLightNode,
    colorPickerDarkNode,
    colorPickerSliderNode,
    colorPickerSliderThumbNode,
  ]
}
