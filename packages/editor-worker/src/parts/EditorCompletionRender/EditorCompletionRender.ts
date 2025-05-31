import type { CompletionState } from '../CompletionState/CompletionState.ts'

export const renderCompletion = (oldState: CompletionState, newState: CompletionState) => {
  const commands = [...newState.commands]
  // @ts-ignore
  newState.commands = []
  return commands
}
