import type { Rectangle } from '../Rectangle/Rectangle.ts'

export interface VirtualListState<T> extends Rectangle {
  readonly deltaY: number
  readonly finalDeltaY: number
  readonly headerHeight: number
  readonly height: number
  readonly itemHeight: number
  readonly items: readonly T[]
  readonly maxLineY: number
  readonly minLineY: number
}
