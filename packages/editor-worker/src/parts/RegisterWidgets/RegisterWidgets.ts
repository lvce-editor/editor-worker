import { WidgetId } from '@lvce-editor/constants'
import * as EditorCodeGeneratorWidget from '../EditorCodeGeneratorWidget/EditorCodeGeneratorWidget.ts'
import * as EditorColorPickerWidget from '../EditorColorPickerWidget/EditorColorPickerWidget.ts'
import * as EditorCompletionDetailWidget from '../EditorCompletionDetailWidget/EditorCompletionDetailWidget.ts'
import * as EditorCompletionWidget from '../EditorCompletionWidget/EditorCompletionWidget.ts'
import * as EditorFindWidget from '../EditorFindWidget/EditorFindWidget.ts'
import * as EditorHoverWidget from '../EditorHoverWidget/EditorHoverWidget.ts'
import * as EditorRenameWidget from '../EditorRenameWidget/EditorRenameWidget.ts'
import * as EditorSourceActionWidget from '../EditorSourceActionWidget/EditorSourceActionWidget.ts'
import * as WidgetRegistry from '../WidgetRegistry/WidgetRegistry.ts'

export const registerWidgets = () => {
  WidgetRegistry.set(WidgetId.ColorPicker, EditorColorPickerWidget)
  WidgetRegistry.set(WidgetId.Completion, EditorCompletionWidget)
  WidgetRegistry.set(WidgetId.CompletionDetail, EditorCompletionDetailWidget)
  WidgetRegistry.set(WidgetId.Find, EditorFindWidget)
  WidgetRegistry.set(WidgetId.Hover, EditorHoverWidget)
  WidgetRegistry.set(WidgetId.Rename, EditorRenameWidget)
  WidgetRegistry.set(WidgetId.SourceAction, EditorSourceActionWidget)
  WidgetRegistry.set(WidgetId.CodeGenerator, EditorCodeGeneratorWidget)
}
