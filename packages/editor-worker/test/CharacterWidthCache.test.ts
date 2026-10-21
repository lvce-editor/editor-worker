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
  getCacheStorageJsonItem.mockResolvedValue({ value: Number.NaN })
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
  expect(setCacheStorageJsonItem).toHaveBeenCalledWith(expect.any(String), 8.5, 'lvce-editor-character-widths-v1')
})
