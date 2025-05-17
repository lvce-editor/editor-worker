import type { Rectangle } from '../Rectangle/Rectangle.ts'

export interface ColorPickerState extends Rectangle {
  readonly uid: number
  readonly commands: readonly any[]
}
