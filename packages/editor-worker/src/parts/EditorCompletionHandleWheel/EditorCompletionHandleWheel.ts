import type { CompletionState } from '../CompletionState/CompletionState.ts'
import * as HandleWheel from '../HandleWheel/HandleWheel.ts'

export const handleWheel = (state: CompletionState, deltaMode: number, deltaY: number): CompletionState => {
  const newState: CompletionState = HandleWheel.handleWheel(state, deltaMode, deltaY)
  return newState
}
