import { WidgetId } from '@lvce-editor/constants'
import * as WidgetRevision from '../WidgetRevision/WidgetRevision.ts'

const isCompletionDetailWidget = (widget: any) => {
  return widget.id === WidgetId.CompletionDetail
}

export const closeDetails = (editor: any) => {
  const { widgets } = editor
  const widgetRevision = WidgetRevision.next(editor.uid)
  const index = widgets.findIndex(isCompletionDetailWidget)
  if (index === -1) {
    return editor
  }
  const newWidgets = [...widgets.slice(0, index), ...widgets.slice(index + 1)]
  return {
    ...editor,
    widgetRevision,
    widgets: newWidgets,
  }
}
