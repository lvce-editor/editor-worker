import type { ColorPickerState } from '../ColorPickerState/ColorPickerState.ts'
import * as ColorPickerWorker from '../ColorPickerWorker/ColorPickerWorker.ts'

export const loadContent = async (state: ColorPickerState, parentUid: number): Promise<ColorPickerState> => {
  const { height, uid, value, width, x, y } = state
  await ColorPickerWorker.invoke('ColorPicker.create', uid, x, y, width, height, parentUid)
  await ColorPickerWorker.invoke('ColorPicker.loadContent', uid, value)
  const diff = await ColorPickerWorker.invoke('ColorPicker.diff2', uid)
  const commands = await ColorPickerWorker.invoke('ColorPicker.render2', uid, diff)
  return {
    ...state,
    commands,
  }
}
