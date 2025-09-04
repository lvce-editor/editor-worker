import type { CompletionDetailState } from '../CompletionDetailState/CompletionDetailState.ts'
import * as GetWidgetState from '../GetWidgetState/GetWidgetState.ts'
import { WidgetId } from '@lvce-editor/constants'

export const getCompletionDetailState = (editor: any): CompletionDetailState | undefined => {
  return GetWidgetState.getWidgetState(editor, WidgetId.CompletionDetail)
}
