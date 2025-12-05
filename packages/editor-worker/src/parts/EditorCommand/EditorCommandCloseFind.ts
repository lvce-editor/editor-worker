import { WidgetId } from '@lvce-editor/constants'
import * as RemoveEditorWidget from '../RemoveEditorWidget/RemoveEditorWidget.ts'

const isMatchingWidget = (widget: any) => {
  return widget.id === WidgetId.Find
}

export const closeFind = (editor: any) => {
  const { widgets } = editor
  const index = widgets.findIndex(isMatchingWidget)
  if (index === -1) {
    return editor
  }
  const newWidgets = RemoveEditorWidget.removeEditorWidget(widgets, WidgetId.Find)
  return {
    ...editor,
    focused: true,
    widgets: newWidgets,
  }
}
