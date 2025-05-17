import type { ColorPickerState } from '../ColorPickerState/ColorPickerState.ts'
import * as ColorPickerWorker from '../ColorPickerWorker/ColorPickerWorker.ts'

export const loadContent = async (state: ColorPickerState, parentUid: number): Promise<ColorPickerState> => {
  const { uid, x, y, width, height } = state

  console.log({ x, y, width, height })
  await ColorPickerWorker.invoke('ColorPicker.create', uid, x, y, width, height, parentUid)
  await ColorPickerWorker.invoke('ColorPicker.loadContent', uid)
  const diff = await ColorPickerWorker.invoke('ColorPicker.diff2', uid)
  const commands = await ColorPickerWorker.invoke('ColorPicker.render2', uid, diff)
  console.log({ commands })
  return {
    ...state,
    commands,
  }
}

export const handleSliderPointerDown = async (state: ColorPickerState, x: number, y: number): Promise<ColorPickerState> => {
  const { uid } = state
  await ColorPickerWorker.invoke('ColorPicker.handleSliderPointerDown', uid, x, y)
  const diff = await ColorPickerWorker.invoke('ColorPicker.diff2', uid)
  const commands = await ColorPickerWorker.invoke('ColorPicker.render2', uid, diff)
  return {
    ...state,
    commands,
  }
}

export const handleSliderPointerMove = async (state: ColorPickerState, x: number, y: number): Promise<ColorPickerState> => {
  const { uid } = state
  await ColorPickerWorker.invoke('ColorPicker.handleSliderPointerMove', uid, x, y)
  const diff = await ColorPickerWorker.invoke('ColorPicker.diff2', uid)
  const commands = await ColorPickerWorker.invoke('ColorPicker.render2', uid, diff)
  return {
    ...state,
    commands,
  }
}
