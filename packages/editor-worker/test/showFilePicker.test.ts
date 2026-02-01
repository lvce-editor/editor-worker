import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'

const showFilePicker = await import('../src/parts/EditorCommand/EditorCommandSave/showFilePicker.ts')

test('showFilePicker - returns file path', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'ElectronDialog.showOpenDialog': async () => {
      return ['file.txt']
    },
  })

  const result = await showFilePicker.showFilePicker()

  expect(result).toBe('file.txt')
  expect(mockRpc.invocations).toHaveLength(1)
  expect(mockRpc.invocations[0]).toEqual(['ElectronDialog.showOpenDialog', 'Save File', ['openFile', 'dontAddToRecent', 'showHiddenFiles']])

  mockRpc.dispose()
})

test('showFilePicker - returns undefined when no file selected', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'ElectronDialog.showOpenDialog': async () => {
      return []
    },
  })

  const result = await showFilePicker.showFilePicker()

  expect(result).toBeUndefined()
  expect(mockRpc.invocations).toHaveLength(1)

  mockRpc.dispose()
})

test('showFilePicker - passes correct dialog options', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'ElectronDialog.showOpenDialog': async (...params: any[]) => {
      return ['result.ts']
    },
  })

  const result = await showFilePicker.showFilePicker()

  expect(result).toBe('result.ts')
  expect(mockRpc.invocations).toHaveLength(1)
  expect(mockRpc.invocations[0]).toEqual(['ElectronDialog.showOpenDialog', 'Save File', ['openFile', 'dontAddToRecent', 'showHiddenFiles']])

  mockRpc.dispose()
})
