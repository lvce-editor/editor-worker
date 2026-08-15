import { WidgetId } from '@lvce-editor/constants'
import type { ColorPickerWidget } from '../ColorPickerWidget/ColorPickerWidget.ts'
import * as Id from '../Id/Id.ts'
import type { Rectangle } from '../Rectangle/Rectangle.ts'

export const create = (bounds: Rectangle): ColorPickerWidget => {
  const completionUid = Id.create()
  const state = {
    ...bounds,
    commands: [],
    uid: completionUid,
  }
  const widget: ColorPickerWidget = {
    id: WidgetId.ColorPicker,
    newState: state,
    oldState: state,
  }
  return widget
}
