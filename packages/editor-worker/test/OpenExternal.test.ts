import { expect, jest, test } from '@jest/globals'
import * as OpenerWorkerModule from '@lvce-editor/rpc-registry'

let openUrlSpy: jest.Mock | undefined

const disposable = OpenerWorkerModule.OpenerWorker.registerMockRpc({
  'Open.openUrl': async (url: string) => {
    if (openUrlSpy) {
      return openUrlSpy(url)
    }
    throw new Error('not implemented')
  },
})

const { openExternal } = await import('../src/parts/HandleSingleClickWithAlt/OpenExternal.ts')

test('openExternal - should call OpenerWorker.openUrl with url', async () => {
  openUrlSpy = jest.fn().mockImplementation(() => {})
  const url = 'https://example.com'
  await openExternal(url)
  expect(openUrlSpy).toHaveBeenCalledWith(url)
  expect(openUrlSpy).toHaveBeenCalledTimes(1)
})

test('openExternal - should handle different URL schemes', async () => {
  openUrlSpy = jest.fn().mockImplementation(() => {})
  const urls = [
    'https://github.com',
    'http://localhost:3000',
    'file:///path/to/file',
    'mailto:test@example.com',
  ]
  for (const url of urls) {
    await openExternal(url)
  }
  expect(openUrlSpy).toHaveBeenCalledTimes(4)
  urls.forEach((url) => {
    expect(openUrlSpy).toHaveBeenCalledWith(url)
  })
})

test('openExternal - should propagate errors from OpenerWorker', async () => {
  openUrlSpy = jest.fn().mockImplementation(() => {
    throw new Error('Failed to open URL')
  })
  const url = 'https://example.com'
  await expect(openExternal(url)).rejects.toThrow('Failed to open URL')
})
