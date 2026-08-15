import { WhenExpression, WidgetId } from '@lvce-editor/constants'
import type { ColorPickerState } from '../ColorPickerState/ColorPickerState.ts'
import * as AddWidgetToEditor from '../AddWidgetToEditor/AddWidgetToEditor.ts'
import * as ColorPicker from '../ColorPicker/ColorPicker.ts'
import * as ColorPickerWidgetFactory from '../ColorPickerWidgetFactory/ColorPickerWidgetFactory.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as GetColorPickerBounds from '../GetColorPickerBounds/GetColorPickerBounds.ts'
import * as GetColorPickerRange from '../GetColorPickerRange/GetColorPickerRange.ts'
import * as RemoveEditorWidget from '../RemoveEditorWidget/RemoveEditorWidget.ts'
import * as WidgetRevision from '../WidgetRevision/WidgetRevision.ts'

export { updateColorPickerValue } from '../UpdateColorPickerValue/UpdateColorPickerValue.ts'

const newStateGenerator = (state: ColorPickerState, parentUid: number): Promise<ColorPickerState> => {
  return ColorPicker.loadContent(state, parentUid)
}

export const openColorPicker = async (editor: any) => {
  const fullFocus = true
  const bounds = GetColorPickerBounds.getColorPickerBounds(editor)
  const range = GetColorPickerRange.getColorPickerRange(editor)
  const createWidget = () => ColorPickerWidgetFactory.create(bounds, range, editor.undoStack.length)
  return AddWidgetToEditor.addWidgetToEditor(WidgetId.ColorPicker, FocusKey.ColorPicker, editor, createWidget, newStateGenerator, fullFocus)
}

export const closeColorPicker = (editor: any) => {
  const { widgets } = editor
  const widgetRevision = WidgetRevision.next(editor.uid)
  if (widgets.every((widget: any) => widget.id !== WidgetId.ColorPicker)) {
    return editor
  }
  return {
    ...editor,
    additionalFocus: 0,
    focus: WhenExpression.FocusEditorText,
    focused: true,
    widgetRevision,
    widgets: RemoveEditorWidget.removeEditorWidget(widgets, WidgetId.ColorPicker),
  }
}
