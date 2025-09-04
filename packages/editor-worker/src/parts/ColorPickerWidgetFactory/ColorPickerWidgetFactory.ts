import { WidgetId } from '@lvce-editor/constants'
import type { ColorPickerWidget } from '../ColorPickerWidget/ColorPickerWidget.ts'
import * as Id from '../Id/Id.ts'

export const create = (): ColorPickerWidget => {
  const completionUid = Id.create()
  const widget: ColorPickerWidget = {
    id: WidgetId.ColorPicker,
    oldState: {
      uid: completionUid,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      commands: [],
    },
    newState: {
      uid: completionUid,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      commands: [],
    },
  }
  return widget
}
