import { afterEach, expect, jest, test } from '@jest/globals'
import { PlatformType } from '@lvce-editor/constants'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as EditorCommandSave from '../src/parts/EditorCommand/EditorCommandSave.ts'

afterEach(() => {
  jest.restoreAllMocks()
})

test('save - shows electron message box when saving file fails', async () => {
  jest.spyOn(console, 'error').mockImplementation(() => {})
  using mockRpc = RendererWorker.registerMockRpc({
    'ElectronDialog.showMessageBox': async () => {
      return 0
    },
    'FileSystem.writeFile': async () => {
      throw new Error('EACCES: permission denied')
    },
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
    ['FileSystem.writeFile', 'file:///tmp/read-only.txt', 'hello world'],
    [
      'ElectronDialog.showMessageBox',
      {
        buttons: ['OK'],
        defaultId: 0,
        detail: 'Failed to save file "file:///tmp/read-only.txt": EACCES: permission denied',
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
  expect(mockRpc.invocations).toEqual([['FileSystem.writeFile', 'file:///tmp/read-only.txt', 'hello world']])
})
