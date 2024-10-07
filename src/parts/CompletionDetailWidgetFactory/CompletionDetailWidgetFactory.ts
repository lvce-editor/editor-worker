import type { CompletionDetailWidget } from '../CompletionDetailWidget/CompletionDetailWidget.ts'
import * as Id from '../Id/Id.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const create = (): CompletionDetailWidget => {
  const completionUid = Id.create()
  const completionWidget: CompletionDetailWidget = {
    id: WidgetId.Completion,
    oldState: {
      content: '',
      uid: completionUid,
    },
    newState: {
      content: '',
      uid: completionUid,
    },
  }
  return completionWidget
}
