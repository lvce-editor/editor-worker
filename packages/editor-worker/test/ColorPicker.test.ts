import { expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(...args: readonly unknown[]) => Promise<unknown>>(async (method: unknown) => {
  if (method === 'ColorPicker.diff2') {
    return [1]
  }
  if (method === 'ColorPicker.render2') {
    return [['render']]
  }
  return undefined
})

jest.unstable_mockModule('../src/parts/ColorPickerWorker/ColorPickerWorker.ts', () => ({
  invoke,
}))

const ColorPicker = await import('../src/parts/ColorPicker/ColorPicker.ts')

test('loads the picker with the selected editor value', async () => {
  const state = {
    commands: [],
    endOffset: 14,
    height: 200,
    startOffset: 10,
    uid: 42,
    undoStackIndex: 0,
    value: '#0f0',
    width: 300,
    x: 100,
    y: 120,
  }
  const result = await ColorPicker.loadContent(state, 7)
  expect(invoke).toHaveBeenNthCalledWith(1, 'ColorPicker.create', 42, 100, 120, 300, 200, 7)
  expect(invoke).toHaveBeenNthCalledWith(2, 'ColorPicker.loadContent', 42, '#0f0')
  expect(invoke).toHaveBeenNthCalledWith(3, 'ColorPicker.diff2', 42)
  expect(invoke).toHaveBeenNthCalledWith(4, 'ColorPicker.render2', 42, [1])
  expect(result.commands).toEqual([['render']])
})
