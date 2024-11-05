import { type CompletionState } from '../CompletionState/CompletionState.ts'
import * as EditorCompletionFocusIndex from '../EditorCompletionFocusIndex/EditorCompletionFocusIndex.ts'

export const focusNext = (state: CompletionState): CompletionState => {
  const nextIndex = state.focusedIndex + 1
  return EditorCompletionFocusIndex.focusIndex(state, nextIndex)
}
