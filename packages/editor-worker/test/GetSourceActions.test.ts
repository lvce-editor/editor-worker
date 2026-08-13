import { afterEach, expect, test } from '@jest/globals'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { emptyEditor } from '../src/parts/EmptyEditor/EmptyEditor.ts'
import { getEditorSourceActions } from '../src/parts/GetSourceActions/GetSourceActions.ts'

afterEach(() => {
  for (const key of EditorStates.getKeys()) {
    EditorStates.dispose(Number(key))
  }
})

test('getEditorSourceActions returns matching extension contributions', async () => {
  const editorId = 123_456
  const editor = {
    ...emptyEditor,
    assetDir: '/assets',
    id: editorId,
    languageId: 'typescript',
    platform: 7,
    uid: editorId,
    widgets: [],
  }
  const action = {
    command: 'Editor.organizeImports',
    kind: 'source.organizeImports',
    languageId: 'typescript',
    name: 'Organize Imports',
  }
  EditorStates.set(editorId, editor, editor)
  using mockRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.getAllExtensions': () => [{ codeActions: [action, { languageId: 'javascript', name: 'Other' }] }, {}],
  })

  await expect(getEditorSourceActions(editorId)).resolves.toEqual([action])
  expect(mockRpc.invocations).toEqual([['Extensions.getAllExtensions', '/assets', 7]])
})

test('getEditorSourceActions excludes contributions from disabled extensions', async () => {
  const editorId = 123_456
  const editor = {
    ...emptyEditor,
    assetDir: '/assets',
    id: editorId,
    languageId: 'typescript',
    platform: 7,
    uid: editorId,
    widgets: [],
  }
  const eslintAction = {
    command: 'Eslint.applyFix',
    kind: 'quickfix',
    languageId: 'typescript',
    name: "Fix 'prefer-const' problem",
  }
  EditorStates.set(editorId, editor, editor)
  using mockRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.getAllExtensions': () => [
      {
        codeActions: [
          { command: 'Editor.organizeImports', kind: 'source.organizeImports', languageId: 'typescript', name: 'Organize Imports' },
          { command: 'Editor.sortImports', kind: 'source.sortImports', languageId: 'typescript', name: 'Sort Imports' },
        ],
        disabled: true,
      },
      { codeActions: [eslintAction] },
    ],
  })

  await expect(getEditorSourceActions(editorId)).resolves.toEqual([eslintAction])
  expect(mockRpc.invocations).toEqual([['Extensions.getAllExtensions', '/assets', 7]])
})

test('getEditorSourceActions returns no actions without an editor id', async () => {
  await expect(getEditorSourceActions()).resolves.toEqual([])
})
