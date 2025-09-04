import { WidgetId } from '@lvce-editor/constants'
import type { RenameState } from '../RenameState/RenameState.ts'
import * as GetWidgetState from '../GetWidgetState/GetWidgetState.ts'

export const getRenameState = (editor: any): RenameState | undefined => {
  return GetWidgetState.getWidgetState(editor, WidgetId.Rename)
}
