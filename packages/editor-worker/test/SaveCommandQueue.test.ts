import { afterEach, expect, jest, test } from '@jest/globals'
import { PlatformType } from '@lvce-editor/constants'
import { OpenerWorker, RendererWorker } from '@lvce-editor/rpc-registry'

jest.unstable_mockModule('../src/parts/UpdateDerivedState/UpdateDerivedState.ts', () => ({
  updateDerivedState: async (_oldState: unknown, newState: unknown) => newState,
}))
jest.unstable_mockModule('../src/parts/RenameWorker/RenameWorker.ts', () => ({ dispose: async () => {} }))
jest.unstable_mockModule('../src/parts/NotifyEditorStatusChange/NotifyEditorStatusChange.ts', () => ({
  initializeListener: async () => {},
  notifyEditorStatusChange: async () => {},
  notifyEditorStatusCleared: async () => {},
}))
const { commandMap } = await import('../src/parts/CommandMap/CommandMap.ts')
const Editors = await import('../src/parts/EditorStates/EditorStates.ts')

afterEach(() => Editors.dispose(1))

test('untitled save can retarget through the real editor command queue', async () => {
  const destination = 'file:///tmp/saved.txt'
  const editor: any = { lines: ['exact content'], modified: true, platform: PlatformType.Web, uid: 1, uri: 'untitled:///1' }
  Editors.set(1, editor, editor)
  using opener = OpenerWorker.registerMockRpc({
    'Open.showSaveDialog': async () => ({ canceled: false, filePath: destination }),
  })
  using renderer = RendererWorker.registerMockRpc({
    'FileSystem.writeFile': async () => {},
    'Layout.handleWorkspaceRefresh': async () => {},
    'Main.handleModifiedStatusChange': async () => {},
    'Main.handleUriChange': async (_oldUri: string, newUri: string) => {
      await commandMap['Editor.handleUriChange'](1, newUri)
    },
  })
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    const result = await Promise.race([
      (async () => {
        await commandMap['Editor.save'](1)
        return 'saved'
      })(),
      new Promise<string>((resolve) => {
        timer = setTimeout(resolve, 500, 'deadlocked')
      }),
    ])
    expect(result).toBe('saved')
  } finally {
    clearTimeout(timer)
  }
  expect(Editors.get(1).newState).toMatchObject({ lines: ['exact content'], modified: false, uri: destination })
  expect(renderer.invocations).toContainEqual(['Main.handleUriChange', 'untitled:///1', destination])
  expect(opener.invocations).toHaveLength(1)
})
