import * as EditorSourceActionFocusIndex from '../EditorSourceActionFocusIndex/EditorSourceActionFocusIndex.ts'
import type { SourceActionState } from '../SourceActionState/SourceActionState.ts'

export const focusNext = (state: SourceActionState): SourceActionState => {
  const nextIndex = state.focusedIndex + 1
  return EditorSourceActionFocusIndex.focusIndex(state, nextIndex)
}