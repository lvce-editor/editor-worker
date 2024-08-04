import * as EditorCompletionWidget from '../EditorCompletionWidget/EditorCompletionWidget.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const getModule = (id: string) => {
  switch (id) {
    case WidgetId.Completion:
      return EditorCompletionWidget
    default:
      throw new Error('unsupported widget')
  }
}
