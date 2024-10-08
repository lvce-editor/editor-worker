import * as EditorColorPickerWidget from '../EditorColorPickerWidget/EditorColorPickerWidget.ts'
import * as EditorCompletionDetailWidget from '../EditorCompletionDetailWidget/EditorCompletionDetailWidget.ts'
import * as EditorCompletionWidget from '../EditorCompletionWidget/EditorCompletionWidget.ts'
import * as Listen from '../Listen/Listen.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'
import * as WidgetRegistry from '../WidgetRegistry/WidgetRegistry.ts'

export const main = async () => {
  await Listen.listen()
  WidgetRegistry.set(WidgetId.ColorPicker, EditorColorPickerWidget)
  WidgetRegistry.set(WidgetId.Completion, EditorCompletionWidget)
  WidgetRegistry.set(WidgetId.CompletionDetail, EditorCompletionDetailWidget)
}
