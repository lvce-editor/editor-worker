import { beforeEach, expect, jest, test } from '@jest/globals'

const getMock: any = jest.fn()
const setMock: any = jest.fn()
const updateDerivedStateMock: any = jest.fn()

jest.unstable_mockModule('../src/parts/EditorStates/EditorStates.ts', () => ({
  get: getMock,
  set: setMock,
}))

jest.unstable_mockModule('../src/parts/UpdateDerivedState/UpdateDerivedState.ts', () => ({
  updateDerivedState: updateDerivedStateMock,
}))

const { wrapCommand } = await import('../src/parts/WrapCommands/WrapCommands.ts')

interface TestState {
  readonly value: number
}

const tick = (): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, 0)
  })

beforeEach(() => {
  getMock.mockReset()
  setMock.mockReset()
  updateDerivedStateMock.mockReset()
  updateDerivedStateMock.mockImplementation((oldState: TestState, newState: TestState) => newState)
})

test('wrapCommand serializes concurrent editor commands for the same editor', async () => {
  let state = {
    value: 0,
  }
  let resolveFirstCommand: any
  const firstCommand: any = jest.fn(
    (oldState: TestState) =>
      new Promise((resolve) => {
        resolveFirstCommand = () =>
          resolve({
            value: oldState.value + 1,
          })
      }),
  )
  const secondCommand: any = jest.fn((oldState: TestState) => ({
    value: oldState.value + 1,
  }))
  getMock.mockImplementation(() => ({
    newState: state,
  }))
  setMock.mockImplementation((uid: number, oldState: TestState, newState: TestState) => {
    state = newState
  })

  const firstResultPromise = wrapCommand(firstCommand)(1)
  const secondResultPromise = wrapCommand(secondCommand)(1)

  await tick()

  expect(firstCommand).toHaveBeenCalledWith({ value: 0 })
  expect(secondCommand).not.toHaveBeenCalled()

  resolveFirstCommand()
  await expect(firstResultPromise).resolves.toEqual({ value: 1 })
  await expect(secondResultPromise).resolves.toEqual({ value: 2 })

  expect(secondCommand).toHaveBeenCalledWith({ value: 1 })
  expect(setMock).toHaveBeenCalledTimes(2)
  expect(state).toEqual({ value: 2 })
})
