import type { SourceActionState } from '../SourceActionState/SourceActionState.ts'

export const focusIndex = (state: SourceActionState, index: number): SourceActionState => {
  const newState: SourceActionState = {
    ...state,
    focusedIndex: index,
  }
  return newState
}
