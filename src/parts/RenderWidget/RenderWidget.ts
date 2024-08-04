import * as EditorCompletionWidget from '../EditorCompletionWidget/EditorCompletionWidget.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const addWidget = (widget: any) => {
  const { id } = widget
  switch (id) {
    case WidgetId.Completion:
      return EditorCompletionWidget.add(widget)
    default:
      throw new Error('unsupported widget')
  }
}

export const renderWidget = (widget: any) => {
  const { id } = widget
  switch (id) {
    case WidgetId.Completion:
      return EditorCompletionWidget.render(widget.oldState, widget.newState)
    default:
      throw new Error(`unsupported widget`)
  }
}

export const removeWidget = (widget: any) => {
  const { id } = widget
  switch (id) {
    case WidgetId.Completion:
      return EditorCompletionWidget.remove(widget)
    default:
      throw new Error('unsupported widget')
  }
}
