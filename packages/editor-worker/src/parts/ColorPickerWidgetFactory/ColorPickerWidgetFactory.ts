import { WidgetId } from '@lvce-editor/constants'
import type { ColorPickerWidget } from '../ColorPickerWidget/ColorPickerWidget.ts'
import * as Id from '../Id/Id.ts'

export const create = (): ColorPickerWidget => {
  const completionUid = Id.create()
  const widget: ColorPickerWidget = {
    id: WidgetId.ColorPicker,
    newState: {
      commands: [],
      height: 0,
      uid: completionUid,
      width: 0,
      x: 0,
      y: 0,
    },
    oldState: {
      commands: [],
      height: 0,
      uid: completionUid,
      width: 0,
      x: 0,
      y: 0,
    },
  }
  return widget
}
