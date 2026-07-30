import { WidgetId } from '@lvce-editor/constants'
import * as RemoveEditorWidget from '../RemoveEditorWidget/RemoveEditorWidget.ts'
import * as WidgetRevision from '../WidgetRevision/WidgetRevision.ts'

const isMatchingWidget = (widget: any) => {
  return widget.id === WidgetId.CodeGenerator
}

export const closeCodeGenerator = (editor: any) => {
  const { widgets } = editor
  WidgetRevision.next(editor.uid)
  const index = widgets.findIndex(isMatchingWidget)
  if (index === -1) {
    return editor
  }
  const newWidgets = RemoveEditorWidget.removeEditorWidget(widgets, WidgetId.CodeGenerator)
  return {
    ...editor,
    focused: true,
    widgets: newWidgets,
  }
}
