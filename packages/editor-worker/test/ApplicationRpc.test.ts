import { expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(...args: any[]) => Promise<any>>()
jest.unstable_mockModule('../src/parts/FileSystemWorker/FileSystemWorker.ts', () => ({ invoke }))
const { readFile } = await import('../src/parts/ApplicationRpc/ApplicationRpc.ts')

test('file reads go to the filesystem worker with their application scope', async () => {
  invoke.mockResolvedValue('contents')
  expect(await readFile(undefined, 'file:///workspace/main.ts')).toBe('contents')
  expect(invoke).toHaveBeenLastCalledWith('FileSystem.readFile', 'file:///workspace/main.ts')
  expect(await readFile('preview', 'memfs:///main.ts')).toBe('contents')
  expect(invoke).toHaveBeenLastCalledWith('ApplicationFileSystem.execute', 'preview', 'readFile', 'memfs:///main.ts')
})

test('failed scoped file reads propagate without a default-workspace fallback', async () => {
  invoke.mockClear()
  invoke.mockRejectedValue(new Error('Application disposed'))
  await expect(readFile('preview', 'memfs:///main.ts')).rejects.toThrow('Application disposed')
  expect(invoke.mock.calls).toEqual([['ApplicationFileSystem.execute', 'preview', 'readFile', 'memfs:///main.ts']])
})
