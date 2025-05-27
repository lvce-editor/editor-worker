import type { RenameWidget } from '../RenameWidget/RenameWidget.ts'
import * as Id from '../Id/Id.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const create = (): RenameWidget => {
  const completionUid = Id.create()
  const renameWidget: RenameWidget = {
    id: WidgetId.Rename,
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
  return renameWidget
}
