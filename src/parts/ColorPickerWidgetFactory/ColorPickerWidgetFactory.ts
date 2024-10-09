import type { ColorPickerWidget } from '../ColorPickerWidget/ColorPickerWidget.ts'
import * as Id from '../Id/Id.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const create = (): ColorPickerWidget => {
  const completionUid = Id.create()
  const widget: ColorPickerWidget = {
    id: WidgetId.ColorPicker,
    oldState: {
      color: '',
      offsetX: 0,
      min: 0,
      max: 0,
      uid: completionUid,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
    newState: {
      color: '',
      offsetX: 0,
      min: 0,
      max: 0,
      uid: completionUid,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
  }
  return widget
}
