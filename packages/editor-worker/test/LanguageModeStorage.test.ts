import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as LanguageModeStorage from '../src/parts/LanguageModeStorage/LanguageModeStorage.ts'

test('get returns the persisted language mode', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'LocalStorage.getJson': () => 'javascript',
  })

  await expect(LanguageModeStorage.get('file:///test.txt')).resolves.toBe('javascript')
  expect(mockRpc.invocations).toEqual([['LocalStorage.getJson', 'editor.language-mode:file:///test.txt']])
})

test('get ignores invalid persisted values', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'LocalStorage.getJson': () => ({ languageId: 'javascript' }),
  })

  await expect(LanguageModeStorage.get('file:///test.txt')).resolves.toBe('')
})

test('get ignores storage errors', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'LocalStorage.getJson': () => {
      throw new Error('storage unavailable')
    },
  })

  await expect(LanguageModeStorage.get('file:///test.txt')).resolves.toBe('')
})

test('set persists the language mode for the full uri', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'LocalStorage.setJson': () => undefined,
  })

  await LanguageModeStorage.set('file:///workspace/src/test.txt', 'typescript')

  expect(mockRpc.invocations).toEqual([['LocalStorage.setJson', 'editor.language-mode:file:///workspace/src/test.txt', 'typescript']])
})

test('set ignores storage errors', async () => {
  using _mockRpc = RendererWorker.registerMockRpc({
    'LocalStorage.setJson': () => {
      throw new Error('storage unavailable')
    },
  })

  await expect(LanguageModeStorage.set('file:///test.txt', 'javascript')).resolves.toBeUndefined()
})
