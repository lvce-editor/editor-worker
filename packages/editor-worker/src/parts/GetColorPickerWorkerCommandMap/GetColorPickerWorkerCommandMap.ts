import * as ColorPickerWorkerCallbacks from '../ColorPickerWorkerCallbacks/ColorPickerWorkerCallbacks.ts'

export const getColorPickerWorkerCommandMap = (): Record<string, (...args: readonly any[]) => any> => ({
  'Editor.updateColorPickerValue': ColorPickerWorkerCallbacks.updateColorPickerValue,
})
