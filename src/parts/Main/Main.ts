import * as ColorPickerWidget from '../ColorPickerWidget/ColorPickerWidget.ts'
import * as CompletionDetailWidget from '../CompletionDetailWidget/CompletionDetailWidget.ts'
import * as CompletionWidget from '../CompletionWidget/CompletionWidget.ts'
import * as Listen from '../Listen/Listen.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'
import * as WidgetRegistry from '../WidgetRegistry/WidgetRegistry.ts'

export const main = async () => {
  await Listen.listen()
  WidgetRegistry.set(WidgetId.ColorPicker, ColorPickerWidget)
  WidgetRegistry.set(WidgetId.Completion, CompletionWidget)
  WidgetRegistry.set(WidgetId.CompletionDetail, CompletionDetailWidget)
}
