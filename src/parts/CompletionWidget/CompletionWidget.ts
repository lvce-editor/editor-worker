import type { CompletionState } from '../CompletionState/CompletionState.ts'

export interface CompletionWidget {
  readonly id: number | string
  readonly oldState: CompletionState
  readonly newState: CompletionState
}
