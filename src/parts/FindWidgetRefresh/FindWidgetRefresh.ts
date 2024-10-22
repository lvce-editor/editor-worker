import * as FindMatchesCaseInsensitive from '../FindMatchesCaseInsensitive/FindMatchesCaseInsensitive.ts'
import type { FindWidgetState } from '../FindWidgetState/FindWidgetState.ts'
import * as GetEditor from '../GetEditor/GetEditor.ts'
import * as GetMatchCount from '../GetMatchCount/GetMatchCount.ts'

export const refresh = (state: FindWidgetState, value = state.value): FindWidgetState => {
  // TODO get focused editor
  const { editorUid } = state
  // highlight locations that match value
  const editor = GetEditor.getEditor(editorUid)
  const { lines } = editor
  const matches = FindMatchesCaseInsensitive.findMatchesCaseInsensitive(lines, value)
  const matchCount = GetMatchCount.getMatchCount(matches)
  return {
    ...state,
    matches,
    matchIndex: 0,
    matchCount,
    value,
  }
}
