export interface VirtualListState<T> {
  readonly itemHeight: number
  readonly items: readonly T[]
  readonly height: number
  readonly deltaY: number
  readonly finalDeltaY: number
  readonly headerHeight: number
  readonly minLineY: number
  readonly maxLineY: number
}
