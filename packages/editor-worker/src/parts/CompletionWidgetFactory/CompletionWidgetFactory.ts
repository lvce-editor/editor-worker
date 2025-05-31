import type { CompletionWidget } from '../CompletionWidget/CompletionWidget.ts'
import * as Id from '../Id/Id.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const create = (): CompletionWidget => {
  const completionUid = Id.create()
  const completionWidget: CompletionWidget = {
    id: WidgetId.Completion,
    oldState: {
      uid: completionUid,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      commands: [],
    },
    newState: {
      uid: completionUid,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      commands: [],
    },
  }
  return completionWidget
}
