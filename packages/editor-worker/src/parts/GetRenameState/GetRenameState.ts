import type { RenameState } from '../RenameState/RenameState.ts'
import * as GetWidgetState from '../GetWidgetState/GetWidgetState.ts'
import * as WidgetId from '../WidgetId/WidgetId.ts'

export const getRenameState = (editor: any): RenameState | undefined => {
  return GetWidgetState.getWidgetState(editor, WidgetId.Rename)
}
