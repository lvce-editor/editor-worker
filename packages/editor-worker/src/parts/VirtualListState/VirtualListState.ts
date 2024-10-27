import type { Rectangle } from '../Rectangle/Rectangle.ts'

export interface VirtualListState<T> extends Rectangle {
  readonly itemHeight: number
  readonly items: readonly T[]
  readonly height: number
  readonly deltaY: number
  readonly finalDeltaY: number
  readonly headerHeight: number
  readonly minLineY: number
  readonly maxLineY: number
}
