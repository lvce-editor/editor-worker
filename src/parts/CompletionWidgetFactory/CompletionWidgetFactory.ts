import type { CompletionWidget } from '../CompletionWidget/CompletionWidget.ts'
import * as Id from '../Id/Id.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const create = (): CompletionWidget => {
  const completionUid = Id.create()
  const completionWidget: CompletionWidget = {
    id: WidgetId.Completion,
    oldState: {
      items: [],
      itemHeight: 20,
      maxHeight: 150,
      minLineY: 0,
      maxLineY: 0,
      uid: completionUid,
      focusedIndex: -1,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      deltaY: 0,
      finalDeltaY: 0,
      focused: false,
      headerHeight: 0,
    },
    newState: {
      items: [],
      itemHeight: 20,
      maxHeight: 150,
      minLineY: 0,
      maxLineY: 10,
      uid: completionUid,
      focusedIndex: -1,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      deltaY: 0,
      finalDeltaY: 0,
      headerHeight: 0,
      focused: false,
    },
  }
  return completionWidget
}
