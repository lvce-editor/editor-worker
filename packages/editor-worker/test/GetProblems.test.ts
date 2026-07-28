import { afterEach, expect, test } from '@jest/globals'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { getProblems } from '../src/parts/GetProblems/GetProblems.ts'

afterEach(() => {
  for (const key of EditorStates.getKeys()) {
    EditorStates.dispose(Number(key))
  }
})

test('getProblems returns cached diagnostics and preserves fractional editor ids', async () => {
  const editorId = 0.123456
  const diagnostics = [
    {
      message: 'cached problem',
      uri: '/test.js',
    },
  ]
  const editor = {
    diagnostics,
    id: editorId,
    languageId: 'javascript',
    lines: ['const value = 1'],
    uid: editorId,
    uri: '/test.js',
  }
  EditorStates.set(editorId, editor as any, editor as any)
  using mockRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeDiagnosticProvider': () => [{ message: 'new problem' }],
  })

  await expect(getProblems()).resolves.toEqual(diagnostics)
  expect(mockRpc.invocations).toEqual([])
})

test('getProblems ignores open editors without diagnostics', async () => {
  const javascriptEditor = {
    diagnostics: [{ message: 'javascript problem', uri: '/test.js' }],
    id: 1,
    languageId: 'javascript',
    lines: ["let x = ''", 'x++'],
    uri: '/test.js',
  }
  const settingsEditor = {
    diagnostics: [],
    id: 2,
    languageId: 'json',
    lines: ['{}'],
    uri: 'app://settings.json',
  }
  EditorStates.set(1, javascriptEditor as any, javascriptEditor as any)
  EditorStates.set(2, settingsEditor as any, settingsEditor as any)

  await expect(getProblems()).resolves.toEqual(javascriptEditor.diagnostics)
})

test('getProblems ignores editor entries without a readable state', async () => {
  const editor = {
    diagnostics: [{ message: 'stale problem', uri: '/stale.js' }],
    id: undefined,
    languageId: 'javascript',
    lines: [''],
    uri: '/stale.js',
  }
  EditorStates.set(undefined as any, editor as any, editor as any)

  try {
    await expect(getProblems()).resolves.toEqual([])
  } finally {
    EditorStates.dispose(undefined as any)
  }
})
