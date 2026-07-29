import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import * as ExtensionHostSignatureHelp from '../src/parts/ExtensionHostSignatureHelp/ExtensionHostSignatureHelp.ts'

test('executeSignatureHelpProvider invokes the isolated provider with the current document', async () => {
  const invocations: unknown[] = []
  const result = {
    activeParameter: 0,
    activeSignature: 0,
    signatures: [{ label: 'fn(value: string): void', parameters: [{ label: 'value: string' }] }],
  }
  ExtensionManagementWorker.set(
    MockRpc.create({
      commandMap: {},
      invoke: async (method: string, ...args: readonly unknown[]) => {
        invocations.push([method, ...args])
        return result
      },
    }),
  )
  const editor = {
    id: 1,
    languageId: 'typescript',
    lines: ['fn('],
    uid: 1,
    uri: '/test.ts',
  }

  await expect(ExtensionHostSignatureHelp.executeSignatureHelpProvider(editor, 3)).resolves.toBe(result)
  expect(invocations).toEqual([
    [
      'Extensions.executeSignatureHelpProvider',
      {
        documentId: 1,
        languageId: 'typescript',
        text: 'fn(',
        uri: '/test.ts',
      },
      3,
    ],
  ])
})
