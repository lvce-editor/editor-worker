import * as GetCompletionState from '../GetCompletionState/GetCompletionState.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

const isCompletion = (widget: any) => {
  return widget.id === WidgetId.Completion
}

export const focusIndex = (editor: any, index: number) => {
  const child = GetCompletionState.getCompletionState(editor)
  if (index === -1) {
    return editor
  }
  const childIndex = editor.widgets.findIndex(isCompletion)
  // TODO scroll up/down if necessary
  const childWidget = editor.widgets[childIndex]
  const newWidget = {
    ...childWidget,
    newState: {
      ...child,
      focusedIndex: index,
      focused: true,
    },
  }
  const newWidgets = [...editor.widgets.slice(0, childIndex), newWidget, ...editor.widgets.slice(childIndex + 1)]
  return {
    ...editor,
    widgets: newWidgets,
  }
}
