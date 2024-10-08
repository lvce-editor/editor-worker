import type { ColorPickerWidget } from '../ColorPickerWidget/ColorPickerWidget.ts'
import * as ColorPickerWidgetFactory from '../ColorPickerWidgetFactory/ColorPickerWidgetFactory.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as HasWidget from '../HasWidget/HasWidget.ts'
import * as SetAdditionalFocus from '../SetAdditionalFocus/SetAdditionalFocus.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const openColorPicker = async (editor: any) => {
  const { widgets } = editor
  if (HasWidget.hasWidget(widgets, WidgetId.ColorPicker)) {
    return editor
  }
  const colorPickerWidget: ColorPickerWidget = ColorPickerWidgetFactory.create()
  const newWidgets = [...widgets, colorPickerWidget]
  // TODO avoid side effect, apply focus shift during render
  await SetAdditionalFocus.setAdditionalFocus(FocusKey.ColorPicker)
  const newEditor = {
    ...editor,
    widgets: newWidgets,
  }
  // TODO
  return {
    ...newEditor,
  }
}
