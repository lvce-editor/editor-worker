import * as Id from '../Id/Id.ts'
import type { SourceActionWidget } from '../SourceActionWidget/SourceActionWidget.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const create = (): SourceActionWidget => {
  const completionUid = Id.create()
  const widget: SourceActionWidget = {
    id: WidgetId.SourceAction,
    oldState: {
      uid: completionUid,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      focusedIndex: 0,
      sourceActions: [],
    },
    newState: {
      uid: completionUid,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      focusedIndex: 0,
      sourceActions: [],
    },
  }
  return widget
}
