import { beforeEach, expect, jest, test } from '@jest/globals'
import type { EditorState } from '../src/parts/State/State.ts'

const invoke = jest.fn<(...args: readonly unknown[]) => Promise<number>>()
const applyRender = jest.fn<(...args: readonly unknown[]) => readonly unknown[][]>()
jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.ts', () => ({ invoke, isConnected: () => true }))
jest.unstable_mockModule('../src/parts/ApplyRender/ApplyRender.ts', () => ({ applyRender }))
jest.unstable_mockModule('../src/parts/Diff/Diff.ts', () => ({ diff: () => [1] }))
const Editors = await import('../src/parts/EditorStates/EditorStates.ts')
const Doms = await import('../src/parts/RenderedDoms/RenderedDoms.ts')
const { renderDirect2 } = await import('../src/parts/RenderDirect2/RenderDirect2.ts')
const fixture = { next: {} as EditorState, old: {} as EditorState }

beforeEach(() => {
  jest.clearAllMocks()
  fixture.old = { lifecycle: { disposed: false }, uid: 101 } as EditorState
  fixture.next = { ...fixture.old, lines: ['updated'] }
  Editors.set(101, fixture.old, fixture.next)
  Doms.clear()
  invoke.mockResolvedValue(42)
  applyRender.mockReturnValue([['Viewlet.setPatches', 101, ['patches']]])
})

test('queues editor patches directly and returns only the ordered commit token', async () => {
  const commands = await renderDirect2(101)
  expect(invoke).toHaveBeenCalledWith('Viewlet.queueCommands', 101, [['Viewlet.setPatches', 101, ['patches']]])
  expect(commands).toEqual([['Viewlet.commitPending', 101, 42]])
  expect(Editors.get(101).oldState).toBe(fixture.next)
})

test('preserves widget declarations, child patches and focus ordering', async () => {
  const commands = [
    ['Viewlet.setFocusContext', 101, 1],
    ['Viewlet.setPatches', 101, ['patches']],
    ['Viewlet.create', 202, 'Completion'],
    ['Viewlet.setPatches', 202, ['widget patches']],
    ['Viewlet.setWidgets', 101, 1, [202]],
    ['Viewlet.focusSelector', 101, '.EditorInput'],
  ]
  applyRender.mockReturnValue(commands)
  expect(await renderDirect2(101)).toEqual([commands[0], ['Viewlet.commitPending', 101, 42], ...commands.slice(2)])
})

test('background and sibling renders cannot move focus', async () => {
  applyRender.mockReturnValue([
    ['Viewlet.setFocusContext', 101, 1],
    ['Viewlet.setPatches', 101, ['patches']],
    ['Viewlet.focusSelector', 101, '.EditorInput'],
  ])
  expect(await renderDirect2(101, true)).toEqual([['Viewlet.commitPending', 101, 42]])
})

test('a failed queue restores the baseline and preserves changes arriving during the RPC', async () => {
  const dom = [{ type: 1 }]
  Doms.set(101, dom)
  const newer = { ...fixture.next, lines: ['newer'] }
  invoke.mockImplementation(async () => {
    Doms.set(101, [])
    Editors.set(101, fixture.next, newer)
    throw new Error('queue failed')
  })
  await expect(renderDirect2(101)).rejects.toThrow('queue failed')
  expect(Editors.get(101)).toMatchObject({ newState: newer, oldState: fixture.old })
  expect(Doms.get(101)).toBe(dom)
  invoke.mockResolvedValue(43)
  expect(await renderDirect2(101)).toEqual([['Viewlet.commitPending', 101, 43]])
})

test('serializes renders and ignores work queued for an editor that is recreated', async () => {
  const { promise: queued, resolve: start } = Promise.withResolvers<void>()
  const { promise: gate, resolve } = Promise.withResolvers<number>()
  invoke.mockImplementation(async () => {
    start()
    return gate
  })
  const first = renderDirect2(101)
  await queued
  const second = renderDirect2(101)
  const replacement = { ...fixture.next, lifecycle: { disposed: false } } as EditorState
  Editors.set(101, replacement, replacement)
  resolve(42)
  await first
  expect(await second).toEqual([])
  expect(applyRender).toHaveBeenCalledTimes(1)
  expect(Editors.get(101).newState).toBe(replacement)
})
