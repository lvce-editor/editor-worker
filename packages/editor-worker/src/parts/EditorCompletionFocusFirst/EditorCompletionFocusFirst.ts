import type { CompletionState } from '../CompletionState/CompletionState.ts'
import * as EditorCompletionFocusIndex from '../EditorCompletionFocusIndex/EditorCompletionFocusIndex.ts'

export const focusFirst = (state: CompletionState): CompletionState => {
  const firstIndex = 0
  return EditorCompletionFocusIndex.focusIndex(state, firstIndex)
}
