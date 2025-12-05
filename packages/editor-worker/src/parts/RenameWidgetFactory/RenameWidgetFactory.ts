import { WidgetId } from '@lvce-editor/constants'
import type { RenameWidget } from '../RenameWidget/RenameWidget.ts'
import * as Id from '../Id/Id.ts'

export const create = (): RenameWidget => {
  const completionUid = Id.create()
  const renameWidget: RenameWidget = {
    id: WidgetId.Rename,
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
  return renameWidget
}
