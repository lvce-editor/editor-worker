import { expect, jest, test } from '@jest/globals'
import * as EditorMessageDismissalState from '../src/parts/EditorMessageDismissalState/EditorMessageDismissalState.ts'

test('set replaces the existing editor message timer and clear cancels it', () => {
  jest.useFakeTimers()
  const firstCallback = jest.fn()
  const secondCallback = jest.fn()
  const firstTimeout = setTimeout(firstCallback, 100)
  EditorMessageDismissalState.set(1, { timeout: firstTimeout })

  const secondTimeout = setTimeout(secondCallback, 200)
  EditorMessageDismissalState.set(1, { timeout: secondTimeout })
  jest.advanceTimersByTime(100)
  expect(firstCallback).not.toHaveBeenCalled()
  expect(secondCallback).not.toHaveBeenCalled()

  EditorMessageDismissalState.clear(1)
  jest.advanceTimersByTime(200)
  expect(secondCallback).not.toHaveBeenCalled()
  jest.useRealTimers()
})
