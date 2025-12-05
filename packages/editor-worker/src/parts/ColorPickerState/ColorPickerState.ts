import type { Rectangle } from '../Rectangle/Rectangle.ts'

export interface ColorPickerState extends Rectangle {
  readonly commands: readonly any[]
  readonly uid: number
}
