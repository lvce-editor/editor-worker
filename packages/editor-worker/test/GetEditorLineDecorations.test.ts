import { expect, test } from '@jest/globals'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { getEditorLineDecorations } from '../src/parts/GetEditorLineDecorations/GetEditorLineDecorations.ts'

test('gets line decorations from extensions for the clicked row', async () => {
  const invocations: unknown[] = []
  using _rpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeProvidersByEvent': (...args: readonly unknown[]) => {
      invocations.push(args)
      return [[{ text: 'Test User, 2026-08-18 • Initial commit' }]]
    },
  })
  const editor = {
    languageId: 'plaintext',
    lines: ['first', 'second'],
    uri: 'file:///workspace/file.txt',
  } as any

  await expect(getEditorLineDecorations(editor, 1)).resolves.toEqual([
    {
      rowIndex: 1,
      text: 'Test User, 2026-08-18 • Initial commit',
    },
  ])
  expect(invocations).toEqual([
    [
      'onEditorLineDecoration',
      'ExtensionApi.executeEditorLineDecorationProvider',
      {
        languageId: 'plaintext',
        text: 'first\nsecond',
        uri: 'file:///workspace/file.txt',
      },
      1,
    ],
  ])
})

test('returns no decorations when an optional provider fails', async () => {
  using _rpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeProvidersByEvent': () => {
      throw new Error('provider failed')
    },
  })
  const editor = {
    languageId: 'plaintext',
    lines: ['line'],
    uri: 'file:///workspace/file.txt',
  } as any

  await expect(getEditorLineDecorations(editor, 0)).resolves.toEqual([])
})
