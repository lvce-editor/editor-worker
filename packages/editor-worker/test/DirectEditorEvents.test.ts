import { beforeEach, expect, jest, test } from '@jest/globals'
import type { EditorState } from '../src/parts/State/State.ts'

const invoke = jest.fn<(...args: readonly unknown[]) => Promise<unknown>>()
jest.unstable_mockModule('@lvce-editor/rpc-registry', () => ({ RendererWorker: { invoke } }))
const Events = await import('../src/parts/DirectEditorEvents/DirectEditorEvents.ts')
const Editors = await import('../src/parts/EditorStates/EditorStates.ts')

beforeEach(() => {
  jest.clearAllMocks()
  invoke.mockResolvedValue(undefined)
  const editor = { lifecycle: { disposed: false }, uid: 101 } as EditorState
  Editors.set(101, editor, editor)
})

test('executes input in the editor worker before requesting a foreground render', async () => {
  const order: string[] = []
  const input = jest.fn(async (..._args: readonly unknown[]) => {
    order.push('input')
  })
  invoke.mockImplementation(async () => {
    order.push('render')
  })
  const events = Events.createCommandMap({ 'Editor.handleBeforeInput': input })
  await events['Viewlet.executeViewletCommand'](101, 'handleBeforeInput', 'insertText', 'a')
  expect(input).toHaveBeenCalledWith(101, 'insertText', 'a')
  expect(invoke).toHaveBeenCalledWith('Viewlet.requestRender', 101, false)
  expect(order).toEqual(['input', 'render'])
})

test('retains widget namespaces', async () => {
  const input = jest.fn(async (..._args: readonly unknown[]) => {})
  const events = Events.createCommandMap({ 'FindWidget.handleInput': input })
  await events['Viewlet.executeViewletCommand'](101, 'FindWidget.handleInput', 'abc')
  expect(input).toHaveBeenCalledWith(101, 'abc')
})

test('preserves renderer-owned focus effects', async () => {
  const focus = jest.fn(async () => {})
  const events = Events.createCommandMap({ 'Editor.handleFocus': focus })
  await events['Viewlet.executeViewletCommand'](101, 'handleFocus')
  expect(focus).not.toHaveBeenCalled()
  expect(invoke).toHaveBeenCalledWith('Viewlet.executeViewletCommand', 101, 'handleFocus')
})

test('preserves renderer-owned pointer focus effects', async () => {
  const mouseDown = jest.fn(async () => {})
  const events = Events.createCommandMap({ 'Editor.handleMouseDown': mouseDown })
  await events['Viewlet.executeViewletCommand'](101, 'handleMouseDown', 0, false, false, 40, 80, 1, false)
  expect(mouseDown).not.toHaveBeenCalled()
  expect(invoke).toHaveBeenCalledWith('Viewlet.executeViewletCommand', 101, 'handleMouseDown', 0, false, false, 40, 80, 1, false)
})

test('rejects unknown commands and propagates worker errors without requesting a render', async () => {
  const events = Events.createCommandMap({
    'Editor.type': async () => {
      throw new Error('input failed')
    },
  })
  await expect(events['Viewlet.executeViewletCommand'](101, 'missing')).rejects.toThrow('Editor event command not found')
  await expect(events['Viewlet.executeViewletCommand'](101, 'type')).rejects.toThrow('input failed')
  expect(invoke).not.toHaveBeenCalled()
})

test('ignores disposed editors and commands finishing after recreation', async () => {
  const events = Events.createCommandMap({
    'Editor.type': async () => {
      const replacement = { lifecycle: { disposed: false }, uid: 101 } as EditorState
      Editors.set(101, replacement, replacement)
    },
  })
  await events['Viewlet.executeViewletCommand'](101, 'type')
  expect(invoke).not.toHaveBeenCalled()
  Editors.dispose(101)
  await events['Viewlet.executeViewletCommand'](101, 'type')
  expect(invoke).not.toHaveBeenCalled()
})
