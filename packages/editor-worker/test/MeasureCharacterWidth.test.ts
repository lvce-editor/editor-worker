import { expect, jest, test } from '@jest/globals'

const get = jest.fn<(...args: any[]) => Promise<number | undefined>>()
const set = jest.fn<(...args: any[]) => Promise<void>>()
const measureTextWidth = jest.fn<(...args: any[]) => Promise<number>>()

jest.unstable_mockModule('../src/parts/CharacterWidthCache/CharacterWidthCache.ts', () => ({ get, set }))
jest.unstable_mockModule('../src/parts/MeasureTextWidth/MeasureTextWidth.ts', () => ({ measureTextWidth }))

const MeasureCharacterWidth = await import('../src/parts/MeasureCharacterWidth/MeasureCharacterWidth.ts')

test('uses a cached character width without measuring', async () => {
  get.mockResolvedValue(8.5)
  await expect(MeasureCharacterWidth.measureCharacterWidth(400, 15, 'Fira Code', 0.5)).resolves.toBe(8.5)
  expect(measureTextWidth).not.toHaveBeenCalled()
})

test('measures and caches a cold character width', async () => {
  get.mockResolvedValue(undefined)
  measureTextWidth.mockResolvedValue(8.5)
  await expect(MeasureCharacterWidth.measureCharacterWidth(400, 15, 'Fira Code', 0.5)).resolves.toBe(8.5)
  expect(set).toHaveBeenCalledWith(400, 15, 'Fira Code', 0.5, 8.5)
})

test('falls back to measurement when the cache is unavailable', async () => {
  get.mockRejectedValue(new Error('cache unavailable'))
  measureTextWidth.mockResolvedValue(8.5)
  await expect(MeasureCharacterWidth.measureCharacterWidth(400, 15, 'Fira Code', 0.5)).resolves.toBe(8.5)
})
