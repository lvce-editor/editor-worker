import { afterEach, expect, jest, test } from '@jest/globals'
import { PlatformType } from '@lvce-editor/constants'
import { DialogWorker, ExtensionManagementWorker, RendererWorker } from '@lvce-editor/rpc-registry'
import * as EditorCommandSave from '../src/parts/EditorCommand/EditorCommandSave.ts'
import * as TokenizePlainText from '../src/parts/TokenizePlainText/TokenizePlainText.ts'

afterEach(() => {
  jest.restoreAllMocks()
})

test('save - shows a concise electron message box when permission is denied', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.isReadonly': async () => false,
    'FileSystem.writeFile': async () => {
      throw new Error('EACCES: permission denied')
    },
  })
  using mockDialogRpc = DialogWorker.registerMockRpc({
    'ElectronDialog.showMessageBox': async () => 0,
  })
  const editor = {
    lines: ['hello world'],
    modified: true,
    platform: PlatformType.Electron,
    uri: 'file:///tmp/read-only.txt',
  }

  const result = await EditorCommandSave.save(editor)

  expect(result).toBe(editor)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.isReadonly', 'file:///tmp/read-only.txt'],
    ['FileSystem.writeFile', 'file:///tmp/read-only.txt', 'hello world', 'utf8', false],
  ])
  expect(mockDialogRpc.invocations).toEqual([
    [
      'ElectronDialog.showMessageBox',
      {
        buttons: ['OK'],
        defaultId: 0,
        message: "You don't have permission to save changes to this file.",
        title: 'Unable to Save File',
        type: 'error',
      },
    ],
  ])
})

test('save - shows error details for other electron save errors', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.isReadonly': async () => false,
    'FileSystem.writeFile': async () => {
      throw new Error('Disk is full')
    },
  })
  using mockDialogRpc = DialogWorker.registerMockRpc({
    'ElectronDialog.showMessageBox': async () => 0,
  })
  const editor = {
    lines: ['hello world'],
    modified: true,
    platform: PlatformType.Electron,
    uri: 'file:///tmp/example.txt',
  }

  const result = await EditorCommandSave.save(editor)

  expect(result).toBe(editor)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.isReadonly', 'file:///tmp/example.txt'],
    ['FileSystem.writeFile', 'file:///tmp/example.txt', 'hello world', 'utf8', false],
  ])
  expect(mockDialogRpc.invocations).toEqual([
    [
      'ElectronDialog.showMessageBox',
      {
        buttons: ['OK'],
        defaultId: 0,
        detail: 'Failed to save file "file:///tmp/example.txt": Disk is full',
        message: 'Saving the file failed.',
        title: 'Failed to Save File',
        type: 'error',
      },
    ],
  ])
})

test('save - does not show electron message box when saving file fails outside electron', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.isReadonly': async () => false,
    'FileSystem.writeFile': async () => {
      throw new Error('EACCES: permission denied')
    },
  })
  const editor = {
    lines: ['hello world'],
    modified: true,
    platform: PlatformType.Web,
    uri: 'file:///tmp/read-only.txt',
  }

  const result = await EditorCommandSave.save(editor)

  expect(result).toBe(editor)
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.isReadonly', 'file:///tmp/read-only.txt'],
    ['FileSystem.writeFile', 'file:///tmp/read-only.txt', 'hello world', 'utf8', false],
  ])
})

test('save - clears the modified status after saving', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.isReadonly': async () => false,
    'FileSystem.writeFile': async () => {},
    'Main.handleModifiedStatusChange': async () => {},
  })
  const editor = {
    lines: ['hello world'],
    modified: true,
    platform: PlatformType.Web,
    uri: 'file:///tmp/example.txt',
  }

  const result = await EditorCommandSave.save(editor)

  expect(result).toEqual({
    ...editor,
    modified: false,
  })
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.isReadonly', 'file:///tmp/example.txt'],
    ['FileSystem.writeFile', 'file:///tmp/example.txt', 'hello world', 'utf8', false],
    ['Main.handleModifiedStatusChange', 'file:///tmp/example.txt', false],
  ])
})

for (const formatOnSave of [true, false]) {
  test(`save - formatOnSave=${formatOnSave} writes the expected content in the owning application`, async () => {
    using mockRpc = RendererWorker.registerMockRpc({
      'Application.execute': async (_applicationId: string, method: string) => (method === 'FileSystem.isReadonly' ? false : undefined),
    })
    using mockExtensionRpc = ExtensionManagementWorker.registerMockRpc({
      'Extensions.invokeForApplication': async () => [{ endOffset: 9, inserted: 'let x = 1\n', startOffset: 0 }],
    })
    const editor = {
      applicationId: 'source',
      decorations: [],
      formatOnSave,
      id: 1,
      invalidStartIndex: 0,
      languageId: 'typescript',
      lineCache: [],
      lines: ['let x=1; '],
      minLineY: 0,
      modified: true,
      numberOfVisibleLines: 0,
      platform: PlatformType.Web,
      selections: new Uint32Array([0, 0, 0, 0]),
      tokenizer: TokenizePlainText,
      uid: 1,
      undoStack: [],
      uri: 'memfs:///sample/main.ts',
    }

    const result = await EditorCommandSave.save(editor)

    expect(result.lines).toEqual(formatOnSave ? ['let x = 1', ''] : editor.lines)
    expect(result.modified).toBe(false)
    expect(mockRpc.invocations).toContainEqual([
      'Application.execute',
      'source',
      'FileSystem.writeFile',
      editor.uri,
      formatOnSave ? 'let x = 1\n' : 'let x=1; ',
      'utf8',
      false,
    ])
    expect(mockExtensionRpc.invocations).toEqual(
      formatOnSave
        ? [
            [
              'Extensions.invokeForApplication',
              'source',
              'Extensions.executeFormattingProvider',
              { documentId: 1, languageId: 'typescript', text: 'let x=1; ', uri: editor.uri },
            ],
          ]
        : [],
    )
  })
}
