import { CompletionDetailState } from '../CompletionDetailState/CompletionDetailState.ts'
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

  const newestState: CompletionDetailState = {
    ...widget.newState,
    content: 'abc',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  }

  const latestWidgets = [
    ...editor.widgets,
    {
      ...widget,
      newState: newestState,
    },
  ]
  return {
    ...editor,
    widgets: latestWidgets,
  }
}
