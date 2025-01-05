import type { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'
import * as FindWidgetRefreshWithEditor from '../FindWidgetRefreshWithEditor/FindWidgetRefreshWithEditor.ts'
import * as GetEditor from '../GetEditor/GetEditor.ts'

export const refresh = (state: FindWidgetState, value = state.value): FindWidgetState => {
  // TODO get focused editor
  const { editorUid } = state
  // highlight locations that match value
  const editor = GetEditor.getEditor(editorUid)
  return FindWidgetRefreshWithEditor.refresh(editor, state, value)
}
