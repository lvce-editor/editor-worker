import { afterEach, expect, test } from '@jest/globals'
import { ExtensionManagementWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import * as EditorStates from '../src/parts/EditorStates/EditorStates.ts'
import { refreshGutterDecorations, refreshGutterDecorationsAll } from '../src/parts/RefreshGutterDecorations/RefreshGutterDecorations.ts'

afterEach(() => {
  for (const key of EditorStates.getKeys()) {
    EditorStates.dispose(Number(key))
  }
})

const createEditor = (id: number, uri: string) =>
  ({
    gutterDecorations: [],
    id,
    languageId: 'plaintext',
    lines: ['line'],
    uri,
  }) as any

test('refreshGutterDecorations returns the latest provider decorations', async () => {
  using _rpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeProvidersByEvent': () => [[{ rowIndex: 0, type: 'modified' }]],
  })
  const editor = createEditor(901, 'file:///workspace/first.txt')

  await expect(refreshGutterDecorations(editor)).resolves.toEqual(expect.objectContaining({ gutterDecorations: [{ rowIndex: 0, type: 'modified' }] }))
})

test('refreshGutterDecorations does not restore a disposed editor', async () => {
  using _rendererRpc = RendererWorker.registerMockRpc({
    'Editor.renderPending': () => {},
  })
  using _rpc = ExtensionManagementWorker.registerMockRpc({
    async 'Extensions.executeProvidersByEvent'() {
      EditorStates.dispose(902)
      return [[{ rowIndex: 0, type: 'added' }]]
    },
  })
  const editor = createEditor(902, 'file:///workspace/disposed.txt')
  EditorStates.set(editor.id, editor, editor)

  await refreshGutterDecorationsAll()
  expect(EditorStates.get(editor.id)).toBeUndefined()
})

test('refreshGutterDecorationsAll refreshes every open editor', async () => {
  const renderedEditors: number[] = []
  using _rendererRpc = RendererWorker.registerMockRpc({
    'Editor.renderPending'(id: number) {
      renderedEditors.push(id)
    },
  })
  using _rpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeProvidersByEvent': (_event: string, _command: string, document: { readonly uri: string }) => [
      [{ rowIndex: 0, type: document.uri.endsWith('first.txt') ? 'added' : 'deleted' }],
    ],
  })
  const first = createEditor(903, 'file:///workspace/first.txt')
  const second = createEditor(904, 'file:///workspace/second.txt')
  EditorStates.set(first.id, first, first)
  EditorStates.set(second.id, second, second)

  await refreshGutterDecorationsAll()

  expect(EditorStates.get(first.id).newState.gutterDecorations).toEqual([{ rowIndex: 0, type: 'added' }])
  expect(EditorStates.get(second.id).newState.gutterDecorations).toEqual([{ rowIndex: 0, type: 'deleted' }])
  expect(renderedEditors).toEqual([903, 904])
})
