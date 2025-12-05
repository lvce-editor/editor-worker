import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getColorPickerVirtualDom = () => {
  return [
    {
      childCount: 3,
      className: MergeClassNames.mergeClassNames(ClassNames.Viewlet, ClassNames.ColorPicker),
      onPointerDown: DomEventListenerFunctions.HandlePointerDown,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 3,
      className: ClassNames.ColorPickerRectangle,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: ClassNames.ColorPickerBackgroundColor,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: ClassNames.ColorPickerLight,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: ClassNames.ColorPickerDark,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: ClassNames.ColorPickerSlider,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: ClassNames.ColorPickerSliderThumb,
      type: VirtualDomElements.Div,
    },
  ]
}
