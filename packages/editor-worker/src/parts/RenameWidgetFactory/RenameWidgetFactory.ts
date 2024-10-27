import * as Id from '../Id/Id.ts'
import type { RenameWidget } from '../RenameWidget/RenameWidget.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const create = (): RenameWidget => {
  const completionUid = Id.create()
  const renameWidget: RenameWidget = {
    id: WidgetId.Completion,
    oldState: {
      maxHeight: 150,
      uid: completionUid,
      focusedIndex: -1,
      oldValue: '',
      newValue: '',
      focused: false,
    },
    newState: {
      maxHeight: 150,
      uid: completionUid,
      focusedIndex: -1,
      oldValue: '',
      newValue: '',
      focused: false,
    },
  }
  return renameWidget
}