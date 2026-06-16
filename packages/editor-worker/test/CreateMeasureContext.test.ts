import { expect, test } from '@jest/globals'
import * as CreateMeasureContext from '../src/parts/CreateMeasureContext/CreateMeasureContext.ts'

test('createMeasureContext - error', () => {
  Object.defineProperty(globalThis, 'OffscreenCanvas', {
    configurable: true,
    value: class {
      getContext() {
        return undefined
      }
    },
  })
  expect(() => CreateMeasureContext.createMeasureContext()).toThrow(new Error('Failed to get canvas context 2d'))
})

test('createMeasureContext', () => {
  const ctx = {}
  Object.defineProperty(globalThis, 'OffscreenCanvas', {
    configurable: true,
    value: class {
      getContext() {
        return ctx
      }
    },
  })
  expect(CreateMeasureContext.createMeasureContext()).toBe(ctx)
})
