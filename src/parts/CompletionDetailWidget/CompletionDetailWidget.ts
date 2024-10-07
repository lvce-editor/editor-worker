import type { CompletionDetailState } from '../CompletionDetailState/CompletionDetailState.ts'

export interface CompletionDetailWidget {
  readonly id: number | string
  readonly oldState: CompletionDetailState
  readonly newState: CompletionDetailState
}
