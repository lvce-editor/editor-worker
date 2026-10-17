import { expect, test } from '@jest/globals'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import { getEditorGutterDecorations } from '../src/parts/GetEditorGutterDecorations/GetEditorGutterDecorations.ts'

test('gets gutter decorations from extensions', async () => {
  const invocations: unknown[] = []
  using _rpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeProvidersByEvent': (...args: readonly unknown[]) => {
      invocations.push(args)
      return [
        [
          { rowIndex: 0, type: 'added' },
          { rowIndex: 1, type: 'modified' },
          { rowIndex: 2, type: 'deleted' },
        ],
      ]
    },
  })
  const editor = {
    languageId: 'plaintext',
    lines: ['first', 'second', 'third'],
    uri: 'file:///workspace/file.txt',
  } as any

  await expect(getEditorGutterDecorations(editor)).resolves.toEqual([
    { rowIndex: 0, type: 'added' },
    { rowIndex: 1, type: 'modified' },
    { rowIndex: 2, type: 'deleted' },
  ])
  expect(invocations).toEqual([
    [
      'onEditorGutterDecoration',
      'ExtensionApi.executeEditorGutterDecorationProvider',
      {
        languageId: 'plaintext',
        text: 'first\nsecond\nthird',
        uri: 'file:///workspace/file.txt',
      },
    ],
  ])
})

test('ignores invalid provider decorations', async () => {
  using _rpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeProvidersByEvent': () => [
      [{ rowIndex: -1, type: 'added' }, { rowIndex: 0.5, type: 'modified' }, { rowIndex: 1, type: 'warning' }, undefined],
      undefined,
    ],
  })
  const editor = {
    languageId: 'plaintext',
    lines: ['line'],
    uri: 'file:///workspace/file.txt',
  } as any

  await expect(getEditorGutterDecorations(editor)).resolves.toEqual([])
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

  await expect(getEditorGutterDecorations(editor)).resolves.toEqual([])
})
