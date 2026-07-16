import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'

const updateDerivedStateMock = jest.fn()

jest.unstable_mockModule('../src/parts/UpdateDerivedState/UpdateDerivedState.ts', () => ({
  updateDerivedState: updateDerivedStateMock,
}))

const EditorStates = await import('../src/parts/EditorStates/EditorStates.ts')
const WrapCommands = await import('../src/parts/WrapCommands/WrapCommands.ts')

beforeEach(() => {
  const state = {
    text: '',
  }
  EditorStates.set(1, state as any, state as any)
  updateDerivedStateMock.mockReset()
  updateDerivedStateMock.mockImplementation(async (_oldState, newState) => {
    await Promise.resolve()
    return newState
  })
})

afterEach(() => {
  EditorStates.dispose(1)
})

test('serializes concurrent commands for the same editor', async () => {
  const command = WrapCommands.wrapCommand((state: any, text: string) => ({
    ...state,
    text: state.text + text,
  }))

  await Promise.all([command(1, 'a'), command(1, 'b'), command(1, 'c')])

  expect((EditorStates.get(1).newState as any).text).toBe('abc')
})
