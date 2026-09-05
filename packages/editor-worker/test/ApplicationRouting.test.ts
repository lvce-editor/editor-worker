import { afterEach, expect, test } from '@jest/globals'
import { ExtensionManagementWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import * as ApplicationRpc from '../src/parts/ApplicationRpc/ApplicationRpc.ts'
import { createEditor2 } from '../src/parts/CreateEditor2/CreateEditor2.ts'
import { save } from '../src/parts/EditorCommand/EditorCommandSave.ts'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { executeDiagnosticProvider } from '../src/parts/ExtensionHostDiagnostic/ExtensionHostDiagnostic.ts'
import { execute } from '../src/parts/ExtensionManagementEditor/ExtensionManagementEditor.ts'
import { getFormattingEdits } from '../src/parts/GetFormattingEdits/GetFormattingEdits.ts'

afterEach(() => {
  EditorStates.dispose(101)
  EditorStates.dispose(102)
})

test('creates application-owned editors without changing legacy state shape', () => {
  createEditor2(101, 'memfs:///main.ts', 0, 0, 400, 600, 1, '/assets', 'typescript', '/assets/tokenize.js', true, 'source')
  createEditor2(102, 'memfs:///main.ts', 400, 0, 400, 600, 1, '/assets')
  expect(EditorStates.get(101).newState.applicationId).toBe('source')
  expect(EditorStates.get(102).newState).not.toHaveProperty('applicationId')
})

test('does not interpret legacy renderer language arguments as application ownership', () => {
  // The renderer has always sent these trailing arguments, even when unused.
  const createFromRenderer: (...args: readonly any[]) => void = createEditor2
  createFromRenderer(101, 'file:///main.ts', 0, 0, 400, 600, 1, '/assets', 'typescript', '/assets/tokenize.js', true)
  expect(EditorStates.get(101).newState).not.toHaveProperty('applicationId')
})

test('saving the same uri writes and clears dirty status only in its application', async () => {
  using rpc = RendererWorker.registerMockRpc({
    'Application.execute': async (_applicationId: string, method: string) => (method === 'FileSystem.isReadonly' ? false : undefined),
  })
  const source = { applicationId: 'source', lines: ['source'], modified: true, uri: 'memfs:///main.ts' }
  const preview = { ...source, applicationId: 'preview', lines: ['preview'] }

  const results = await Promise.all([save(source), save(preview)])

  expect(results.map((result) => result.modified)).toEqual([false, false])
  for (const editor of [source, preview]) {
    expect(rpc.invocations.filter((invocation) => invocation[1] === editor.applicationId)).toEqual([
      ['Application.execute', editor.applicationId, 'FileSystem.isReadonly', editor.uri],
      ['Application.execute', editor.applicationId, 'FileSystem.writeFile', editor.uri, editor.lines[0], 'utf8', false],
      ['Application.execute', editor.applicationId, 'Main.handleModifiedStatusChange', editor.uri, false],
    ])
  }
})

test('routes diagnostic, formatting, and language providers to the document owner', async () => {
  using rpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.invokeForApplication': async (applicationId: string, method: string) => {
      return method === 'Extensions.executeLanguageProvider' ? { found: true, result: applicationId } : [applicationId]
    },
  })
  for (const applicationId of ['source', 'preview']) {
    const editor = {
      applicationId,
      id: applicationId === 'source' ? 101 : 102,
      languageId: 'typescript',
      lines: ['let value = 1'],
      uri: 'memfs:///main.ts',
    }
    await expect(executeDiagnosticProvider(editor)).resolves.toEqual([applicationId])
    await expect(getFormattingEdits(editor)).resolves.toEqual([applicationId])
    await expect(execute({ args: [], editor, kind: 'Definition', method: 'provideDefinition' })).resolves.toBe(applicationId)
  }
  expect(rpc.invocations).toHaveLength(6)
  expect(rpc.invocations.every((invocation) => invocation[0] === 'Extensions.invokeForApplication')).toBe(true)
})

test('rejects failed scoped callbacks instead of falling back to the default workspace', async () => {
  using rpc = RendererWorker.registerMockRpc({
    'Application.execute': async () => {
      throw new Error('Application disposed')
    },
  })
  await expect(ApplicationRpc.readFile('preview', 'memfs:///main.ts')).rejects.toThrow('Application disposed')
  expect(rpc.invocations).toEqual([['Application.execute', 'preview', 'FileSystem.readFile', 'memfs:///main.ts']])
})
