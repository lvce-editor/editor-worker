import { expect, test } from '@jest/globals'
import { getColorPickerWorkerCommandMap } from '../src/parts/GetColorPickerWorkerCommandMap/GetColorPickerWorkerCommandMap.ts'

test('provides editor callbacks to the color picker worker', () => {
  expect(Object.keys(getColorPickerWorkerCommandMap())).toEqual(['Editor.updateColorPickerValue'])
})
