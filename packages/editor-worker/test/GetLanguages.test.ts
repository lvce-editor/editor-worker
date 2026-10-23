import { expect, test } from '@jest/globals'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { getLanguages } from '../src/parts/GetLanguages/GetLanguages.ts'

test('language lookup includes the requested application context', async () => {
  const source = [{ id: 'typescript' }]
  const preview = [{ extensions: ['.sprout'], id: 'sprout', tokenize: 'https://example.com/tokenize.js' }]
  using rpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.invokeForApplication': (applicationId: string, method: string, platform: number, assetDir: string) => {
      expect(method).toBe('Extensions.getLanguages')
      expect(platform).toBe(1)
      expect(assetDir).toBe('/assets')
      return applicationId === 'source' ? source : preview
    },
  })
  expect(await getLanguages(1, '/assets', 'source')).toEqual(source)
  expect(await getLanguages(1, '/assets', 'preview')).toEqual(preview)
  expect(rpc.invocations).toHaveLength(2)
})

test('language lookup without an application preserves the global command', async () => {
  using rpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.getLanguages': () => [{ id: 'text' }],
  })
  expect(await getLanguages(1, '/assets')).toEqual([{ id: 'text' }])
  expect(rpc.invocations).toEqual([['Extensions.getLanguages', 1, '/assets']])
})
