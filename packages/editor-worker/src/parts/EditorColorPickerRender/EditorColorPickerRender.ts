import type { ColorPickerState } from '../ColorPickerState/ColorPickerState.ts'

export const renderFull = (oldState: ColorPickerState, newState: ColorPickerState) => {
  const commands = [...newState.commands]
  // @ts-ignore
  newState.commands = []
  console.log({ commands })
  return commands
}
