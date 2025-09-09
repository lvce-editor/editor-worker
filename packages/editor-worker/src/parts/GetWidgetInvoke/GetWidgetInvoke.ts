import { WidgetId } from '@lvce-editor/constants'
import * as ColorPickerWorker from '../ColorPickerWorker/ColorPickerWorker.ts'
import * as CompletionWorker from '../CompletionWorker/CompletionWorker.ts'
import * as FindWidgetWorker from '../FindWidgetWorker/FindWidgetWorker.ts'
import * as HoverWorker from '../HoverWorker/HoverWorker.ts'
import * as RenameWorker from '../RenameWorker/RenameWorker.ts'
import * as SourceActionWorker from '../SourceActionWorker/SourceActionWorker.ts'

export const getWidgetInvoke = (widgetId: number): any => {
  switch (widgetId) {
    case WidgetId.ColorPicker:
      return ColorPickerWorker.invoke
    case WidgetId.Completion:
      return CompletionWorker.invoke
    case WidgetId.Find:
      return FindWidgetWorker.invoke
    case WidgetId.Rename:
      return RenameWorker.invoke
    case WidgetId.SourceAction:
      return SourceActionWorker.invoke
    case WidgetId.Hover:
      return HoverWorker.invoke
    default:
      return undefined
  }
}
