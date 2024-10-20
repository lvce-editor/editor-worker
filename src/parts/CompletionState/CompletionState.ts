import type { VirtualListState } from '../VirtualListState/VirtualListState.ts'

export interface CompletionState extends VirtualListState<any> {
  readonly maxHeight: number
  readonly uid: number
  readonly focusedIndex: number
}
