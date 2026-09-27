import { WidgetId } from '@lvce-editor/constants'
import * as RemoveEditorWidget from '../RemoveEditorWidget/RemoveEditorWidget.ts'
import * as WidgetRevision from '../WidgetRevision/WidgetRevision.ts'

export const closeCompletion = (editor: any) => {
  const { widgets } = editor
  const widgetRevision = WidgetRevision.next(editor.uid)
  if (widgets.every((widget: any) => widget.id !== WidgetId.Completion)) {
    return editor
  }
  return {
    ...editor,
    additionalFocus: 0,
    focused: true,
    widgetRevision,
    widgets: RemoveEditorWidget.removeEditorWidget(widgets, WidgetId.Completion),
  }
}
