import { WhenExpression, WidgetId } from '@lvce-editor/constants'
import * as RemoveEditorWidget from '../RemoveEditorWidget/RemoveEditorWidget.ts'
import * as WidgetRevision from '../WidgetRevision/WidgetRevision.ts'

const isMatchingWidget = (widget: any) => {
  return widget.id === WidgetId.Find
}

export const closeFind = (editor: any) => {
  const { widgets } = editor
  const widgetRevision = WidgetRevision.next(editor.uid)
  const index = widgets.findIndex(isMatchingWidget)
  if (index === -1) {
    return editor
  }
  const newWidgets = RemoveEditorWidget.removeEditorWidget(widgets, WidgetId.Find)
  return {
    ...editor,
    additionalFocus: 0,
    focus: WhenExpression.FocusEditorText,
    focused: true,
    widgetRevision,
    widgets: newWidgets,
  }
}
