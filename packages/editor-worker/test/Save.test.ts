import { afterEach, expect, jest, test } from '@jest/globals'
import { PlatformType } from '@lvce-editor/constants'
import { DialogWorker, ExtensionManagementWorker, OpenerWorker, RendererWorker } from '@lvce-editor/rpc-registry'
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

test('save - saves an untitled file and reuses the selected destination', async () => {
  const uri = 'untitled:///1'
  const destination = 'file:///tmp/new-file.txt'
  using mockOpenerRpc = OpenerWorker.registerMockRpc({
    'Open.showSaveDialog': async () => ({ canceled: false, filePath: destination }),
  })
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.isReadonly': async () => false,
    'FileSystem.writeFile': async () => {},
    'Layout.handleWorkspaceRefresh': async () => {},
    'Main.handleModifiedStatusChange': async () => {},
    'Main.handleUriChange': async () => {},
  })
  const editor = {
    lines: ['hello world'],
    modified: true,
    platform: PlatformType.Web,
    uri,
  }

  const saved = await EditorCommandSave.save(editor)

  expect(saved).toEqual({ ...editor, modified: false, uri: destination })
  expect(mockOpenerRpc.invocations).toEqual([['Open.showSaveDialog', 'Save File', [], PlatformType.Web]])
  expect(mockRpc.invocations).toEqual([
    ['FileSystem.writeFile', destination, 'hello world'],
    ['Layout.handleWorkspaceRefresh'],
    ['Main.handleModifiedStatusChange', uri, false],
  ])

  const edited = { ...saved, lines: ['updated content'], modified: true }
  const savedAgain = await EditorCommandSave.save(edited)

  expect(savedAgain).toEqual({ ...edited, modified: false })
  expect(mockOpenerRpc.invocations).toHaveLength(1)
  expect(mockRpc.invocations.slice(3)).toEqual([
    ['FileSystem.isReadonly', destination],
    ['FileSystem.writeFile', destination, 'updated content', 'utf8', false],
    ['Main.handleModifiedStatusChange', destination, false],
  ])
})

test('save - keeps an untitled document dirty when the save dialog is canceled', async () => {
  using mockOpenerRpc = OpenerWorker.registerMockRpc({
    'Open.showSaveDialog': async () => ({ canceled: true, filePath: '' }),
  })
  using mockRpc = RendererWorker.registerMockRpc({})
  const editor = {
    lines: ['unsaved content'],
    modified: true,
    platform: PlatformType.Web,
    uri: 'untitled:///1',
  }

  const result = await EditorCommandSave.save(editor)

  expect(result).toBe(editor)
  expect(mockOpenerRpc.invocations).toHaveLength(1)
  expect(mockRpc.invocations).toEqual([])
})

test('save - keeps an untitled document dirty when writing the selected file fails', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
  using mockOpenerRpc = OpenerWorker.registerMockRpc({
    'Open.showSaveDialog': async () => ({ canceled: false, filePath: 'file:///tmp/new-file.txt' }),
  })
  using mockRpc = RendererWorker.registerMockRpc({
    'FileSystem.writeFile': async () => {
      throw new Error('Disk is full')
    },
  })
  const editor = {
    lines: ['unsaved content'],
    modified: true,
    platform: PlatformType.Web,
    uri: 'untitled:///1',
  }

  const result = await EditorCommandSave.save(editor)

  expect(result).toBe(editor)
  expect(mockOpenerRpc.invocations).toHaveLength(1)
  expect(mockRpc.invocations).toEqual([['FileSystem.writeFile', 'file:///tmp/new-file.txt', 'unsaved content']])
})

for (const [formatOnSave, modified] of [
  [true, true],
  [true, false],
  [false, true],
  [false, false],
]) {
  test(`save - formatOnSave=${formatOnSave}, modified=${modified} writes the expected content in the owning application`, async () => {
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
      modified,
      numberOfVisibleLines: 0,
      platform: PlatformType.Web,
      selections: new Uint32Array([0, 4, 0, 4]),
      tokenizer: TokenizePlainText,
      uid: 1,
      undoStack: [],
      uri: 'memfs:///sample/main.ts',
    }

    const result = await EditorCommandSave.save(editor)

    expect(result.lines).toEqual(formatOnSave ? ['let x = 1', ''] : editor.lines)
    expect(result.modified).toBe(false)
    expect(result.selections).toEqual(new Uint32Array([0, 4, 0, 4]))
    expect(mockRpc.invocations).toContainEqual([
      'Application.execute',
      'source',
      'FileSystem.writeFile',
      editor.uri,
      formatOnSave ? 'let x = 1\n' : 'let x=1; ',
      'utf8',
      false,
    ])
    const modifiedNotifications = mockRpc.invocations.filter((invocation) => invocation[2] === 'Main.handleModifiedStatusChange')
    expect(modifiedNotifications.at(-1)).toEqual(
      formatOnSave || modified ? ['Application.execute', 'source', 'Main.handleModifiedStatusChange', editor.uri, false] : undefined,
    )
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

test('save without formatting skips the formatter for one save and preserves format-on-save', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Application.execute': async (_applicationId: string, method: string) => (method === 'FileSystem.isReadonly' ? false : undefined),
  })
  using mockExtensionRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.invokeForApplication': async () => [{ endOffset: 9, inserted: 'let x = 1\n', startOffset: 0 }],
  })
  const editor = {
    applicationId: 'source',
    decorations: [],
    formatOnSave: true,
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

  const savedWithoutFormatting = await EditorCommandSave.save(editor, true)
  expect(savedWithoutFormatting.lines).toEqual(editor.lines)
  expect(savedWithoutFormatting.modified).toBe(false)
  expect(savedWithoutFormatting.formatOnSave).toBe(true)
  expect(mockExtensionRpc.invocations).toEqual([])
  expect(mockRpc.invocations).toContainEqual(['Application.execute', 'source', 'FileSystem.writeFile', editor.uri, 'let x=1; ', 'utf8', false])

  await EditorCommandSave.save(savedWithoutFormatting)

  expect(mockExtensionRpc.invocations).toEqual([
    [
      'Extensions.invokeForApplication',
      'source',
      'Extensions.executeFormattingProvider',
      { documentId: 1, languageId: 'typescript', text: 'let x=1; ', uri: editor.uri },
    ],
  ])
})
