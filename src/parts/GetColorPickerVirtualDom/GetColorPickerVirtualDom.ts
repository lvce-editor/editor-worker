import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getColorPickerVirtualDom = () => {
  return [
    {
      type: VirtualDomElements.Div,
      className: MergeClassNames.mergeClassNames(ClassNames.Viewlet, ClassNames.ColorPicker),
      onPointerDown: DomEventListenerFunctions.HandlePointerDown,
      childCount: 3,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ColorPickerRectangle,
      childCount: 3,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ColorPickerBackgroundColor,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ColorPickerLight,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ColorPickerDark,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ColorPickerSlider,
      childCount: 0,
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ColorPickerSliderThumb,
      childCount: 0,
    },
  ]
}
