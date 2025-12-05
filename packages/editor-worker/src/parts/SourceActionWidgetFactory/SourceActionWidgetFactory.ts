import { WidgetId } from '@lvce-editor/constants'
import type { SourceActionWidget } from '../SourceActionWidget/SourceActionWidget.ts'
import * as Id from '../Id/Id.ts'

export const create = (): SourceActionWidget => {
  const completionUid = Id.create()
  const widget: SourceActionWidget = {
    id: WidgetId.SourceAction,
    newState: {
      commands: [],
      focusedIndex: 0,
      height: 0,
      maxHeight: 0,
      sourceActions: [],
      uid: completionUid,
      width: 0,
      x: 0,
      y: 0,
    },
    oldState: {
      commands: [],
      focusedIndex: 0,
      height: 0,
      maxHeight: 0,
      sourceActions: [],
      uid: completionUid,
      width: 0,
      x: 0,
      y: 0,
    },
  }
  return widget
}
