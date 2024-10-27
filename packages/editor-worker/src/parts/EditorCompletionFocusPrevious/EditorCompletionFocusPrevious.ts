import type { CompletionState } from '../CompletionState/CompletionState.ts'
import * as EditorCompletionFocusIndex from '../EditorCompletionFocusIndex/EditorCompletionFocusIndex.ts'

export const focusPrevious = (state: CompletionState): CompletionState => {
  const previousIndex = state.focusedIndex - 1
  return EditorCompletionFocusIndex.focusIndex(state, previousIndex)
}
