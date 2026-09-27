import { WidgetId } from '@lvce-editor/constants'
import type { ColorPickerWidget } from '../ColorPickerWidget/ColorPickerWidget.ts'
import type { ColorRange } from '../GetColorPickerRange/GetColorPickerRange.ts'
import type { Rectangle } from '../Rectangle/Rectangle.ts'
import * as Id from '../Id/Id.ts'

export const create = (bounds: Rectangle, range: ColorRange, undoStackIndex: number): ColorPickerWidget => {
  const completionUid = Id.create()
  const state = {
    ...bounds,
    commands: [],
    ...range,
    uid: completionUid,
    undoStackIndex,
  }
  const widget: ColorPickerWidget = {
    id: WidgetId.ColorPicker,
    newState: state,
    oldState: state,
  }
  return widget
}
