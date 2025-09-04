import type { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'
import * as GetWidgetState from '../GetWidgetState/GetWidgetState.ts'
import { WidgetId } from '@lvce-editor/constants'

export const getFindState = (editor: any): FindWidgetState | undefined => {
  return GetWidgetState.getWidgetState(editor, WidgetId.Find)
}
