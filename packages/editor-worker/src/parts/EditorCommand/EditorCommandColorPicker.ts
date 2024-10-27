import * as AddWidgetToEditor from '../AddWidgetToEditor/AddWidgetToEditor.ts'
import * as ColorPicker from '../ColorPicker/ColorPicker.ts'
import type { ColorPickerState } from '../ColorPickerState/ColorPickerState.ts'
import * as ColorPickerWidgetFactory from '../ColorPickerWidgetFactory/ColorPickerWidgetFactory.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

const newStateGenerator = (state: ColorPickerState): ColorPickerState => {
  return ColorPicker.loadContent(state)
}

export const openColorPicker = async (editor: any) => {
  return AddWidgetToEditor.addWidgetToEditor(WidgetId.ColorPicker, FocusKey.ColorPicker, editor, ColorPickerWidgetFactory.create, newStateGenerator)
}
