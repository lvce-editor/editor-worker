import { beforeEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(...args: readonly unknown[]) => Promise<number>>()
const measureTextWidth = jest.fn<(...args: readonly unknown[]) => Promise<number>>()
jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.ts', () => ({ invoke }))
jest.unstable_mockModule('../src/parts/MeasureTextWidth/MeasureTextWidth.ts', () => ({ measureTextWidth }))
const { createMeasure } = await import('../src/parts/MeasureBidi/MeasureBidi.ts')

beforeEach(() => {
  invoke.mockReset().mockResolvedValue(17)
  measureTextWidth.mockReset().mockResolvedValue(20)
})

test('Arabic prefixes retain their full shaping context and normalized tab offsets', async () => {
  const measure = createMeasure(400, 18, 'Fira Code', 0.5, 2, 10)
  const context = { offset: 2, rtl: true, text: '\tمرحبا' }
  expect(await measure('\tم', context)).toBe(17)
  expect(invoke).toHaveBeenCalledWith('MeasureBidi.measurePrefix', '  مرحبا', 3, 400, 18, 'Fira Code', 0.5, 'rtl')
  expect(measureTextWidth).not.toHaveBeenCalled()
  await measure('\tم', context)
  expect(invoke).toHaveBeenCalledTimes(1)
})

test('non-joining text and run endpoints use glyph measurements', async () => {
  const measure = createMeasure(400, 18, 'Fira Code', 0.5, 2, 10)
  expect(await measure('א', { offset: 1, rtl: true, text: 'אבג' })).toBe(20)
  expect(measureTextWidth).toHaveBeenCalledWith('א', 400, 18, 'Fira Code', 0.5, false, 10)
  await measure('مرحبا', { offset: 5, rtl: true, text: 'مرحبا' })
  expect(invoke).not.toHaveBeenCalled()
})

test('measurement caches belong to one operation and cannot survive font changes', async () => {
  await createMeasure(400, 18, 'Fira Code', 0.5, 2, 10)('abc')
  await createMeasure(400, 24, 'Fira Code', 0.5, 2, 10)('abc')
  expect(measureTextWidth).toHaveBeenCalledTimes(2)
  expect(measureTextWidth).toHaveBeenLastCalledWith('abc', 400, 24, 'Fira Code', 0.5, false, 10)
})
