import * as GetCompletionState from '../GetCompletionState/GetCompletionState.ts'

const isCompletion = (widget: any) => {
  return widget.id === 'completion'
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
