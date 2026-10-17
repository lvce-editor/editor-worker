import { beforeEach, expect, jest, test } from '@jest/globals'
import type { EditorState } from '../src/parts/State/State.ts'
import { createEditor2 } from '../src/parts/CreateEditor2/CreateEditor2.ts'
import * as EditorCommandQueue from '../src/parts/EditorCommandQueue/EditorCommandQueue.ts'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { getComponentState } from '../src/parts/GetComponentState/GetComponentState.ts'

const updateDerivedState = jest.fn<(oldState: EditorState, newState: EditorState) => Promise<EditorState>>(async (_oldState, newState) => newState)
jest.unstable_mockModule('../src/parts/UpdateDerivedState/UpdateDerivedState.ts', () => ({ updateDerivedState }))
const { setComponentState } = await import('../src/parts/SetComponentState/SetComponentState.ts')
const { commandMap } = await import('../src/parts/CommandMap/CommandMap.ts')

beforeEach(() => {
  createEditor2(101, 'file:///test.txt', 0, 0, 800, 600, 0, '')
  updateDerivedState.mockClear()
})

test('exposes the full worker state with editable JSON selection arrays', () => {
  const state = EditorStates.get(101).newState
  const next = { ...state, cursorUndoStack: [new Uint32Array([0, 1, 0, 2])], selections: new Uint32Array([0, 2, 0, 3]) }
  EditorStates.set(101, state, next)
  const json = JSON.stringify(getComponentState(101))
  expect(JSON.parse(json)).toEqual({
    ...next,
    cursorUndoStack: [[0, 1, 0, 2]],
    selections: [0, 2, 0, 3],
  })
})

test('applies JSON edits, restores typed arrays, and updates derived state', async () => {
  const previous = EditorStates.get(101).newState
  const json = JSON.stringify(getComponentState(101))
  const state = JSON.parse(json)
  await setComponentState(101, { ...state, cursorUndoStack: [[0, 0, 0, 1]], cursorWidth: 4, selections: [0, 0, 0, 1] })
  const updated = EditorStates.get(101).newState
  expect(updated.cursorWidth).toBe(4)
  expect(updated.selections).toEqual(new Uint32Array([0, 0, 0, 1]))
  expect(updated.cursorUndoStack).toEqual([new Uint32Array([0, 0, 0, 1])])
  expect(updated.lines).toBe(previous.lines)
  expect(updated.textInfos).toBe(previous.textInfos)
  expect(EditorStates.get(101).oldState).toBe(previous)
  expect(updateDerivedState).toHaveBeenCalledWith(previous, updated)
})

test.each(['uid', 'id', 'uri'])('rejects changing editor identity: %s', async (key) => {
  const previous = EditorStates.get(101).newState
  await expect(setComponentState(101, { ...getComponentState(101), [key]: 'changed' })).rejects.toThrow(`Editor state ${key} must remain`)
  expect(EditorStates.get(101).newState).toBe(previous)
})

test.each([null, [], 1])('rejects invalid state: %p', async (value) => {
  await expect(setComponentState(101, value)).rejects.toThrow('Editor state must be an object')
})

test.each([{}, [0], [-1, 0, 0, 0], [0, 0.5, 0, 0], [0, 0, 0, 0x1_00_00_00_00]])('rejects invalid selections: %p', async (selections) => {
  await expect(setComponentState(101, { ...getComponentState(101), selections })).rejects.toThrow('Editor selections must be an array')
})

test('rejects invalid lines and cursor history', async () => {
  const state = getComponentState(101)
  await expect(setComponentState(101, { ...state, lines: [1] })).rejects.toThrow('Editor lines must be an array of strings')
  await expect(setComponentState(101, { ...state, cursorUndoStack: {} })).rejects.toThrow('Editor cursorUndoStack must be an array')
})

test('invalidates text caches when lines are edited through JSON', async () => {
  const initial = EditorStates.get(101).newState
  const previous = { ...initial, invalidStartIndex: 10 }
  EditorStates.set(101, previous, previous)
  await setComponentState(101, { ...getComponentState(101), lines: ['changed', 'second line'] })
  expect(EditorStates.get(101).newState).toMatchObject({
    incrementalEdits: [],
    invalidStartIndex: 0,
    lines: ['changed', 'second line'],
    numberOfLines: 2,
  })
})

test('reapplying a JSON snapshot does not restore stale text render caches', async () => {
  const snapshot = { ...getComponentState(101), lines: ['changed'] }
  const current = EditorStates.get(101).newState
  const rendered = { ...current, differences: [0], lines: ['changed'], textInfos: [['changed', 'Token Text']] }
  EditorStates.set(101, rendered, rendered)
  await setComponentState(101, snapshot)
  expect(EditorStates.get(101).newState.textInfos).toBe(rendered.textInfos)
  expect(EditorStates.get(101).newState.differences).toBe(rendered.differences)
})

test('component updates finish before later queued edits commit', async () => {
  const started = Promise.withResolvers<void>()
  const finish = Promise.withResolvers<void>()
  updateDerivedState.mockImplementationOnce(async (_oldState, newState) => {
    started.resolve()
    await finish.promise
    return newState
  })
  const setting = setComponentState(101, { ...getComponentState(101), cursorWidth: 4 })
  await started.promise
  const editing = EditorCommandQueue.enqueue(101, async () => {
    const current = EditorStates.get(101)
    EditorStates.set(101, current.oldState, { ...current.newState, lines: ['later edit'] })
  })
  await Promise.resolve()
  finish.resolve()
  await Promise.all([setting, editing])
  expect(EditorStates.get(101).newState.lines).toEqual(['later edit'])
  expect(EditorStates.get(101).newState.cursorWidth).toBe(4)
})

test('component state is exposed through the worker RPC command map', async () => {
  const serialized = JSON.stringify(commandMap['Editor.getComponentState'](101))
  const snapshot = JSON.parse(serialized)
  await commandMap['Editor.setComponentState'](101, { ...snapshot, cursorWidth: 7 })
  expect(commandMap['Editor.getComponentState'](101).cursorWidth).toBe(7)
})
