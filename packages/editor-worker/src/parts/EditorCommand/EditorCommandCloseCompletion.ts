import { WidgetId } from '@lvce-editor/constants'
import * as RemoveEditorWidget from '../RemoveEditorWidget/RemoveEditorWidget.ts'

export const closeCompletion = (editor: any) => {
  const { widgets } = editor
  if (widgets.every((widget: any) => widget.id !== WidgetId.Completion)) {
    return editor
  }
  return {
    ...editor,
    additionalFocus: 0,
    focused: true,
    widgets: RemoveEditorWidget.removeEditorWidget(widgets, WidgetId.Completion),
  }
}
