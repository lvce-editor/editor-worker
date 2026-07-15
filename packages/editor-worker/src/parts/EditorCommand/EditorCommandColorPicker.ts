import { WhenExpression, WidgetId } from '@lvce-editor/constants'
import type { ColorPickerState } from '../ColorPickerState/ColorPickerState.ts'
import * as AddWidgetToEditor from '../AddWidgetToEditor/AddWidgetToEditor.ts'
import * as ColorPicker from '../ColorPicker/ColorPicker.ts'
import * as ColorPickerWidgetFactory from '../ColorPickerWidgetFactory/ColorPickerWidgetFactory.ts'
import * as FocusKey from '../FocusKey/FocusKey.ts'
import * as RemoveEditorWidget from '../RemoveEditorWidget/RemoveEditorWidget.ts'

const newStateGenerator = (state: ColorPickerState, parentUid: number): Promise<ColorPickerState> => {
  return ColorPicker.loadContent(state, parentUid)
}

export const openColorPicker = async (editor: any) => {
  const fullFocus = true
  return AddWidgetToEditor.addWidgetToEditor(
    WidgetId.ColorPicker,
    FocusKey.ColorPicker,
    editor,
    ColorPickerWidgetFactory.create,
    newStateGenerator,
    fullFocus,
  )
}

export const closeColorPicker = (editor: any) => {
  const { widgets } = editor
  if (widgets.every((widget: any) => widget.id !== WidgetId.ColorPicker)) {
    return editor
  }
  return {
    ...editor,
    additionalFocus: 0,
    focus: WhenExpression.FocusEditorText,
    focused: true,
    widgets: RemoveEditorWidget.removeEditorWidget(widgets, WidgetId.ColorPicker),
  }
}
