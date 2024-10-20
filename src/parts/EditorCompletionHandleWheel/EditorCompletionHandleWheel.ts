import type { CompletionState } from '../CompletionState/CompletionState.ts'

export const handelWheel = (state: CompletionState, deltaMode: number, deltaY: number): CompletionState => {
  console.log({ deltaMode, deltaY, state })
  // TODO
  return state
}
