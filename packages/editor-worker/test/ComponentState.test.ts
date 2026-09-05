import { beforeEach, expect, jest, test } from '@jest/globals'
import type { EditorState } from '../src/parts/State/State.ts'
import { createEditor2 } from '../src/parts/CreateEditor2/CreateEditor2.ts'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { getComponentState } from '../src/parts/GetComponentState/GetComponentState.ts'

const updateDerivedState = jest.fn<(oldState: EditorState, newState: EditorState) => Promise<EditorState>>(async (_oldState, newState) => newState)
jest.unstable_mockModule('../src/parts/UpdateDerivedState/UpdateDerivedState.ts', () => ({ updateDerivedState }))
const { setComponentState } = await import('../src/parts/SetComponentState/SetComponentState.ts')

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
