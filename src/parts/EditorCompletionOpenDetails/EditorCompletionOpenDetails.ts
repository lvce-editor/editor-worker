import * as CompletionDetailWidgetFactory from '../CompletionDetailWidgetFactory/CompletionDetailWidgetFactory.ts'
import * as GetCompletionDetailState from '../GetCompletionDetailState/GetCompletionDetailState.ts'
import * as GetCompletionState from '../GetCompletionState/GetCompletionState.ts'

export const openDetails = (editor: any) => {
  const child = GetCompletionState.getCompletionState(editor)
  if (!child) {
    return editor
  }
  const detailState = GetCompletionDetailState.getCompletionDetailState(editor)
  if (detailState) {
    return editor
  }
  const widget = CompletionDetailWidgetFactory.create()

  const latestWidgets = [
    ...editor.widgets,
    {
      ...widget,
      newState: {
        ...widget.newState,
        content: 'abc',
      },
    },
  ]
  return {
    ...editor,
    widgets: latestWidgets,
  }
}
