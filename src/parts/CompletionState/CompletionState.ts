export interface CompletionState {
  readonly items: any[]
  readonly itemHeight: number
  readonly maxHeight: number
  readonly minLineY: number
  readonly maxLineY: number
  readonly uid: number
  readonly focusedIndex: number
}
