import { expect, test } from '@jest/globals'
import * as ColorPickerValue from '../src/parts/ColorPickerValue/ColorPickerValue.ts'

test('converts a JavaScript hex color to CSS hex for the picker', () => {
  expect(ColorPickerValue.toColorPickerValue('0x11ff00')).toBe('#11ff00')
  expect(ColorPickerValue.toColorPickerValue('0x000001')).toBe('#000001')
})

test('converts selected picker colors back to JavaScript hex', () => {
  expect(ColorPickerValue.toEditorValue('#00ab01', '0x11ff00')).toBe('0x00ab01')
  const originalValue = '0x11ff00'
  const firstValue = ColorPickerValue.toEditorValue('#00ab01', originalValue)
  expect(ColorPickerValue.toEditorValue('#000001', originalValue)).toBe('0x000001')
  expect(firstValue).toBe('0x00ab01')
})

test('preserves existing non-JavaScript color formats', () => {
  expect(ColorPickerValue.toColorPickerValue('#112233')).toBe('#112233')
  expect(ColorPickerValue.toEditorValue('#00ab01', '#112233')).toBe('#00ab01')
})
