import { WidgetId } from '@lvce-editor/constants'
import type { CompletionWidget } from '../CompletionWidget/CompletionWidget.ts'
import * as Id from '../Id/Id.ts'

export const create = (): CompletionWidget => {
  const completionUid = Id.create()
  const completionWidget: CompletionWidget = {
    id: WidgetId.Completion,
    newState: {
      commands: [],
      height: 0,
      uid: completionUid,
      width: 0,
      x: 0,
      y: 0,
    },
    oldState: {
      commands: [],
      height: 0,
      uid: completionUid,
      width: 0,
      x: 0,
      y: 0,
    },
  }
  return completionWidget
}
