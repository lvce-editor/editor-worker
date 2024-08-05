import * as EditorCompletionWidget from '../EditorCompletionWidget/EditorCompletionWidget.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'
import * as WidgetModules from '../WidgetModules/WidgetModules.ts'

export const getModule = (id: string) => {
  return WidgetModules.get(id)
  switch (id) {
    case WidgetId.Completion:
      return EditorCompletionWidget
    default:
      throw new Error('unsupported widget')
  }
}
