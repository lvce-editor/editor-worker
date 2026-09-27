import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { execute } from '../src/parts/ExtensionManagementEditor/ExtensionManagementEditor.ts'

test('large files never serialize content or invoke a language provider', async () => {
  using mockRpc = RendererWorker.registerMockRpc({})
  const editor = {
    largeFile: true,
    get lines() {
      throw new Error('must not read content')
    },
  }
  expect(await execute({ args: [], editor, kind: 'diagnostic', method: 'provideDiagnostics', noProviderFoundResult: [] })).toEqual([])
  expect(mockRpc.invocations).toEqual([])
})
