import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'

const AutoSave = await import('../src/parts/AutoSave/AutoSave.ts')

beforeEach(() => {
  jest.useFakeTimers()
  AutoSave.reset()
})

afterEach(() => {
  AutoSave.reset()
  jest.useRealTimers()
})

test('runs a pending save after the delay', async () => {
  const save = jest.fn<(token: number) => Promise<void>>().mockResolvedValue()

  AutoSave.schedule(1, save)
  await jest.advanceTimersByTimeAsync(999)

  expect(save).not.toHaveBeenCalled()

  await jest.advanceTimersByTimeAsync(1)

  expect(save).toHaveBeenCalledWith(1)
})

test('debounces repeated document changes', async () => {
  const save = jest.fn<(token: number) => Promise<void>>().mockResolvedValue()

  AutoSave.schedule(1, save)
  await jest.advanceTimersByTimeAsync(700)
  AutoSave.schedule(1, save)
  await jest.advanceTimersByTimeAsync(999)

  expect(save).not.toHaveBeenCalled()

  await jest.advanceTimersByTimeAsync(1)

  expect(save).toHaveBeenCalledWith(2)
})

test('tracks and consumes the latest pending save', async () => {
  const save = jest.fn<(token: number) => Promise<void>>().mockResolvedValue()

  AutoSave.schedule(1, save)

  expect(AutoSave.isLatest(1, 1)).toBe(true)

  AutoSave.consume(1, 1)

  expect(AutoSave.isLatest(1, 1)).toBe(false)
})

test('disposes a pending save', async () => {
  const save = jest.fn<(token: number) => Promise<void>>().mockResolvedValue()

  AutoSave.schedule(1, save)
  AutoSave.dispose(1)
  await jest.advanceTimersByTimeAsync(1000)

  expect(save).not.toHaveBeenCalled()
})
