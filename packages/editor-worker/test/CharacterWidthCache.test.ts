import { beforeEach, expect, jest, test } from '@jest/globals'

const getCacheStorageJsonItem = jest.fn<(...args: any[]) => Promise<any>>()
const setCacheStorageJsonItem = jest.fn<(...args: any[]) => Promise<void>>()

jest.unstable_mockModule('@lvce-editor/rpc-registry', () => ({
  CacheWorker: {
    getCacheStorageJsonItem,
    setCacheStorageJsonItem,
  },
}))

const CharacterWidthCache = await import('../src/parts/CharacterWidthCache/CharacterWidthCache.ts')

beforeEach(() => {
  getCacheStorageJsonItem.mockReset()
  setCacheStorageJsonItem.mockReset()
})

test('get returns a valid cached width', async () => {
  getCacheStorageJsonItem.mockResolvedValue({ value: 8.5 })
  await expect(CharacterWidthCache.get(400, 15, 'Fira Code', 0.5)).resolves.toBe(8.5)
})

test('get rejects malformed cached widths', async () => {
  getCacheStorageJsonItem.mockResolvedValue({ value: NaN })
  await expect(CharacterWidthCache.get(400, 15, 'Fira Code', 0.5)).resolves.toBeUndefined()
})

test('font settings are part of the cache key', async () => {
  getCacheStorageJsonItem.mockResolvedValue(null)
  await CharacterWidthCache.get(400, 15, 'Fira Code', 0.5)
  await CharacterWidthCache.get(400, 16, 'Fira Code', 0.5)
  expect(getCacheStorageJsonItem.mock.calls[0][0]).not.toBe(getCacheStorageJsonItem.mock.calls[1][0])
})

test('set persists a width', async () => {
  await CharacterWidthCache.set(400, 15, 'Fira Code', 0.5, 8.5)
  expect(setCacheStorageJsonItem).toHaveBeenCalledWith(
    `https://cache.invalid/character-width/${encodeURIComponent(JSON.stringify(['a', 400, 15, 'Fira Code', 0.5]))}`,
    8.5,
    'lvce-editor-character-widths-v1',
  )
})

test('has returns true when a valid cached width exists', async () => {
  getCacheStorageJsonItem.mockResolvedValue({ value: 8.5 })
  await expect(CharacterWidthCache.has(400, 15, 'Fira Code', 0.5)).resolves.toBe(true)
})

test('has returns false when the width is missing or cache access fails', async () => {
  getCacheStorageJsonItem.mockResolvedValue(undefined)
  await expect(CharacterWidthCache.has(400, 15, 'Fira Code', 0.5)).resolves.toBe(false)
  getCacheStorageJsonItem.mockRejectedValue(new Error('cache unavailable'))
  await expect(CharacterWidthCache.has(400, 15, 'Fira Code', 0.5)).resolves.toBe(false)
})
