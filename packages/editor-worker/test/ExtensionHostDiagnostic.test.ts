import { expect, test } from '@jest/globals'
import { MockRpc } from '@lvce-editor/rpc'
import { ExtensionHost, ExtensionManagementWorker, RendererWorker } from '@lvce-editor/rpc-registry'

const ExtensionHostDiagnostic = await import('../src/parts/ExtensionHostDiagnostic/ExtensionHostDiagnostic.ts')

test('executeDiagnosticProvider returns isolated diagnostics first', async () => {
  const invocations: unknown[] = []
  const diagnostics = [
    {
      columnIndex: 0,
      endColumnIndex: 5,
      endRowIndex: 0,
      message: 'isolated',
      rowIndex: 0,
      type: 'error',
    },
  ]
  const extensionManagementRpc = MockRpc.create({
    commandMap: {},
    invoke: async (method: string, ...args: readonly unknown[]) => {
      invocations.push([method, ...args])
      return diagnostics
    },
  })
  const extensionHostRpc = MockRpc.create({
    commandMap: {},
    invoke: async () => {
      throw new Error('should not call legacy extension host')
    },
  })
  ExtensionManagementWorker.set(extensionManagementRpc)
  ExtensionHost.set(extensionHostRpc)
  RendererWorker.set(extensionHostRpc)

  const editor = {
    id: 1,
    languageId: 'javascript',
    lines: ['const value=1'],
    uid: 1,
    uri: '/test.js',
  }

  await expect(ExtensionHostDiagnostic.executeDiagnosticProvider(editor)).resolves.toBe(diagnostics)
  expect(invocations).toEqual([
    [
      'Extensions.executeDiagnosticProvider',
      {
        documentId: 1,
        languageId: 'javascript',
        text: 'const value=1',
        uri: '/test.js',
      },
    ],
  ])
})

test('executeDiagnosticProvider falls back to legacy extension host when isolated diagnostics are empty', async () => {
  const extensionManagementRpc = MockRpc.create({
    commandMap: {},
    invoke: async () => [],
  })
  const diagnostics = [
    {
      columnIndex: 0,
      endColumnIndex: 5,
      endRowIndex: 0,
      message: 'legacy',
      rowIndex: 0,
      type: 'warning',
    },
  ]
  const extensionHostRpc = MockRpc.create({
    commandMap: {},
    invoke: async () => diagnostics,
  })
  ExtensionManagementWorker.set(extensionManagementRpc)
  ExtensionHost.set(extensionHostRpc)
  RendererWorker.set(
    MockRpc.create({
      commandMap: {},
      invoke: async () => undefined,
    }),
  )

  const editor = {
    assetDir: '',
    id: 1,
    languageId: 'javascript',
    lines: ['const value=1'],
    platform: 1,
    uid: 1,
    uri: '/test.js',
  }

  await expect(ExtensionHostDiagnostic.executeDiagnosticProvider(editor)).resolves.toBe(diagnostics)
})
