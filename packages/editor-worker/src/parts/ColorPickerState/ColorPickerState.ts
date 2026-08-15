import type { Rectangle } from '../Rectangle/Rectangle.ts'

export interface ColorPickerState extends Rectangle {
  readonly commands: readonly any[]
  readonly endOffset: number
  readonly startOffset: number
  readonly uid: number
  readonly undoStackIndex: number
}
