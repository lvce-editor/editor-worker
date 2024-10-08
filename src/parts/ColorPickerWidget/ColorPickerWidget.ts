import type { ColorPickerState } from '../ColorPickerState/ColorPickerState.ts'

export interface ColorPickerWidget {
  readonly id: number | string
  readonly oldState: ColorPickerState
  readonly newState: ColorPickerState
}
