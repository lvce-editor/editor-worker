import type { Rectangle } from '../Rectangle/Rectangle.ts'

export interface ColorPickerState extends Rectangle {
  readonly color: string
  readonly offsetX: number
  readonly max: number
  readonly uid: number
  readonly min: number
}
